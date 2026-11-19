import { NextFunction, Request, Response } from "express";
import { Controller, Route } from "../../../decorators";
import passport from "passport";
import { DBTable, Error, Success, UserQuery } from "../../../shared";
import { API } from "../../../constants";
import axios from "axios";
import { GetService, UpdateService } from "../../../services";
import { logging } from "../../../utils";
import { withoutSecrets } from "../../../functions/security";

@Controller(`${API}/auth`)
export default class OAuthController {
  @Route("get", "/google")
  async googleAuth(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    // Don't log request headers or query: they carry tokens, cookies and auth codes
    logging.info("=== Google OAuth initiated ===");

    const authOptions = {
      scope: ["email", "profile"],
      accessType: "offline",
      prompt: "consent",
      state: JSON.stringify({
        referer: req.headers.referer,
        timestamp: new Date().toISOString()
      })
    };
    
    logging.info("OAuth options:", JSON.stringify(authOptions, null, 2));
    passport.authenticate("google", authOptions)(req, res, next);
  }

  @Route("get", "/google/redirect")
  async googleRedirect(req: Request, res: Response) {
    await this.handleOAuthCallback(req, res);
  }

  @Route("post", "/google/redirect")
  async googleRedirectPost(req: Request, res: Response) {
    await this.handleOAuthCallback(req, res);
  }

  private async handleOAuthCallback(req: Request, res: Response) {
    logging.info("=== Google OAuth redirect received ===");

    passport.authenticate("google", async (err: any, user: any) => {
      try {
        // Only a summary: the user record holds a password hash and Google tokens
        logging.info("OAuth callback:", err ? `error: ${err.message}` : user ? `user #${user.Id}` : "no user");
        if (err) {
          logging.error("OAuth error:", err);
          return res.status(200).send(`
            <html><body><script>
              console.log("Backend OAuth error: ${err.message || 'Unknown error'}");
              window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                error: true,
                message: "Google authentication failed: ${err.message || 'Unknown error'}"
              }));
            </script></body></html>
          `);
        }
        
        if (!user) {
          logging.error("No user returned from Google OAuth");
          return res.status(200).send(`
            <html><body><script>
              window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                error: true,
                message: "No user data received from Google"
              }));
            </script></body></html>
          `);
        }

        req.login(user, (loginErr) => {
          if (loginErr) {
            logging.error("Login error:", loginErr);
            return res.status(200).send(`
              <html><body><script>
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                  error: true,
                  message: "Failed to complete login process"
                }));
              </script></body></html>
            `);
          }
          
          const accessToken: string = user.AccessToken;
          const refreshToken: string = user.RefreshToken;
          // No password hash or stored tokens in the user object; "<" escaped so a name can't break out of the script tag
          const safeUser = JSON.stringify(withoutSecrets(user)).replace(/</g, "\\u003c");

          // Send success response as HTML with embedded script
          return res.status(200).send(`
            <html>
              <head><title>Authentication Successful</title></head>
              <body>
                <script>
                  const authData = {
                    data: {
                      success: true,
                      user: ${safeUser},
                      accessToken: "${accessToken}",
                      refreshToken: "${refreshToken}"
                    },
                    message: "${Success.m001}"
                  };
                  
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify(authData));
                  } else {
                    // Fallback for debugging
                    document.body.innerHTML = '<pre>' + JSON.stringify(authData, null, 2) + '</pre>';
                  }
                </script>
                <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
                  <h2>Authentication Successful!</h2>
                  <p>Redirecting to app...</p>
                </div>
              </body>
            </html>
          `);
        });
      } catch (error: any) {
        logging.error("Unexpected OAuth error:", error);
        return res.status(200).send(`
          <html><body><script>
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
              error: true,
              message: "Unexpected authentication error occurred"
            }));
          </script></body></html>
        `);
      }
    })(req, res);
  }

  @Route("post", "/refresh-google/:Id")
  async refresh(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    // No login check here: the app calls this exactly when its Google login has expired.
    // Instead, the refreshed token must belong to this user's own Google account
    // (verified with Google), so nobody can overwrite someone else's stored token.
    try {
      const Id = parseInt(req.params.Id, 10);
      const { refreshToken } = req.body ?? {};
      if (!Id || typeof refreshToken !== "string" || !refreshToken)
        return res.status(400).json({ data: false, message: Error.m014 });

      let newAccessToken: string;
      try {
        const response = await axios.post("https://oauth2.googleapis.com/token", {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        });
        newAccessToken = response.data.access_token;
      } catch {
        return res.status(401).json({ data: false, message: Error.m021 }); // Google refused the refresh token
      }

      const { data: tokenInfo } = await axios.get("https://oauth2.googleapis.com/tokeninfo", { params: { access_token: newAccessToken } });
      const [account] = await GetService.byFields(UserQuery.q0014, ["Id"], [Number], [Id]);
      const sameApp = tokenInfo?.aud === process.env.GOOGLE_CLIENT_ID || tokenInfo?.azp === process.env.GOOGLE_CLIENT_ID;
      const sameAccount = !!account && String(tokenInfo?.email ?? "").toLowerCase() === String(account.Email ?? "").toLowerCase();
      if (!sameApp || !sameAccount)
        return res.status(403).json({ data: false, message: Error.m035 });

      await UpdateService.record(Id, DBTable.t007, ["AccessToken","DateUpdated"], [String, Date], [newAccessToken, new Date()]);
      return res
        .status(200)
        .json({ data: newAccessToken, message: Success.m001 });
    } catch (error: any) {
      logging.info("----------------------------------------");
      logging.error("oAuth-Controller [refresh-google]:", error.message);
      logging.info("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }
}
