import { NextFunction, Request, Response } from "express";
import { Controller, Route, Validate } from "../../../decorators";
import { Authorize, TokenHandler } from "../../../middleware";
import { API } from "../../../constants";
import {
  productValidatorOnCreate,
  productValidatorOnUpdate,
} from "../../../validators";
import { ProductModel } from "../../../models";
import { Success, Error } from "../../../shared";
import { LoginRequest, Roles } from "../../../types";

const { requireRoles, requireSelf, STAFF_ROLES } = Authorize;

@Controller(`${API}/product`)
export default class ProductController {
  @Route("get", "/get/:Id", TokenHandler.verifyToken)
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10), response = await ProductModel.get(Id);
      return res.status(200).json({ data: response.data, message: response.message });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("Product-Controller [get]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }

  @Route("get", "/get-all/", TokenHandler.verifyToken)
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await ProductModel.getAll();
      return res.status(200).json({ data: response.data, message: response.message });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("Product-Controller [get-all]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }

  @Route("delete", "/remove/:Id", TokenHandler.verifyToken, requireRoles(Roles.admin))
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10), response = await ProductModel.remove(Id);
      if(!response.data) return res.status(401).json({ data: response.data, message: response.message });
      return res.status(200).json({ data: true, message: Success.m001 });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("Product-Controller [remove]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }

  @Route("post", "/add/", TokenHandler.verifyToken, requireRoles(Roles.admin))
  @Validate(productValidatorOnCreate)
  async add(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const Data = req.body, CurrentId = parseInt(`${req.User?.Id}`, 10), response = await ProductModel.add(Data, CurrentId);
      if(!response.data) return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: response.message });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("Product-Controller [add]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }

  @Route("patch", "/update/:Id", TokenHandler.verifyToken, requireRoles(Roles.admin))
  @Validate(productValidatorOnUpdate)
  async update(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10), Data = req.body, CurrentId = parseInt(`${req.User?.Id}`, 10), response = await ProductModel.update(Id, Data, CurrentId);
      if(!response.data) return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: response.message });
    } catch(error:any){
      logging.log("----------------------------------------");
      logging.error("Product-Controller [update]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }
}
