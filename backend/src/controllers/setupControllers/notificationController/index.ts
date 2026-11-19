import { NextFunction, Request, Response } from "express";
import { Controller, Route } from "../../../decorators";
import { TokenHandler } from "../../../middleware";
import { NotificationModel } from "../../../models";
import { API } from "../../../constants";
import { Error } from "../../../shared";
import { LoginRequest } from "../../../types";

@Controller(`${API}/notification`)
export default class NotificationController {
  @Route("get", "/get/:Id", TokenHandler.verifyToken, TokenHandler.verifyAdmin)
  async get(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const Id = parseInt(req.params.Id, 10);
      const response = await NotificationModel.get(Id);
      return res.status(200).json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("NotificationController [get]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: null, message: Error.m001 });
    }
  }

  @Route("get", "/get-all/", TokenHandler.verifyToken, TokenHandler.verifyAdmin)
  async getAll(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const response = await NotificationModel.getAll();
      return res.status(200).json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("NotificationController [getAll]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: [], message: Error.m001 });
    }
  }

  @Route("get", "/get-all-by-user/", TokenHandler.verifyToken, TokenHandler.verifyAdmin)
  async getAllByUser(req: LoginRequest, res: Response, next: NextFunction): Promise<Response> {
    try {
      const UserId = parseInt(`${req.User?.Id}`, 10);
      const response = await NotificationModel.getAllByUser(UserId);
      return res.status(200).json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("NotificationController [getAllByUser]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: [], message: Error.m001 });
    }
  }

  @Route("patch", "/read/:Id", TokenHandler.verifyToken, TokenHandler.verifyAdmin)
  async markRead(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const response = await NotificationModel.markRead(parseInt(req.params.Id, 10));
      return res.status(response.data ? 200 : 404).json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("NotificationController [markRead]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }

  @Route("patch", "/read-all/", TokenHandler.verifyToken, TokenHandler.verifyAdmin)
  async markAllRead(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const response = await NotificationModel.markAllRead();
      return res.status(response.data ? 200 : 500).json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("NotificationController [markAllRead]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }

  @Route("delete", "/remove/:Id", TokenHandler.verifyToken, TokenHandler.verifyAdmin)
  async remove(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const response = await NotificationModel.remove(parseInt(req.params.Id, 10));
      return res.status(response.data ? 200 : 404).json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("NotificationController [remove]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }
}