import { GetService } from "../../../../services";
import { Error, Success, TermLineQuery } from "../../../../shared";
import { ModelResponse } from "../../../../types";

export const getAllByTermModel = async (Id:number = 0): Promise<ModelResponse> => {
  try {
    const response = await GetService.byFields(TermLineQuery.q0013, ['TermId'], [Number], [Id])
    if (!response) return { data: [], message: Error.m011 }
    return { data: response, message: Success.m001 }
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("TermLine-Model [getAllByTermModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: [], message: Error.m001 };
  }
};