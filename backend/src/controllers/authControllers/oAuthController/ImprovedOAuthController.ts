import { NextFunction, Request, Response } from "express";
import { Controller, Route } from "../../../decorators";
import { API } from "../../../constants";
import { GoogleOAuthService } from "./GoogleOAuthService";
import { logging } from "../../../utils";

@Controller(`${API}/auth`)
export default class ImprovedOAuthController {
  private googleOAuthService: GoogleOAuthService;

  constructor() {
    this.googleOAuthService = new GoogleOAuthService();
  }

  /**
   * Initiate Google OAuth flow - returns auth URL for mobile deep linking
   */
  @Route("get", "/google")
  async googleAuth(req: Request, res: Response): Promise<Response> {
    try {
      logging.info("Google OAuth initiation requested");
      
      const state = req.query.state as string;
      const authUrl = this.googleOAuthService.generateAuthUrl(state);
      
      // For mobile apps, return JSON with auth URL
      if (req.headers['user-agent']?.includes('Mobile') || req.query.mobile === 'true') {
        return res.status(200).json({
          success: true,
          authUrl,
          message: "Please complete authentication in your browser"
        });
      }
      
      // For web, redirect directly
      res.redirect(authUrl);
      return res;
      
    } catch (error: any) {
      logging.error("OAuth initiation error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to initiate authentication"
      });
    }
  }

  /**
   * Handle OAuth callback from Google
   */
  @Route("get", "/google/callback")
  async googleCallback(req: Request, res: Response): Promise<Response | void> {
    try {
      const { code, state, error } = req.query;
      
      logging.info("OAuth callback received", { 
        hasCode: !!code, 
        hasState: !!state, 
        error: error || 'none' 
      });

      // Handle OAuth errors
      if (error) {
        return this.handleOAuthError(res, error as string);
      }

      if (!code) {
        return this.handleOAuthError(res, "No authorization code received");
      }

      // Process the OAuth callback
      const result = await this.googleOAuthService.handleCallback(
        code as string, 
        state as string
      );

      if (!result.success) {
        return this.handleOAuthError(res, result.error || "Authentication failed");
      }

      // Success - handle based on client type
      return this.handleAuthSuccess(res, result);

    } catch (error: any) {
      logging.error("OAuth callback processing error:", error);
      return this.handleOAuthError(res, "Authentication processing failed");
    }
  }

  /**
   * Refresh access token endpoint
   */
  @Route("post", "/google/refresh")
  async refreshToken(req: Request, res: Response): Promise<Response> {
    try {
      const { refreshToken, userId } = req.body;

      if (!refreshToken || !userId) {
        return res.status(400).json({
          success: false,
          error: "Missing refresh token or user ID"
        });
      }

      const result = await this.googleOAuthService.refreshAccessToken(refreshToken, userId);

      if (!result.success) {
        return res.status(401).json({
          success: false,
          error: result.error || "Failed to refresh token"
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          accessToken: result.tokens?.accessToken,
          refreshToken: result.tokens?.refreshToken
        },
        message: "Token refreshed successfully"
      });

    } catch (error: any) {
      logging.error("Token refresh error:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error during token refresh"
      });
    }
  }

  /**
   * Revoke user's Google tokens
   */
  @Route("post", "/google/revoke")
  async revokeTokens(req: Request, res: Response): Promise<Response> {
    try {
      const { accessToken } = req.body;

      if (!accessToken) {
        return res.status(400).json({
          success: false,
          error: "Access token required"
        });
      }

      const revoked = await this.googleOAuthService.revokeTokens(accessToken);

      return res.status(200).json({
        success: revoked,
        message: revoked ? "Tokens revoked successfully" : "Failed to revoke tokens"
      });

    } catch (error: any) {
      logging.error("Token revocation error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to revoke tokens"
      });
    }
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(res: Response, result: any): Response | void {
    const { user, tokens } = result;

    // For mobile apps - return JSON response
    if (this.isMobileRequest(res.req)) {
      return res.status(200).json({
        success: true,
        data: {
          user: this.sanitizeUser(user),
          accessToken: tokens?.accessToken,
          refreshToken: tokens?.refreshToken
        },
        message: "Authentication successful"
      });
    }

    // For web apps - return HTML with postMessage for WebView
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Successful</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              padding: 2rem;
              border-radius: 12px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
              text-align: center;
              max-width: 400px;
            }
            .success-icon {
              color: #10b981;
              font-size: 3rem;
              margin-bottom: 1rem;
            }
            h1 { color: #1f2937; margin-bottom: 0.5rem; }
            p { color: #6b7280; margin-bottom: 1.5rem; }
            .user-info {
              background: #f9fafb;
              padding: 1rem;
              border-radius: 8px;
              margin-bottom: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success-icon">✓</div>
            <h1>Welcome!</h1>
            <p>You have successfully signed in with Google.</p>
            <div class="user-info">
              <strong>${user.Name || user.Email}</strong>
            </div>
            <p>Redirecting to app...</p>
          </div>
          
          <script>
            const authData = {
              success: true,
              data: {
                user: ${JSON.stringify(this.sanitizeUser(user))},
                accessToken: "${tokens?.accessToken}",
                refreshToken: "${tokens?.refreshToken}"
              },
              message: "Authentication successful"
            };
            
            // Send to React Native WebView
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify(authData));
            }
            
            // Fallback redirect for web
            setTimeout(() => {
              if (!window.ReactNativeWebView) {
                window.location.href = '${process.env.FRONTEND_URL || '/'}';
              }
            }, 2000);
          </script>
        </body>
      </html>
    `);
  }

  /**
   * Handle OAuth errors
   */
  private handleOAuthError(res: Response, error: string): Response | void {
    logging.error("OAuth error:", error);

    // For mobile apps
    if (this.isMobileRequest(res.req)) {
      return res.status(400).json({
        success: false,
        error: error
      });
    }

    // For web/WebView
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Failed</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            }
            .container {
              background: white;
              padding: 2rem;
              border-radius: 12px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
              text-align: center;
              max-width: 400px;
            }
            .error-icon {
              color: #ef4444;
              font-size: 3rem;
              margin-bottom: 1rem;
            }
            h1 { color: #1f2937; margin-bottom: 0.5rem; }
            p { color: #6b7280; margin-bottom: 1.5rem; }
            .retry-btn {
              background: #3b82f6;
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 8px;
              cursor: pointer;
              font-size: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error-icon">✗</div>
            <h1>Authentication Failed</h1>
            <p>${error}</p>
            <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
          </div>
          
          <script>
            // Send error to React Native WebView
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                success: false,
                error: "${error}"
              }));
            }
          </script>
        </body>
      </html>
    `);
  }

  /**
   * Check if request is from mobile app
   */
  private isMobileRequest(req: any): boolean {
    const userAgent = req.headers['user-agent'] || '';
    return userAgent.includes('Mobile') || 
           userAgent.includes('ReactNative') || 
           req.query.mobile === 'true';
  }

  /**
   * Remove sensitive data from user object
   */
  private sanitizeUser(user: any): any {
    const { Password, AccessToken, RefreshToken, ...sanitized } = user;
    return sanitized;
  }
}
