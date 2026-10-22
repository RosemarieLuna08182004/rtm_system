import { isFound } from "../../../../functions";
import { GetService } from "../../../../services";
import { ChapterQuery, Error, Success, TermQuery, UserTermsQuery } from "../../../../shared";
import { ModelResponse } from "../../../../types";

export const getAllByChapterModel = async (Id: number): Promise<ModelResponse> => {
  try {
    if (!Id || typeof Id !== 'number') return { data: [], message: Error.m014 }
    const isExists = await isFound(ChapterQuery.q006,['Id'], [Number], [Id])
    if (!isExists.data) return { data: [], message: isExists.message }
    const response = await GetService.byFields(TermQuery.q0013, ['ChapterId'], [Number], [Id])
    if (!response) return { data: [], message: Error.m011 }
    return { data: response, message: Success.m001 }
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("TermTable-Model [getAllByChapterModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: [], message: Error.m001 };
  }
};

export const getAllByChapterUserModel = async (Id: number, UserId:number): Promise<ModelResponse> => {
  try {
    if (!Id || typeof Id !== 'number') return { data: [], message: Error.m014 }
    const isExists = await isFound(ChapterQuery.q006,['Id'], [Number], [Id])
    if (!isExists.data) return { data: [], message: isExists.message }
    const isExists2 = await isFound(UserTermsQuery.q003,['UserId'], [Number], [UserId])
    if (!isExists2.data) return { data: [], message: isExists.message }
    const response = await GetService.byFields(TermQuery.q0014, ['UserId','ChapterId'], [Number, Number], [16, 1 ])
    if (!response) return { data: [], message: Error.m011 }
    return { data: response, message: Success.m001 }
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("TermTable-Model [getAllByChapterModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: [], message: error.message || Error.m001 };
  }
};
