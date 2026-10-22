import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Error } from "../shared/messages";
import { SECRET_KEY } from "../config";
import { LoginRequest } from "../types";
export default class TokenHandler {
  static verifyToken = async (
    req: LoginRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> => {
    const authorizationHeader = req.headers["authorization"];
    const refreshToken = req.headers["refresh-token"] as string;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) return res.status(403).json({ success: false, message: Error.m004 });
    const accessToken = authorizationHeader.split(" ")[1];
    jwt.verify(
      accessToken,
      SECRET_KEY,
      (error: jwt.VerifyErrors | null, User: any) => {
        if (error) {
          if (error.name === "TokenExpiredError") return res.status(401).json({ success: false, message: "Token expired" });
          return res.status(403).json({ success: false, message: Error.m004 });
        }
        // A refresh token is never a valid access token.
        if (User?.type === "refresh") return res.status(401).json({ success: false, message: Error.m004 });
        req.User = User;
        req.AccessToken = accessToken;
        req.RefreshToken = refreshToken;
        next();
      },
    );
  };
}
