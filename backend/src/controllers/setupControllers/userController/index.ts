import { NextFunction, Response } from "express";
import { compare } from "bcrypt";
import { Controller, Route, Validate } from "../../../decorators";
import { Authorize, TokenHandler, registerLimiter } from "../../../middleware";
import { API } from "../../../constants";
import { userValidatorOnCreate, userValidatorOnUpdate } from "../../../validators";
import { UserModel } from "../../../models";
import { Success, Error, UserQuery } from "../../../shared";
import { LoginRequest, Roles } from "../../../types";
import { GOOGLE_PLACEHOLDER_PASSWORD, toSafeUser, toSafeUsers } from "../../../functions";
import { GetService } from "../../../services";

const { requireRoles, canAccessUser, isAdmin, getOptionalRole } = Authorize;

@Controller(`${API}/user`)
export default class UserController {
  @Route("get", "/get/:Id", TokenHandler.verifyToken)
  async get(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10);
      if (!(await canAccessUser(req, Id))) return res.status(403).json({ data: false, message: Error.m034 });
      const response = await UserModel.get(Id);
      return res.status(200).json({ data: toSafeUser(response.data), message: response.message });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("User-Controller [get]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET

  @Route("get", "/get-all/", TokenHandler.verifyToken, requireRoles(Roles.admin))
  async getAll(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const response = await UserModel.getAll();
      return res.status(200).json({ data: toSafeUsers(response.data), message: response.message });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("User-Controller [get-all]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET-ALL

  @Route("delete", "/remove/:Id", TokenHandler.verifyToken, requireRoles(Roles.admin))
  async remove(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10), response = await UserModel.remove(Id);
      if(!response.data) return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: Success.m001 });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("User-Controller [remove]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // REMOVE

  @Route("post", "/add/", registerLimiter) // no token needed on register
  @Validate(userValidatorOnCreate)
  async add(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const Data = req.body;
      // Only an administrator (web admin) may create staff accounts or set provider fields.
      if ((await getOptionalRole(req)) !== Roles.admin) {
        Data.AccountType = Roles.user;
        delete Data.GoogleId;
        delete Data.AccessToken;
      }
      if (Data.Email) Data.Email = String(Data.Email).trim().toLowerCase();
      const response = await UserModel.add(Data);
      if(!response.data) return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: response.message });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("User-Controller [add]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }

  @Route("patch", "/update/:Id", TokenHandler.verifyToken)
  @Validate(userValidatorOnUpdate)
  async update(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10), Data = req.body;
      if (!(await canAccessUser(req, Id))) return res.status(403).json({ data: false, message: Error.m034 });
      const admin = await isAdmin(req);
      const { CurrentPassword } = Data;
      delete Data.CurrentPassword;

      if (!admin) {
        // Provider fields are managed by the server, not by the user.
        delete Data.GoogleId;
        delete Data.AccessToken;
        // A new password needs proof of the current one.
        if (Data.Password) {
          if (!CurrentPassword) return res.status(400).json({ data: false, message: Error.m036 });
          const [stored] = await GetService.byFields(UserQuery.q002, ["Id"], [Number], [Id]);
          const valid =
            !!stored &&
            CurrentPassword !== GOOGLE_PLACEHOLDER_PASSWORD &&
            (await compare(String(CurrentPassword), stored.Password));
          if (!valid) return res.status(401).json({ data: false, message: Error.m024 });
        }
      }

      if (Data.Email) {
        Data.Email = String(Data.Email).trim().toLowerCase();
        const [taken] = await GetService.byFields(UserQuery.q003, ["Email"], [String], [Data.Email]);
        if (taken && Number(taken.Id) !== Id) return res.status(409).json({ data: false, message: Error.m016 });
      }

      const response = await UserModel.update(Id, Data);
      if(!response.data) return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: response.message });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("User-Controller [update]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // UPDATE
}
