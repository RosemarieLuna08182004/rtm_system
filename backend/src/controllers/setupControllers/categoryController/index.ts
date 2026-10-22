
import { NextFunction, Request, Response } from "express";
import { Controller, Route, Validate } from "../../../decorators";
import { Authorize, TokenHandler } from "../../../middleware";
import { CategoryModel } from "../../../models";
import { API } from "../../../constants";
import { Error } from "../../../shared";
import {
  categoryValidateorOnCreate,
  categoryValidateorOnUpdate,
} from "../../../validators";
import { LoginRequest, Roles } from "../../../types";

const { requireRoles, requireSelf, STAFF_ROLES } = Authorize;

@Controller(`${API}/category`)
export default class CategoryController {
  @Route("get", "/get/:Id", TokenHandler.verifyToken)
  async get(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const Id = parseInt(req.params.Id, 10), response = await CategoryModel.get(Id)
      return res.status(200).json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("CategoryTable-Controller [get]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: [], message: Error.m001 });
    }
  } // END GET

  @Route("get", "/get-all/", TokenHandler.verifyToken)
  async getAll(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const response = await CategoryModel.getAll()
      return res.status(200).json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("CategoryTable-Controller [getAll]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: [], message: Error.m001 });
    }
  } // END GET-ALL

  @Route("delete", "/remove/:Id", TokenHandler.verifyToken, requireRoles(...STAFF_ROLES))
  async remove(req: Request, res: Response, next: NextFunction) : Promise<Response>{
    try {
      const Id = parseInt(req.params.Id, 10), response = await CategoryModel.remove(Id)
      if(!response.data) return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("CategoryTable-Controller [remove]:", error.message); 
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // END REMOVE

  @Route("post", "/add/", TokenHandler.verifyToken, requireRoles(...STAFF_ROLES))
  @Validate(categoryValidateorOnCreate)
  async add(req: LoginRequest, res: Response, next: NextFunction): Promise<Response> {
    try {
      const Data = req.body, CurrentId = parseInt(`${req.User?.Id}`, 10), response = await CategoryModel.add(Data, CurrentId)
      if(!response.data) return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("CategoryTable-Controller [add]:", error.message); 
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // END ADD

  @Route("patch", "/update/:Id", TokenHandler.verifyToken, requireRoles(...STAFF_ROLES))
  @Validate(categoryValidateorOnUpdate)
  async update(req: LoginRequest, res: Response, next: NextFunction) : Promise<Response> {
    try {
      const Id = parseInt(req.params.Id, 10), Data = req.body, CurrentId = parseInt(`${req.User?.Id}`, 10), response = await CategoryModel.update(Id, Data, CurrentId)
      if(!response.data) return res.status(401).json({ data: response.data, message: response.message });
      return res.status(200).json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("CategoryTable-Controller [update]:", error.message); 
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // END UPDATE
}// END CLASS
