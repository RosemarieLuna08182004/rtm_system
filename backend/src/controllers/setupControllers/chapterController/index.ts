import { NextFunction, Request, Response } from "express";
import { Controller, Route, Validate } from "../../../decorators";
import { Authorize, TokenHandler } from "../../../middleware";
import { API } from "../../../constants";
import {
  chapterValidatorOnCreate,
  chapterValidatorOnUpdate,
} from "../../../validators";
import { ChapterModel } from "../../../models";
import { Error, Success } from "../../../shared";
import { LoginRequest, Roles } from "../../../types";

const { requireRoles, requireSelf, STAFF_ROLES } = Authorize;

@Controller(`${API}/chapter`)
export default class ChapterController {
  @Route("get", "/get/:Id", TokenHandler.verifyToken)
  async get(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const Id = parseInt(req.params.Id, 10),
        response = await ChapterModel.get(Id);
      return res
        .status(200)
        .json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("Chapter-Controller [get]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }

  @Route("get", "/get-all/", TokenHandler.verifyToken)
  async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const response = await ChapterModel.getAll();
      return res
        .status(200)
        .json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("Chapter-Controller [get-all]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }

  @Route("get", "/get-all/:Id", TokenHandler.verifyToken)
  async getAllWithStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const Id = parseInt(req.params.Id, 10),
        response = await ChapterModel.getAllWithStatus(Id);
      return res
        .status(200)
        .json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("Chapter-Controller [get-all-with-status]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }

  @Route("delete", "/remove/:Id", TokenHandler.verifyToken, requireRoles(...STAFF_ROLES))
  async remove(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const Id = parseInt(req.params.Id, 10),
        response = await ChapterModel.remove(Id);
      if (!response.data)
        return res
          .status(401)
          .json({ data: response.data, message: response.message });
      return res.status(200).json({ data: true, message: Success.m001 });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("Chapter-Controller [remove]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }

  @Route("post", "/add/", TokenHandler.verifyToken, requireRoles(...STAFF_ROLES))
  @Validate(chapterValidatorOnCreate)
  async add(
    req: LoginRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const Data = req.body,
        CurrentId = parseInt(`${req.User?.Id}`, 10),
        response = await ChapterModel.add(Data, CurrentId);
      if (!response.data)
        return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("Chapter-Controller [add]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }

  @Route("patch", "/update/:Id", TokenHandler.verifyToken, requireRoles(...STAFF_ROLES))
  @Validate(chapterValidatorOnUpdate)
  async update(
    req: LoginRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const Id = parseInt(req.params.Id, 10),
        Data = req.body,
        CurrentId = parseInt(`${req.User?.Id}`, 10),
        response = await ChapterModel.update(Id, Data, CurrentId);
      if (!response.data)
        return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("Chapter-Controller [update]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }
}
