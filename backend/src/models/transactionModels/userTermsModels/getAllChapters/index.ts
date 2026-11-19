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