import { GetService } from "../../../../services";
import { Error, Success, UserLineQuery } from "../../../../shared";
import { ModelResponse } from "../../../../types";

export const getAllModel = async (): Promise<ModelResponse> => {
  try {
    const response = await GetService.byQuery(UserLineQuery.q010)
    if (!response) return { data: [], message: Error.m011 }
    return { data: response, message: Success.m001 }
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("UserLineTable-Model [getAllModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: [], message: Error.m001 };
  }
};
