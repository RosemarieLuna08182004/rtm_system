import { NextFunction, Request, Response } from "express";
import { Controller, Route, Validate } from "../../../decorators";
import { TokenHandler } from "../../../middleware";
import { API } from "../../../constants";
import {
  termValidatorOnCreate,
  termValidatorOnUpdate,
  importRowsValidator,
} from "../../../validators";
import { Success, Error } from "../../../shared";
import { DuplicateAlerts, TermModel } from "../../../models";
import { checkImportScript } from "../../../functions";
import { LoginRequest } from "../../../types";

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

  @Route("get", "/get-all/:Id/:UserId", TokenHandler.verifyToken)
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

  @Route("delete", "/remove/:Id", TokenHandler.verifyToken, TokenHandler.verifyAdmin)
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

  @Route("post", "/add/", TokenHandler.verifyToken, TokenHandler.verifyAdmin)
  // model here
  @Validate(termValidatorOnCreate)
  async add(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const Data = req.body,
        CurrentId = parseInt(`${req.User?.Id}`, 10),
        response = await TermModel.add(Data, CurrentId);
      if (!response.data)
        return res.status(401).json({ data: false, message: response.message });
      await DuplicateAlerts.afterTermSaved(Data, null, CurrentId); // never throws
      return res.status(200).json({ data: true, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("Term-Controller [add]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }

  @Route("post", "/import-data/", TokenHandler.verifyToken, TokenHandler.verifyAdmin)
  async importData(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const Data = req.body,
        CurrentId = parseInt(`${req.User?.Id}`, 10);
      // Runs as raw SQL, so only a single plain INSERT into term/termline is accepted
      const check = checkImportScript(String(Data.Query ?? ""));
      if ("reason" in check)
        return res.status(400).json({ data: false, message: `${Error.m036} ${check.reason}.` });
      const before = await DuplicateAlerts.importSnapshot();
      const response = await TermModel.imports(Data.Query, CurrentId);
      if (!response.data)
        return res.status(401).json({ data: false, message: response.message });
      await DuplicateAlerts.afterImport(before, CurrentId); // never throws
      const what = check.table === "term" ? "term" : "sub term";
      return res.status(200).json({
        data: true,
        rows: check.rows,
        table: check.table,
        message: `Imported ${check.rows} ${what}${check.rows === 1 ? "" : "s"}.`,
      });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("Term-Controller [import-data]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }

  /**
   * Spreadsheet (Excel / CSV) import. Rows name their volume, term and category.
   * DryRun: true only reports what would happen, for the preview.
   */
  @Route("post", "/import-rows/", TokenHandler.verifyToken, TokenHandler.verifyAdmin)
  async importRows(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const CurrentId = parseInt(`${req.User?.Id}`, 10);
      const { value, error } = importRowsValidator.validate(req.body ?? {});
      if (error) return res.status(400).json({ data: false, message: error.details[0]?.message ?? error.message });
      const before = value.DryRun ? null : await DuplicateAlerts.importSnapshot();
      const response = await TermModel.importRows(value.Terms, value.SubTerms, value.DryRun, CurrentId);
      if (response.saved) await DuplicateAlerts.afterImport(before, CurrentId); // never throws
      const { termsAdded, subTermsAdded, skipped, problems } = response.summary;
      const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
      const message = value.DryRun
        ? "Preview ready."
        : response.saved
          ? `Imported ${plural(termsAdded, "term")} and ${plural(subTermsAdded, "sub term")}.${skipped ? ` Skipped ${skipped}.` : ""}${problems ? ` ${plural(problems, "row")} with problems not imported.` : ""}`
          : "Nothing new to import.";
      return res.status(200).json({ data: { ...response }, message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("Term-Controller [import-rows]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: "The import failed and nothing was saved. Please try again." });
    }
  }

  @Route("patch", "/update/:Id", TokenHandler.verifyToken, TokenHandler.verifyAdmin)
  // model here
  @Validate(termValidatorOnUpdate)
  async update(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const Id = parseInt(req.params.Id, 10),
        Data = req.body,
        CurrentId = parseInt(`${req.User?.Id}`, 10),
        before = await DuplicateAlerts.termSnapshot(Id),
        response = await TermModel.update(Id, Data, CurrentId);
      if (!response.data)
        return res.status(401).json({ data: false, message: response.message });
      await DuplicateAlerts.afterTermSaved(Data, before, CurrentId); // never throws
      return res.status(200).json({ data: true, message: response.message });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("Term-Controller [update]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }
}
