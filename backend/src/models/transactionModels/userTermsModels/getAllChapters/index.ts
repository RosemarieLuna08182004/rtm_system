import { isFound } from "../../../../functions";
import { GetService } from "../../../../services";
import {
  ChapterQuery,
  Error,
  Success,
  TermQuery,
  UserQuery,
  UserTermsQuery,
} from "../../../../shared";
import { ModelResponse } from "../../../../types";

export const getAllChaptersModel = async (
  UserId: number,
): Promise<ModelResponse> => {
  try {
    const response = await GetService.byFields(
      UserTermsQuery.q016,
      ["UserId", "UserId"],
      [Number, Number],
      [UserId, UserId],
    );
    if (!response) return { data: [], message: Error.m011 };
    return { data: response, message: Success.m001 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("UserTermsTable-Model [getAllChaptersModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: [], message: Error.m001 };
  }
};

export const getChapterModel = async (
  UserId: number,
  ChapterId: number,
): Promise<ModelResponse> => {
  try {
    const response = await GetService.byFields(
      UserTermsQuery.q017,
      ["UserId", "UserId", "ChapterId"],
      [Number, Number, Number],
      [UserId, UserId, ChapterId],
    );
    if (!response) return { data: [], message: Error.m011 };
    return { data: response, message: Success.m001 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("UserTermsTable-Model [getChapterModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: [], message: Error.m001 };
  }
};

export const getAllTermsByChapterModel = async (
  UserId: number,
  ChapterId: number,
): Promise<ModelResponse> => {
  try {
    const response = await GetService.byFields(
      UserTermsQuery.q018,
      ["UserId", "UserId", "UserId", "ChapterId"],
      [Number, Number, Number, Number],
      [UserId, UserId, UserId, ChapterId],
    );
    if (!response) return { data: [], message: Error.m011 };
    return { data: response, message: Success.m001 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error(
      "UserTermsTable-Model [getAllTermsByChapterModel]:",
      error.message,
    );
    logging.log("----------------------------------------");
    return { data: [], message: Error.m001 };
  }
};

export const getAllBookmarkModel = async (
  UserId: number,
  ChapterId: number,
): Promise<ModelResponse> => {
  try {
    const isExists = await isFound(UserQuery.q006, ["Id"], [Number], [UserId]);
    if (!isExists.data) return { data: [], message: Error.m030 };
    const isChapterExists = await isFound(ChapterQuery.q006, ["Id"], [Number], [ChapterId]);
    if (!isChapterExists.data) return { data: [], message: Error.m033 };
    const response = await GetService.byFields(
      UserTermsQuery.q023,
      ["UserId", "ChapterId",],
      [Number, Number,],
      [UserId, ChapterId,],
    );
    if (!response) return { data: [], message: Error.m011 };
    return { data: response, message: Success.m001 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("UserTermsTable-Model [getAllBookmarkModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: [], message: Error.m001 };
  }
};

export const getTermModel = async (
  UserId: number,
  TermId: number,
): Promise<ModelResponse> => {
  try {
    const isExists = await isFound(TermQuery.q006, ["Id"], [Number], [TermId]);
    if (!isExists.data) return { data: [], message: Error.m029 };
    const response = await GetService.byFields(
      UserTermsQuery.q021,
      ["UserId", "UserId", "UserId", "TermId"],
      [Number, Number, Number, Number],
      [UserId, UserId, UserId, TermId],
    );
    if (!response) return { data: [], message: Error.m011 };
    return { data: response, message: Success.m001 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("UserTermsTable-Model [getAllBookmarkModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: [], message: Error.m001 };
  }
};


export const getAllChapterByBookmarkModel = async (
  UserId: number,
): Promise<ModelResponse> => {
  try {
    const response = await GetService.byFields(
      UserTermsQuery.q022,
      ["UserId"],
      [Number,],
      [UserId,],
    );
    if (!response) return { data: [], message: Error.m011 };
    return { data: response, message: Success.m001 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error(
      "UserTermsTable-Model [getAllChapterByBookmarkModel]:",
      error.message,
    );
    logging.log("----------------------------------------");
    return { data: [], message: Error.m001 };
  }
};
export interface BookmarkGroup {
  ChapterId: number;
  Title: string;
  terms: Array<{ TermId: number; Term: string; UserTermsId: number; ChapterId: number; Status: string }>;
}

// One query for the Bookmarks tab: every bookmark of the user, grouped by chapter
// (chapters and terms already sorted by the query).
export const getBookmarksGroupedModel = async (
  UserId: number,
): Promise<ModelResponse> => {
  try {
    const rows = await GetService.byFields(UserTermsQuery.q024, ["UserId"], [Number], [UserId]);
    const groups: BookmarkGroup[] = [];
    const byChapter = new Map<number, BookmarkGroup>();
    for (const row of rows ?? []) {
      const chapterId = Number(row.ChapterId);
      let group = byChapter.get(chapterId);
      if (!group) {
        group = { ChapterId: chapterId, Title: row.ChapterTitle ?? `Chapter ${chapterId}`, terms: [] };
        byChapter.set(chapterId, group);
        groups.push(group);
      }
      group.terms.push({
        TermId: Number(row.TermId),
        Term: String(row.Term ?? "").trim(),
        UserTermsId: Number(row.UserTermsId),
        ChapterId: chapterId,
        Status: row.Status,
      });
    }
    return { data: groups, message: Success.m001 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("UserTermsTable-Model [getBookmarksGroupedModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: [], message: Error.m001 };
  }
};

export interface IndexChapter {
  ChapterId: number;
  Title: string;
  Status: string;
  TermCount: number;
}

// Each chapter once with the caller's lock status (duplicate join rows collapse; any unlock wins).
const getChapterStatuses = async (UserId: number): Promise<Map<number, IndexChapter>> => {
  const rows = await GetService.byFields(UserTermsQuery.q016, ["UserId", "UserId"], [Number, Number], [UserId, UserId]);
  const chapters = new Map<number, IndexChapter>();
  for (const row of rows ?? []) {
    const id = Number(row.ChapterId ?? row.Id);
    const existing = chapters.get(id);
    if (!existing || row.Status === "Unlock") {
      chapters.set(id, { ChapterId: id, Title: String(row.Title ?? "").trim(), Status: row.Status, TermCount: 0 });
    }
  }
  return chapters;
};

// Compact list of every term plus each chapter once, for search, Home and progress.
export const getTermIndexModel = async (UserId: number): Promise<ModelResponse> => {
  try {
    const chapters = await getChapterStatuses(UserId);
    const rows = await GetService.byQuery(UserTermsQuery.q025);
    const terms = (rows ?? []).map((row: any) => ({
      TermId: Number(row.TermId),
      Term: String(row.Term ?? "").trim(),
      ChapterId: Number(row.ChapterId),
    }));
    for (const term of terms) {
      const chapter = chapters.get(term.ChapterId);
      if (chapter) chapter.TermCount++;
    }
    return { data: { chapters: [...chapters.values()], terms }, message: Success.m001 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("UserTermsTable-Model [getTermIndexModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: { chapters: [], terms: [] }, message: Error.m001 };
  }
};

// Terms that share a root word, with chapter title and the caller's lock status.
export const getTermsByRootModel = async (UserId: number, Root: string): Promise<ModelResponse> => {
  try {
    // Escape LIKE wildcards so the root is matched literally.
    const word = Root.trim().replace(/[%_\\]/g, "\\$&");
    const chapters = await getChapterStatuses(UserId);
    const rows = await GetService.byFields(UserTermsQuery.q026, ["Description"], [String], [`%>${word}<%`]);
    const terms = (rows ?? []).map((row: any) => {
      const chapter = chapters.get(Number(row.ChapterId));
      return {
        TermId: Number(row.TermId),
        Term: String(row.Term ?? "").trim(),
        ChapterId: Number(row.ChapterId),
        ChapterTitle: chapter?.Title ?? "",
        Status: chapter?.Status ?? "Lock",
      };
    });
    return { data: terms, message: Success.m001 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("UserTermsTable-Model [getTermsByRootModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: [], message: Error.m001 };
  }
};

// The most recently added terms, with chapter title and the caller's lock status.
export const getNewTermsModel = async (UserId: number, Limit: number): Promise<ModelResponse> => {
  try {
    const chapters = await getChapterStatuses(UserId);
    // LIMIT ? is passed as a string: MySQL 8 prepared statements reject a numeric LIMIT parameter.
    const rows = await GetService.byFields(UserTermsQuery.q027, ["Limit"], [String], [String(Math.trunc(Limit))]);
    const terms = (rows ?? []).map((row: any) => {
      const chapter = chapters.get(Number(row.ChapterId));
      return {
        TermId: Number(row.TermId),
        Term: String(row.Term ?? "").trim(),
        ChapterId: Number(row.ChapterId),
        ChapterTitle: chapter?.Title ?? "",
        Status: chapter?.Status ?? "Lock",
        DateCreated: row.DateCreated,
      };
    });
    return { data: terms, message: Success.m001 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("UserTermsTable-Model [getNewTermsModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: [], message: Error.m001 };
  }
};
