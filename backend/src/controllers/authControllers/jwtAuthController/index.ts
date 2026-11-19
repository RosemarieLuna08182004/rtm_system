import { NextFunction, Request, Response } from "express";
import { Controller, Route, Validate } from "../../../decorators";
import { changePasswordValidator, loginValidator } from "../../../validators";
import { API } from "../../../constants";
import { TokenHandler, loginLimiter } from "../../../middleware";
import { LoginRequest, ModelResponse } from "../../../types";
import { Success, Error, UserQuery, DBTable } from "../../../shared";
import { GenerateFn, getByEmail, readSession, withoutSecrets } from "../../../functions";
import { GetService, UpdateService } from "../../../services";
import { compare, hash } from "bcrypt";

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

  // No verifyToken here: the access token is usually expired by the time the app refreshes.
  // readSession checks the refresh token (web) or the expired access token (mobile app)
  // and stops refreshes SESSION_MAX_DAYS after the original login.
  @Route("get", "/refresh")
  async refresh(
    req: LoginRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const authorization = req.headers["authorization"];
      const bearer = authorization?.startsWith("Bearer ") ? authorization.slice(7) : undefined;
      const session = readSession(req.headers["refresh-token"] as string | undefined, bearer);
      if (!session.claims)
        return res.status(401).json({ data: false, message: session.reason === "expired" ? Error.m038 : Error.m004 });
      const [account] = await GetService.byFields(UserQuery.q0014, ["Id"], [Number], [session.claims.UserId]);
      if (!account) return res.status(401).json({ data: false, message: Error.m018 });
      const user: number = Number(account.Id);
      const accessToken: ModelResponse = await GenerateFn.accessToken(user, session.claims.LoginAt);
      const refreshToken: ModelResponse = await GenerateFn.refreshToken(user, session.claims.LoginAt);
      if (!accessToken.data || !refreshToken.data)
        return res.status(404).json({ data: false, message: Error.m004 });
      res.setHeader("Authorization", `Bearer ${accessToken.data}`);
      res.setHeader("Refresh-Token", refreshToken.data);
      return res.status(200).json({
        data: {
          user: user,
          roles: account.AccountType, // the web admin keeps its role check after a refresh
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
  }

  @Route("post", "/login", loginLimiter)
  @Validate(loginValidator)
  async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const data = req.body;
      const user = await getByEmail(data?.Email ?? "");
      if (!user.data)
        return res.status(401).json({ data: false, message: Error.m011 });
      if (!(await compare(data.Password, user.data.Password)))
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
          user: withoutSecrets(user.data),
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

  @Route("post", "/verify-password", TokenHandler.verifyToken, loginLimiter)
  async verifyPassword(
    req: LoginRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      // Checks the signed-in account's own password. Any Email in the body is ignored,
      // so this can't be used to test passwords against other people's accounts.
      const Password = typeof req.body?.Password === "string" ? req.body.Password : "";
      const caller = req.User as { Id?: number | string; email?: string } | undefined;
      const [found] = caller?.Id
        ? await GetService.byFields(UserQuery.q0014, ["Id"], [Number], [caller.Id])
        : await GetService.byFields(UserQuery.q0015, ["Email"], [String], [caller?.email ?? ""]);
      if (!found) return res.status(401).json({ data: false, message: Error.m018 });
      const [account] = await GetService.byFields(UserQuery.q002, ["Id"], [Number], [found.Id]);
      if (!Password || !account?.Password || !(await compare(Password, account.Password)))
        return res.status(401).json({ data: false, message: Error.m024 });
      return res.status(200).json({ data: true, message: Success.m001 });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("JWTAuth-Controller [verify-password]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }

  // Change your own password. The account comes from the login, never the request body,
  // and the current password must be right, so a stolen login alone can't change it.
  @Route("post", "/change-password", TokenHandler.verifyToken, loginLimiter)
  @Validate(changePasswordValidator)
  async changePassword(
    req: LoginRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const { CurrentPassword, NewPassword } = req.body;
      const caller = req.User as { Id?: number | string; email?: string } | undefined;
      const [found] = caller?.Id
        ? await GetService.byFields(UserQuery.q0014, ["Id"], [Number], [caller.Id])
        : await GetService.byFields(UserQuery.q0015, ["Email"], [String], [caller?.email ?? ""]);
      if (!found) return res.status(401).json({ data: false, message: Error.m018 });
      const [account] = await GetService.byFields(UserQuery.q002, ["Id"], [Number], [found.Id]);
      if (!account?.Password || !(await compare(CurrentPassword, account.Password)))
        return res.status(401).json({ data: false, message: Error.m024 });
      await UpdateService.record(Number(found.Id), DBTable.t007, ["Password", "DateUpdated"], [String, Date], [await hash(NewPassword, 10), new Date()]);
      return res.status(200).json({ data: true, message: Success.m004 });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("JWTAuth-Controller [change-password]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }
}
