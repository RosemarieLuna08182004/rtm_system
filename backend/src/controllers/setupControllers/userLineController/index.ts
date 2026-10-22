import { NextFunction, Request, Response } from "express";
import { Controller, Route, Validate } from "../../../decorators";
import { Authorize, TokenHandler } from "../../../middleware";
import { API } from "../../../constants";
import {
  userLineValidatorOnCreate,
  userLineValidatorOnUpdate,
} from "../../../validators";
import { UserLineModel } from "../../../models";
import { Success, Error } from "../../../shared";
import { LoginRequest, Roles } from "../../../types";

const { requireRoles, requireSelf, STAFF_ROLES } = Authorize;

@Controller(`${API}/user/line`)
export default class UserLineController {
  @Route("get", "/get/:Id", TokenHandler.verifyToken, requireRoles(Roles.admin))
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10), response = await UserLineModel.get(Id);
      return res.status(200).json({ data: response.data, message: response.message });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("UserLine-Controller [get]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET

  @Route("get", "/get-all/", TokenHandler.verifyToken, requireRoles(Roles.admin))
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await UserLineModel.getAll();
      return res.status(200).json({ data: response.data, message: response.message });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("UserLine-Controller [get-all]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET-ALL

  @Route("delete", "/remove/:Id", TokenHandler.verifyToken, requireRoles(Roles.admin))
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10), response = await UserLineModel.remove(Id);
      if(!response.data) return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: Success.m001 });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("UserLine-Controller [get-all]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // REMOVE

  @Route("post", "/add/", TokenHandler.verifyToken, requireRoles(Roles.admin)) // administrative: coin rows are created by the server
  @Validate(userLineValidatorOnCreate)
  async add(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const Data = req.body, response = await UserLineModel.add(Data);
      if(!response.data) return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: response.message });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("UserLine-Controller [add]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }

  @Route("patch", "/update/:Id", TokenHandler.verifyToken, requireRoles(Roles.admin))
  @Validate(userLineValidatorOnUpdate)
  async update(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10), Data = req.body, response = await UserLineModel.update(Id, Data);
      if(!response.data) return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: response.message });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("TermLine-Controller [update]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // UPDATE

  @Route("patch", "/update-condition/:UserId", TokenHandler.verifyToken, requireRoles(Roles.admin))
  @Validate(userLineValidatorOnUpdate)
  async updateByCondition(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const UserId = parseInt(req.params.UserId, 10), Data = req.body, response = await UserLineModel.updateByCondition(UserId, Data);
      if(!response.data) return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: response.message });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("TermLine-Controller [updateByCondition]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // UPDATE
}
