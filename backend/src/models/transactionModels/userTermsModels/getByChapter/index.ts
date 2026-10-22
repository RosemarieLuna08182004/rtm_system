import { GetService } from "../../../../services";
import { Error, Success, UserTermsQuery } from "../../../../shared";
import { ModelResponse } from "../../../../types";

export const getByChapter = async (Id:number,chapterId:number): Promise<ModelResponse> => {
  try {
    if (!Id || typeof Id !== 'number') return { data: [], message: Error.m014 }
    if (!chapterId || typeof chapterId !== 'number') return { data: [], message: Error.m014 }
    const response = await GetService.byFields(UserTermsQuery.q015,['UserId','ChapterId'],[Number,Number],[Id,chapterId])
    if (!response) return { data: [], message: Error.m011 }
    return { data: response, message: Success.m001 }
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("UserTermsTable-Model [getByChapter]:", error.message);
    logging.log("----------------------------------------");
    return { data: [], message: Error.m001 };
  }
};
