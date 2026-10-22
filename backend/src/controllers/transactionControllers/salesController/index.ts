import { NextFunction, Request, Response } from "express";
import { Controller, Route, Validate } from "../../../decorators";
import { Authorize, TokenHandler } from "../../../middleware";
import { API } from "../../../constants";
import { salesValidatorOnCreate } from "../../../validators";
import { SalesModel } from "../../../models";
import { Success, Error } from "../../../shared";
import { LoginRequest, Roles } from "../../../types";

const { requireRoles, requireSelf, STAFF_ROLES } = Authorize;

@Controller(`${API}/sales`)
export default class SalesController {
  @Route("get", "/get/:Id", TokenHandler.verifyToken, requireRoles(Roles.admin))
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10),
        response = await SalesModel.get(Id);
      return res
        .status(200)
        .json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("Sales-Controller [get]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET
  @Route("get", "/get-all-count/", TokenHandler.verifyToken, requireRoles(Roles.admin))
  async getAllCount(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await SalesModel.getAllCount();
      return res
        .status(200)
        .json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("Sales-Controller [get-all]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET-ALL

  @Route("get", "/get-all/", TokenHandler.verifyToken, requireRoles(Roles.admin))
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await SalesModel.getAll();
      return res
        .status(200)
        .json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("Sales-Controller [get-all]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET-ALL

  @Route("delete", "/remove/:Id", TokenHandler.verifyToken, requireRoles(Roles.admin))
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10),
        response = await SalesModel.remove(Id);
      if (!response.data)
        return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: Success.m001 });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("Sales-Controller [get-all]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // REMOVE

  @Route("post", "/add/", TokenHandler.verifyToken, requireRoles(Roles.admin))
  @Validate(salesValidatorOnCreate)
  async add(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const Data = req.body,
        response = await SalesModel.add(Data);
      if (!response.data)
        return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("UserLine-Controller [add]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // ADD
}
