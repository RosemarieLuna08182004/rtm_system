import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Error } from "../shared/messages";
import { UserQuery } from "../shared/query/setup/userQuery";
import { SECRET_KEY } from "../config";
import { LoginRequest, Roles } from "../types";
import { GetService } from "../services";
import axios from "axios"
export default class TokenHandler {
  /**
   * The caller's account, read fresh from the database so a role change applies at once.
   * Our JWT carries { Id }; a Google token (X-Auth-Provider) carries the email instead.
   */
  private static findCurrentUser = async (req: LoginRequest): Promise<LoginRequest["CurrentUser"] | null> => {
    const user = req.User as { Id?: number | string; email?: string } | undefined;
    let rows: any[] = [];
    if (user?.Id) rows = await GetService.byFields(UserQuery.q0014, ["Id"], [Number], [user.Id]);
    else if (user?.email) rows = await GetService.byFields(UserQuery.q0015, ["Email"], [String], [user.email]);
    return rows[0] ?? null;
  };

  /** Use after verifyToken: only administrators may continue. */
  static verifyAdmin = async (req: LoginRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      const current = await TokenHandler.findCurrentUser(req);
      if (!current) return res.status(401).json({ success: false, message: Error.m018 });
      if (current.AccountType !== Roles.admin) return res.status(403).json({ success: false, message: Error.m034 });
      req.CurrentUser = current;
      next();
    } catch (error: any) {
      return res.status(500).json({ success: false, message: Error.m001 });
    }
  };

  /** Use after verifyToken: administrators, or the account named by req.params[param]. */
  static verifySelfOrAdmin = (param: string = "Id") =>
    async (req: LoginRequest, res: Response, next: NextFunction): Promise<any> => {
      try {
        const current = await TokenHandler.findCurrentUser(req);
        if (!current) return res.status(401).json({ success: false, message: Error.m018 });
        if (current.AccountType !== Roles.admin && String(current.Id) !== String(req.params[param]))
          return res.status(403).json({ success: false, message: Error.m035 });
        req.CurrentUser = current;
        next();
      } catch (error: any) {
        return res.status(500).json({ success: false, message: Error.m001 });
      }
    };

  /**
   * Use after verifyToken on routes that act on one bookmark/progress record (userterms,
   * by req.params[param]): only its owner or an administrator may continue.
   */
  static verifyBookmarkOwner = (param: string = "Id") =>
    async (req: LoginRequest, res: Response, next: NextFunction): Promise<any> => {
      try {
        const current = await TokenHandler.findCurrentUser(req);
        if (!current) return res.status(401).json({ success: false, message: Error.m018 });
        const Id = Number(req.params[param]);
        if (!Number.isInteger(Id) || Id <= 0) return res.status(404).json({ success: false, message: Error.m011 });
        let rows: any[] = [];
        try { rows = await GetService.byFields("SELECT `UserId` FROM `userterms` WHERE `Id` = ?", ["Id"], [Number], [Id]); }
        catch { rows = []; } // the service throws when nothing matches
        if (!rows[0]) return res.status(404).json({ success: false, message: Error.m011 });
        if (current.AccountType !== Roles.admin && String(rows[0].UserId) !== String(current.Id))
          return res.status(403).json({ success: false, message: Error.m035 });
        req.CurrentUser = current;
        next();
      } catch (error: any) {
        return res.status(500).json({ success: false, message: Error.m001 });
      }
    };

  static verifyToken = async (
    req: LoginRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> => {
    const authorizationHeader = req.headers["authorization"];
    const refreshToken = req.headers["refresh-token"] as string;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) return res.status(403).json({ success: false, message: Error.m004 });
    const accessToken = authorizationHeader.split(" ")[1];
    if (req.headers["x-auth-provider"]) return this.verifyGoogleToken(req, res, next);
    else {
      jwt.verify(
        accessToken,
        SECRET_KEY,
        (error: jwt.VerifyErrors | null, User: any) => {
          if (error) {
            if (error.name === "TokenExpiredError") return res.status(401).json({ success: false, message: "Token expired" });
            return res.status(403).json({ success: false, message: Error.m004 });
          }
          req.User = User;
          req.AccessToken = accessToken;
          req.RefreshToken = refreshToken;
          next();
        },
      );
    }
  };

  static verifyGoogleToken = async (
    req: LoginRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const accessToken = req.headers['authorization']?.split(' ')[1];
    const refreshToken = req.headers["refresh-token"] as string;
    if (!accessToken) return res.status(403).json({ error: 'Access token is missing' });
    try {
      const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`);
      const tokenInfo = response.data;
      if (tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID) return res.status(403).json({ success: false, message: Error.m026 });
      const currentTime = Math.floor(Date.now() / 1000);
      if (parseInt(tokenInfo.exp, 10) < currentTime) return res.status(403).json({ success: false, message: Error.m025 });
      req.User = tokenInfo;
      req.AccessToken = accessToken;
      req.RefreshToken = refreshToken;
      next();
    } catch (error) {
      return res.status(403).json({ success: false, message: Error.m004 });
    }
  };

  // Refresh Access Token using the Refresh Token
  static refresh = async (
    req: LoginRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const refreshToken = req.headers["refresh-token"] as string;
    if (!refreshToken) return res.status(403).json({ success: false, message: Error.m023 });

    jwt.verify(
      refreshToken,
      SECRET_KEY,
      (error: jwt.VerifyErrors | null, User: any) => {
        if (error) {
          return res.status(403).json({ success: false, message: Error.m004 });
        }

        const newAccessToken = jwt.sign({ User: User }, SECRET_KEY, {
          expiresIn: "1d",
        });

        res.setHeader("Authorization", `Bearer ${newAccessToken}`);
        return res.status(200).json({
          success: true,
          accessToken: newAccessToken,
        });
      },
    );
  };
}
