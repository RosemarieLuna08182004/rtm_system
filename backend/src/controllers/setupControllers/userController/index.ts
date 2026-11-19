import { NextFunction, Request, Response } from "express";
import { Controller, Route, Validate } from "../../../decorators";
import { TokenHandler } from "../../../middleware";
import { API } from "../../../constants";
import { userValidatorOnCreate, userValidatorOnUpdate } from "../../../validators";
import { NotificationModel, UserModel } from "../../../models";
import { Success, Error } from "../../../shared";
import { LoginRequest, Roles } from "../../../types";

@Controller(`${API}/user`)
export default class UserController {
  @Route("get", "/get/:Id", TokenHandler.verifyToken, TokenHandler.verifySelfOrAdmin("Id"))
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10), response = await UserModel.get(Id);
      return res.status(200).json({ data: response.data, message: response.message });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("User-Controller [get]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET

  @Route("get", "/get-all/", TokenHandler.verifyToken, TokenHandler.verifyAdmin)
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await UserModel.getAll();
      return res.status(200).json({ data: response.data, message: response.message });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("User-Controller [get-all]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET-ALL

  @Route("delete", "/remove/:Id", TokenHandler.verifyToken, TokenHandler.verifyAdmin)
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10), response = await UserModel.remove(Id);
      if(!response.data) return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: Success.m001 });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("User-Controller [get-all]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // REMOVE

  @Route("post", "/add/") // no token needed on register
  @Validate(userValidatorOnCreate)
  async add(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      // Public sign-up: always a normal user, whatever the request asks for.
      // Administrator accounts can't be created through the API.
      const Data = { ...req.body, AccountType: Roles.user }, response = await UserModel.add(Data);
      if(!response.data) return res.status(401).json({ data: false, message: response.message });
      await NotificationModel.addNewUser(Data.Email, Data.Name, "email"); // never throws
      return res.status(200).json({ data: true, message: response.message });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("User-Controller [add]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }

  @Route("patch", "/update/:Id", TokenHandler.verifyToken, TokenHandler.verifySelfOrAdmin("Id"))
  @Validate(userValidatorOnUpdate)
  async update(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10), Data = req.body, response = await UserModel.update(Id, Data);
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
