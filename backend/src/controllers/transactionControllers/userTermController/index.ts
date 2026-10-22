import { NextFunction, Response } from "express";
import { Controller, Route, Validate } from "../../../decorators";
import { Authorize, TokenHandler } from "../../../middleware";
import { API } from "../../../constants";
import { userTermsOnCreate, userTermsOnUpdate } from "../../../validators";
import { UserTermsModel } from "../../../models";
import {
  Success,
  Error,
  UserTermsQuery,
  DBTable,
  UserLineQuery,
} from "../../../shared";
import { LoginRequest, Roles, UserTermsTable } from "../../../types";
import { GetService } from "../../../services";
import { pool } from "../../../config";

const { requireRoles, requireSelf, canAccessUser, getAuthUserId, isAdmin } = Authorize;

// Loads a userterms row and checks the caller owns it (or is an administrator).
// Returns null (and sends the response) when access is not allowed.
const getOwnedUserTerm = async (req: LoginRequest, res: Response, Id: number) => {
  const [row] = await GetService.byFields(UserTermsQuery.q002, ["Id"], [Number], [Id]);
  if (!row) {
    res.status(404).json({ data: false, message: Error.m011 });
    return null;
  }
  if (!(await canAccessUser(req, Number(row.UserId)))) {
    res.status(403).json({ data: false, message: Error.m034 });
    return null;
  }
  return row;
};

@Controller(`${API}/user/term`)
export default class UserTermController {
  @Route("get", "/get/:Id", TokenHandler.verifyToken)
  async get(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10);
      if (!(await getOwnedUserTerm(req, res, Id))) return;
      const response = await UserTermsModel.get(Id);
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

  @Route("get", "/get-all-chapters/:UserId", TokenHandler.verifyToken, requireSelf("UserId"))
  async getAllChapters(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const UserId: number = parseInt(`${req?.params.UserId}`, 10);
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

  @Route("get", "/get-chapter/:Id/:UserId", TokenHandler.verifyToken, requireSelf("UserId"))
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

  @Route("get", "/get-term/:Id/:UserId", TokenHandler.verifyToken, requireSelf("UserId"))
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

  @Route("get", "/get-all/", TokenHandler.verifyToken, requireRoles(Roles.admin))
  async getAll(req: LoginRequest, res: Response, next: NextFunction) {
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

  @Route("get", "/get-all-bookmark/:UserId/:ChapterId", TokenHandler.verifyToken, requireSelf("UserId"))
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
  @Route("get", "/get-all-bookmark-chapter/:UserId", TokenHandler.verifyToken, requireSelf("UserId"))
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

  // The caller's bookmarks grouped by chapter, in one request (replaces one call per chapter).
  @Route("get", "/me/bookmarks", TokenHandler.verifyToken)
  async getMyBookmarks(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const UserId = getAuthUserId(req);
      if (!UserId) return res.status(403).json({ data: false, message: Error.m034 });
      const response = await UserTermsModel.getBookmarksGrouped(UserId);
      return res
        .status(200)
        .json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("UserTerms-Controller [me/bookmarks]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET-MY-BOOKMARKS

  // Every term with its chapter and the caller's lock status — for global search, Home and progress.
  @Route("get", "/me/index", TokenHandler.verifyToken)
  async getMyTermIndex(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const UserId = getAuthUserId(req);
      if (!UserId) return res.status(403).json({ data: false, message: Error.m034 });
      const response = await UserTermsModel.getTermIndex(UserId);
      return res.status(200).json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("UserTerms-Controller [me/index]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET-MY-TERM-INDEX

  // The most recently added terms (?limit=1–30, default 8), for Home "Newly added".
  @Route("get", "/me/new-terms", TokenHandler.verifyToken)
  async getNewTerms(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const UserId = getAuthUserId(req);
      if (!UserId) return res.status(403).json({ data: false, message: Error.m034 });
      const requested = parseInt(String(req.query.limit ?? "8"), 10);
      const limit = Number.isInteger(requested) ? Math.min(30, Math.max(1, requested)) : 8;
      const response = await UserTermsModel.getNewTerms(UserId, limit);
      return res.status(200).json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("UserTerms-Controller [me/new-terms]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET-NEW-TERMS

  // Terms that share a root word (e.g. ?root=Ren), for the word-part breakdown.
  @Route("get", "/me/by-root", TokenHandler.verifyToken)
  async getTermsByRoot(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const UserId = getAuthUserId(req);
      if (!UserId) return res.status(403).json({ data: false, message: Error.m034 });
      const root = String(req.query.root ?? "").trim();
      // Root words are short and made of letters (incl. accented), hyphens and spaces.
      if (!root || root.length > 40 || !/^[\p{L}\- ]+$/u.test(root))
        return res.status(400).json({ data: [], message: Error.m014 });
      const response = await UserTermsModel.getTermsByRoot(UserId, root);
      return res.status(200).json({ data: response.data, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("UserTerms-Controller [me/by-root]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // GET-TERMS-BY-ROOT

  @Route("get", "/get-all-terms-by-chapter/:Id/:UserId", TokenHandler.verifyToken, requireSelf("UserId"))
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

  @Route("get", "/get-by-chapter/:userId/:chapterId", TokenHandler.verifyToken, requireSelf("userId"))
  async getByChapter(req: LoginRequest, res: Response, next: NextFunction) {
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

  @Route("delete", "/remove/:Id", TokenHandler.verifyToken)
  async remove(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10);
      const row = await getOwnedUserTerm(req, res, Id);
      if (!row) return;
      // Users may only remove their own bookmarks, never a chapter unlock.
      if (!row.TermId && !(await isAdmin(req)))
        return res.status(403).json({ data: false, message: Error.m034 });
      const response = await UserTermsModel.remove(Id);
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

  // Administrative: creates any user-term row (including chapter unlocks).
  @Route("post", "/add/", TokenHandler.verifyToken, requireRoles(Roles.admin))
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

  @Route("post", "/bookmark/:TermId/:UserId", TokenHandler.verifyToken, requireSelf("UserId"))
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

      // One bookmark row per user and term: re-bookmarking reuses the existing row.
      const findRow = async () =>
        (await GetService.byFields(UserTermsQuery.q014, ["UserId", "TermId"], [Number, Number], [UserId, TermId]))[0];
      const existing = await findRow();
      if (existing) {
        const response = await UserTermsModel.update(Number(existing.Id), { Status: 1 } as UserTermsTable);
        if (!response.data)
          return res.status(401).json({ data: false, message: response.message });
        return res.status(200).json({ data: { UserTermsId: Number(existing.Id) }, message: Success.m004 });
      }
      const Data: UserTermsTable = {
        UserId: UserId,
        ChapterId: null,
        TermId: TermId,
        Status: 1,
      };
      const response = await UserTermsModel.add(Data);
      if (!response.data)
        return res.status(401).json({ data: false, message: response.message });
      // Return the row Id so the app can toggle this bookmark without reloading.
      const created = await findRow();
      return res.status(200).json({ data: { UserTermsId: Number(created?.Id ?? 0) }, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("UserTerms-Controller [add]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // BOOKMARK

  @Route("post", "/purchase-chapter", TokenHandler.verifyToken)
  @Validate(userTermsOnCreate)
  async purchaseChapter(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const Data = req.body;
      const UserId = Number(Data?.UserId ?? 0);
      const ChapterId = Number(Data?.ChapterId ?? 0);
      // Coins may only be spent from the caller's own account.
      if (UserId !== getAuthUserId(req))
        return res.status(403).json({ data: false, message: Error.m034 });
      if (!ChapterId)
        return res.status(400).json({ data: false, message: Error.m033 });

      const [UserLine] = await GetService.byFields(
        UserLineQuery.q012,
        ["UserId"],
        [Number],
        [UserId],
      );
      if (!UserLine)
        return res.status(401).json({ data: false, message: Error.m031 });
      const [owned] = await GetService.byFields(
        UserTermsQuery.q015,
        ["UserId", "ChapterId"],
        [Number, Number],
        [UserId, ChapterId],
      );
      if (owned)
        return res.status(409).json({ data: false, message: Error.m035 });
      const ChapterPrice = Number(
        (await GetService.byId(ChapterId, DBTable.t002))[0].Coins,
      );

      // Deduct atomically: the row only changes if the balance still covers the price,
      // so two simultaneous purchases cannot overspend.
      const [deduct]: any = await pool.execute(
        "UPDATE `userline` SET `Coins` = `Coins` - ?, `DateUpdated` = ? WHERE `Id` = ? AND `Coins` >= ?",
        [ChapterPrice, new Date(), UserLine.Id, ChapterPrice],
      );
      if (!deduct?.affectedRows)
        return res.status(401).json({ data: false, message: Error.m031 });

      const response = await UserTermsModel.add({
        UserId,
        ChapterId,
        Status: Number(Data.Status),
      });
      if (!response.data) {
        // Refund when the unlock could not be recorded.
        await pool.execute(
          "UPDATE `userline` SET `Coins` = `Coins` + ? WHERE `Id` = ?",
          [ChapterPrice, UserLine.Id],
        );
        return res.status(401).json({ data: false, message: response.message });
      }
      return res.status(200).json({ data: true, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("UserTerms-Controller [purchaseChapter]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  } // PURCHASE-CHAPTER

  @Route("patch", "/update/:Id", TokenHandler.verifyToken, requireRoles(Roles.admin))
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

  @Route("patch", "/unbookmark/:Id", TokenHandler.verifyToken)
  async unbookmark(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const UserTermId = parseInt(req.params.Id, 10);
      const Status = Number(req.body?.Status);
      if (Status !== 0 && Status !== 1)
        return res.status(400).json({ data: false, message: Error.m014 });
      const row = await getOwnedUserTerm(req, res, UserTermId);
      if (!row) return;
      // Only bookmark rows can be toggled here; chapter unlocks are untouched.
      if (!row.TermId)
        return res.status(403).json({ data: false, message: Error.m034 });
      const response = await UserTermsModel.update(UserTermId, { Status } as UserTermsTable);
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
