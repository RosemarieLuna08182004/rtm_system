import { NextFunction, Request, Response } from "express";
import { Controller, Route, Validate } from "../../../decorators";
import { Authorize, TokenHandler } from "../../../middleware";
import { API } from "../../../constants";
import {
  termLineValidatorOnCreate,
  termLineValidatorOnUpdate,
} from "../../../validators";
import { TermLineModel } from "../../../models";
import { Success, Error } from "../../../shared";
import { LoginRequest, Roles } from "../../../types";

const { requireRoles, requireSelf, STAFF_ROLES } = Authorize;

@Controller(`${API}/term/line`)
export default class TermLineController {
  @Route("get", "/get/:Id", TokenHandler.verifyToken)
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10), response = await TermLineModel.get(Id);
      return res.status(200).json({ data: response.data, message: response.message });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("TermLine-Controller [get]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET

  @Route("get", "/get-all/", TokenHandler.verifyToken)
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await TermLineModel.getAll();
      return res.status(200).json({ data: response.data, message: response.message });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("TermLine-Controller [get-all]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET-ALL

  @Route("get", "/get-all/:Id", TokenHandler.verifyToken)
  async getAllByTerm(req: Request, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10), response = await TermLineModel.getAllByTerm(Id);
      return res.status(200).json({ data: response.data, message: response.message });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("TermLine-Controller [get-all-by-term]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET-ALL-BY-TERM

  @Route("delete", "/remove/:Id", TokenHandler.verifyToken, requireRoles(...STAFF_ROLES))
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10), response = await TermLineModel.remove(Id);
      if(!response.data) return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: Success.m001 });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("TermLine-Controller [get-all]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // REMOVE

  @Route("post", "/add/", TokenHandler.verifyToken, requireRoles(...STAFF_ROLES))
  @Validate(termLineValidatorOnCreate)
  async add(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const Data = req.body, CurrentId = parseInt(`${req.User?.Id}`, 10), response = await TermLineModel.add(Data, CurrentId);
      if(!response.data) return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: response.message });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("TermLine-Controller [add]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }

  @Route("patch", "/update/:Id", TokenHandler.verifyToken, requireRoles(...STAFF_ROLES))
  @Validate(termLineValidatorOnUpdate)
  async update(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10), Data = req.body, CurrentId = parseInt(`${req.User?.Id}`, 10), response = await TermLineModel.update(Id, Data, CurrentId);
      if(!response.data) return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: response.message });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("TermLine-Controller [update]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // UPDATE
}
