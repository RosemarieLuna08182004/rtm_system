import { NextFunction, Request, Response } from "express";
import { Controller, Route, Validate } from "../../../decorators";
import { forgotPasswordValidator, loginValidator, resetPasswordValidator } from "../../../validators";
import { API } from "../../../constants";
import { TokenHandler, authLimiter } from "../../../middleware";
import { LoginRequest, ModelResponse } from "../../../types";
import { Success, Error, UserQuery } from "../../../shared";
import {
  GenerateFn,
  getByEmail,
  GOOGLE_PLACEHOLDER_PASSWORD,
  toSafeUser,
  createResetChallenge,
  createDecoyResetToken,
  readResetToken,
  isResetCodeValid,
} from "../../../functions";
import { UserModel } from "../../../models";
import { isMailConfigured, sendMail } from "../../../services/mail/mailService";
import { GetService } from "../../../services";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { NODE_ENV, SECRET_KEY, SECRET_REFRESH_KEY } from "../../../config";

// Resolves the user Id for a refresh request, or 0 when no valid credential is given.
export const getRefreshUserId = (req: LoginRequest): number => {
  const refreshToken = req.body?.refreshToken || req.headers["refresh-token"];
  if (refreshToken) {
    try {
      const payload: any = jwt.verify(String(refreshToken), SECRET_REFRESH_KEY);
      return Number(payload?.UserId) || 0;
    } catch {
      return 0;
    }
  }
  const header = req.headers["authorization"];
  if (header?.startsWith("Bearer ")) {
    try {
      const payload: any = jwt.verify(header.split(" ")[1], SECRET_KEY);
      if (payload?.type === "refresh") return 0;
      return Number(payload?.Id) || 0;
    } catch {
      return 0;
    }
  }
  return 0;
};

const refreshSession = async (req: LoginRequest, res: Response): Promise<Response> => {
  try {
    const userId = getRefreshUserId(req);
    if (!userId) return res.status(401).json({ data: false, message: Error.m025 });
    // The account must still exist.
    const [account] = await GetService.byFields(UserQuery.q002, ["Id"], [Number], [userId]);
    if (!account) return res.status(401).json({ data: false, message: Error.m025 });
    const accessToken: ModelResponse = await GenerateFn.accessToken(userId);
    const refreshToken: ModelResponse = await GenerateFn.refreshToken(userId);
    if (!accessToken.data || !refreshToken.data)
      return res.status(500).json({ data: false, message: Error.m003 });
    res.setHeader("Authorization", `Bearer ${accessToken.data}`);
    res.setHeader("Refresh-Token", refreshToken.data);
    return res.status(200).json({
      data: {
        user: userId,
        roles: account.AccountType,
        accessToken: accessToken.data,
        refreshToken: refreshToken.data,
      },
      message: Success.m001,
    });
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("JWTAuth-Controller [refresh]:", error.message);
    logging.log("----------------------------------------");
    return res.status(500).json({ data: false, message: Error.m001 });
  }
};

@Controller(`${API}/auth`)
export default class AuthController {
  @Route("get", "/logout")
  async logout(
    req: LoginRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      req.User = undefined;
      req.AccessToken = undefined;
      req.RefreshToken = undefined;
      return res.status(200).json({ data: true, message: Success.m001 });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("JWTAuth-Controller [logout]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }

  // Issues a new access token and a rotated refresh token.
  // Preferred: send the refresh token (body `refreshToken` or `Refresh-Token` header);
  // it is accepted even after the access token has expired.
  // Legacy (older app builds): a still-valid access token in `Authorization`.
  @Route("get", "/refresh", authLimiter)
  async refresh(
    req: LoginRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    return refreshSession(req, res);
  }

  @Route("post", "/refresh", authLimiter)
  async refreshPost(
    req: LoginRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    return refreshSession(req, res);
  }

  @Route("post", "/login", authLimiter)
  @Validate(loginValidator)
  async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const data = req.body;
      const user = await getByEmail(String(data?.Email ?? "").trim());
      // Same response for unknown email and wrong password, so accounts can't be probed.
      // The Google placeholder password is never a valid login.
      if (
        !user.data ||
        data.Password === GOOGLE_PLACEHOLDER_PASSWORD ||
        !(await compare(data.Password, user.data.Password))
      )
        return res.status(401).json({ data: false, message: Error.m019 });
      const accessToken: ModelResponse = await GenerateFn.accessToken(
        parseInt(user.data.Id, 10),
      );
      const refreshToken: ModelResponse = await GenerateFn.refreshToken(
        parseInt(user.data.Id, 10),
      );
      if (!accessToken.data || !refreshToken.data)
        return res.status(404).json({ data: false, message: Error.m004 });
      res.setHeader("Authorization", `Bearer ${accessToken.data}`);
      res.setHeader("Refresh-Token", refreshToken.data);
      return res.status(200).json({
        data: {
          success: true,
          user: toSafeUser(user.data),
          accessToken: accessToken.data,
          refreshToken: refreshToken.data,
        },
        message: Success.m001,
      });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("JWTAuth-Controller [login]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }

  @Route("post", "/verify-password", authLimiter, TokenHandler.verifyToken)
  async verifyPassword(
    req: LoginRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const data = req.body;
      // Always checks the caller's own account; any Email in the body is ignored.
      const [account] = await GetService.byFields(
        UserQuery.q002,
        ["Id"],
        [Number],
        [Number(req.User?.Id ?? 0)],
      );
      if (!account)
        return res.status(401).json({ data: false, message: Error.m024 });
      if (
        data.Password === GOOGLE_PLACEHOLDER_PASSWORD ||
        !(await compare(String(data.Password ?? ""), account.Password))
      )
        return res.status(401).json({ data: false, message: Error.m024 });
      return res.status(200).json({ data: true, message: Success.m001 });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("JWTAuth-Controller [verify-password]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }

  // Step 1: always answers the same way, whether or not the email has an account.
  // A 6-digit code is emailed; the app keeps the returned resetToken for step 2.
  @Route("post", "/forgot-password", authLimiter)
  @Validate(forgotPasswordValidator)
  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      if (!isMailConfigured() && NODE_ENV !== "development")
        return res.status(503).json({ data: false, message: Error.m039 });
      const user = await getByEmail(String(req.body.Email).trim().toLowerCase());
      let resetToken = createDecoyResetToken();
      if (user.data?.Id) {
        const challenge = createResetChallenge(Number(user.data.Id), user.data.Password);
        resetToken = challenge.token;
        if (isMailConfigured()) {
          // Not awaited: known and unknown emails must take the same time to answer.
          sendMail(
            user.data.Email,
            "Roots & Morphology password reset code",
            `Your password reset code is ${challenge.code}.\n\nIt expires in 15 minutes. If you did not ask to reset your password, you can ignore this email.`,
          ).catch((error) => logging.error("Password reset email failed:", error.message));
        } else {
          // Local development only: no mail server configured.
          logging.info("[dev] Password reset code:", challenge.code);
        }
      }
      return res.status(200).json({ data: { resetToken }, message: Success.m009 });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("JWTAuth-Controller [forgot-password]:", error.message);
      logging.log("----------------------------------------");
      return res.status(503).json({ data: false, message: Error.m039 });
    }
  }

  // Step 2: code + new password. The token stops working once the password changes.
  @Route("post", "/reset-password", authLimiter)
  @Validate(resetPasswordValidator)
  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const { resetToken, Code, Password } = req.body;
      const challenge = readResetToken(resetToken);
      if (!challenge) return res.status(400).json({ data: false, message: Error.m040 });
      const [account] = await GetService.byFields(UserQuery.q002, ["Id"], [Number], [challenge.userId]);
      if (!account || !isResetCodeValid(challenge, Code, account.Password))
        return res.status(400).json({ data: false, message: Error.m040 });
      if (Password === GOOGLE_PLACEHOLDER_PASSWORD)
        return res.status(400).json({ data: false, message: Error.m040 });
      const response = await UserModel.update(challenge.userId, { Password } as any);
      if (!response.data) return res.status(500).json({ data: false, message: Error.m003 });
      return res.status(200).json({ data: true, message: Success.m010 });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("JWTAuth-Controller [reset-password]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }
}
