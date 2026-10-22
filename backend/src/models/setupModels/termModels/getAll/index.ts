import { GetService } from "../../../../services";
import { Error, Success, TermQuery } from "../../../../shared";
import { ModelResponse } from "../../../../types";

export const getAllModel = async (): Promise<ModelResponse> => {
  try {
    const response = await GetService.byQuery(TermQuery.q0012)
    if (!response) return { data: [], message: Error.m011 }
    return { data: response, message: Success.m001 }
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("TermTable-Model [getAllModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: [], message: Error.m001 };
  }
};
