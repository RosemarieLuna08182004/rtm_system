import { NextFunction, Request, Response } from "express";
import { Controller, Route, Validate } from "../../../decorators";
import { TokenHandler } from "../../../middleware";
import { API } from "../../../constants";
import { userTermsOnCreate, userTermsOnUpdate } from "../../../validators";
import { UserTermsModel } from "../../../models";
import {
  Success,
  Error,
  UserTermsQuery,
  DBTable,
} from "../../../shared";
import { LoginRequest, UserTermsTable } from "../../../types";
import { GetService } from "../../../services";

@Controller(`${API}/user/term`)
export default class UserTermController {
  @Route("get", "/get/:Id", TokenHandler.verifyToken, TokenHandler.verifyAdmin)
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10),
        response = await UserTermsModel.get(Id);
      return res
        .status(200)
        .json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("UserTerm-Controller [get]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET

  @Route("get", "/get-all-chapters/:UserId", TokenHandler.verifyToken, TokenHandler.verifySelfOrAdmin("UserId"))
  async getAllChapters(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const UserId: number = parseInt(`${req?.params.UserId}`, 10);
      logging.info("UserId:",UserId)
      logging.info("JWTUser:",req?.User)
      logging.info("GUser:",req.user)
      const response = await UserTermsModel.getAllChapters(UserId);
      return res
        .status(200)
        .json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("UserTerms-Controller [get-all-chapters]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET-ALL

  @Route("get", "/get-chapter/:Id/:UserId", TokenHandler.verifyToken, TokenHandler.verifySelfOrAdmin("UserId"))
  async getChapter(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const UserId: number = parseInt(`${req?.params.UserId}`, 10);
      const ChapterId: number = parseInt(`${req.params.Id}`, 10);
      const response = await UserTermsModel.getChapter(UserId, ChapterId);
      return res
        .status(200)
        .json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("UserTerms-Controller [get-chapter]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET-CHAPTER

  @Route("get", "/get-term/:Id/:UserId", TokenHandler.verifyToken, TokenHandler.verifySelfOrAdmin("UserId"))
  async getTerm(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const UserId: number = parseInt(`${req?.params.UserId}`, 10);
      const TermId: number = parseInt(`${req.params.Id}`, 10);
      const response = await UserTermsModel.getTerm(UserId, TermId);
      return res
        .status(200)
        .json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("UserTerms-Controller [get-term]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET-CHAPTER

  @Route("get", "/get-all/", TokenHandler.verifyToken, TokenHandler.verifyAdmin)
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await UserTermsModel.getAll();
      return res
        .status(200)
        .json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("UserTerms-Controller [get-all]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET-ALL

  @Route("get", "/get-all-bookmark/:UserId/:ChapterId", TokenHandler.verifyToken, TokenHandler.verifySelfOrAdmin("UserId"))
  async getAllBookmark(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const UserId: number = parseInt(`${req?.params.UserId}`, 10);
      const ChapterId: number = parseInt(`${req?.params.ChapterId}`, 10);
      const response = await UserTermsModel.getAllBookmark(UserId,ChapterId);
      return res
        .status(200)
        .json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("UserTerms-Controller [get-all-bookmark]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET-ALL-BOOKMARKS
  @Route("get", "/get-all-bookmark-chapter/:UserId", TokenHandler.verifyToken, TokenHandler.verifySelfOrAdmin("UserId"))
  async getAllBookmarkChapter(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const UserId: number = parseInt(`${req?.params.UserId}`, 10);
      const response = await UserTermsModel.getAllChapterByBookmark(UserId);
      return res
        .status(200)
        .json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("UserTerms-Controller [get-all-bookmark-chapter]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET-ALL-CHAPTER-BY-BOOKMARKS

  @Route("get", "/get-all-terms-by-chapter/:Id/:UserId", TokenHandler.verifyToken, TokenHandler.verifySelfOrAdmin("UserId"))
  async getAllTermsByChapter(
    req: LoginRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const UserId: number = parseInt(`${req?.params.UserId}`, 10);
      const ChapterId: number = parseInt(`${req.params.Id}`, 10);
      const response = await UserTermsModel.getAllTermsByChapter(
        UserId,
        ChapterId,
      );
      return res
        .status(200)
        .json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("UserTerms-Controller [get-all]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET-ALL

  @Route("get", "/get-by-chapter/:userId/:chapterId", TokenHandler.verifyToken, TokenHandler.verifySelfOrAdmin("userId"))
  async getByChapter(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.userId, 10),
        chapterId = parseInt(req.params.chapterId, 10);
      const response = await UserTermsModel.getByChapter(userId, chapterId);
      return res
        .status(200)
        .json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("UserTerms-Controller [get-by-chapter]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET-ALL

  @Route("delete", "/remove/:Id", TokenHandler.verifyToken, TokenHandler.verifyBookmarkOwner("Id"))
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10),
        response = await UserTermsModel.remove(Id);
      if (!response.data)
        return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: Success.m001 });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("UserTerms-Controller [remove]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // REMOVE

  @Route("post", "/add/", TokenHandler.verifyToken, TokenHandler.verifyAdmin)
  @Validate(userTermsOnCreate)
  async add(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const Data = req.body,
        response = await UserTermsModel.add(Data);
      if (!response.data)
        return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("UserTerms-Controller [add]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // ADD

  @Route("post", "/bookmark/:TermId/:UserId", TokenHandler.verifyToken, TokenHandler.verifySelfOrAdmin("UserId"))
  async bookmark(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const TermId: number = parseInt(`${req.params.TermId}`, 10);
      const UserId: number = parseInt(`${req?.params.UserId ?? 0}`, 10);
      const ChapterId = (await GetService.byId(TermId, DBTable.t005))[0]
        .ChapterId;
      const ChapterStatus = String(
        (await UserTermsModel.getChapter(UserId, ChapterId)).data[0].Status ??
          "NA",
      );
      if (ChapterStatus !== "Unlock")
        return res.status(401).json({ data: false, message: Error.m028 });
      const Data: UserTermsTable = {
        UserId: UserId,
        ChapterId: null,
        TermId: TermId,
        Status: 1,
      };
      const response = await UserTermsModel.add(Data);
      if (!response.data)
        return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("UserTerms-Controller [add]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // BOOKMARK

  @Route("patch", "/update/:Id", TokenHandler.verifyToken, TokenHandler.verifyAdmin)
  @Validate(userTermsOnUpdate)
  async update(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10),
        Data = req.body,
        response = await UserTermsModel.update(Id, Data);
      if (!response.data)
        return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("UserTerms-Controller [update]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // UPDATE

  @Route("patch", "/unbookmark/:Id", TokenHandler.verifyToken, TokenHandler.verifyBookmarkOwner("Id"))
  async unbookmark(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const UserTermId = parseInt(req.params.Id, 10);
      // Only the bookmark flag can change here (0 = removed, 1 = bookmarked)
      const Status = Number(req.body?.Status);
      if (Status !== 0 && Status !== 1)
        return res.status(400).json({ data: false, message: "Status must be 0 or 1." });
      const Data = { Status };
      const response = await UserTermsModel.update(UserTermId, Data);
      if (!response.data)
        return res.status(401).json({ data: false, message: response.message });
      return res.status(200).json({ data: true, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("UserTerms-Controller [update]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // unbookmark
}
