import { NextFunction, Request, Response } from "express";
import { Controller, Route, Validate } from "../../../decorators";
import { Authorize, TokenHandler } from "../../../middleware";
import { API } from "../../../constants";
import {
  termValidatorOnCreate,
  termValidatorOnUpdate,
} from "../../../validators";
import { Success, Error } from "../../../shared";
import { TermModel } from "../../../models";
import { LoginRequest, Roles } from "../../../types";

const { requireRoles, requireSelf, STAFF_ROLES } = Authorize;

@Controller(`${API}/term`)
export default class TermController {
  @Route("get", "/get/:Id", TokenHandler.verifyToken)
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10),
        response = await TermModel.get(Id);
      return res
        .status(200)
        .json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("Term-Controller [get]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET

  @Route("get", "/get-all/", TokenHandler.verifyToken)
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await TermModel.getAll();
      return res
        .status(200)
        .json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("Term-Controller [get-all]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET-ALL

  @Route("get", "/get-all/:Id", TokenHandler.verifyToken)
  async getAllByChapter(req: Request, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10),
        response = await TermModel.getAllByChapter(Id);
      return res
        .status(200)
        .json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("Term-Controller [get-all-by-chapter] web:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET-ALL-BY-CHAPTER

  @Route("get", "/get-all/:Id/:UserId", TokenHandler.verifyToken, requireSelf("UserId"))
  async getAllByChapterUser(req: Request, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10),
        UserId = parseInt(req.params.UserId),
        response = await TermModel.getAllByChapterUser(Id, UserId);
      return res
        .status(200)
        .json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error(
        "Term-Controller [get-all-by-chapter] mobile:",
        error.message,
      );
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET-ALL-BY-CHAPTER

  @Route("delete", "/remove/:Id", TokenHandler.verifyToken, requireRoles(...STAFF_ROLES))
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10),
        response = await TermModel.remove(Id);
      if (!response.data)
        return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: Success.m001 });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("Term-Controller [get-all]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // REMOVE

  @Route("post", "/add/", TokenHandler.verifyToken, requireRoles(...STAFF_ROLES))
  // model here
  @Validate(termValidatorOnCreate)
  async add(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const Data = req.body,
        CurrentId = parseInt(`${req.User?.Id}`, 10),
        response = await TermModel.add(Data, CurrentId);
      if (!response.data)
        return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("Term-Controller [add]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }

  @Route("post", "/import-data/", TokenHandler.verifyToken, requireRoles(...STAFF_ROLES))
  async importData(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const Data = req.body,
        CurrentId = parseInt(`${req.User?.Id}`, 10);
      const Query: string = String(Data.Query).toLowerCase();
      if (Query.includes("delete from") || Query.includes("delete"))
        return res.status(401).json({ data: false, message: Error.m032 });
      const response = await TermModel.imports(Data.Query, CurrentId);
      if (!response.data)
        return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("Term-Controller [import-data]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }

  @Route("patch", "/update/:Id", TokenHandler.verifyToken, requireRoles(...STAFF_ROLES))
  // model here
  @Validate(termValidatorOnUpdate)
  async update(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10),
        Data = req.body,
        CurrentId = parseInt(`${req.User?.Id}`, 10),
        response = await TermModel.update(Id, Data, CurrentId);
      if (!response.data)
        return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("Term-Controller [update]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }
}
