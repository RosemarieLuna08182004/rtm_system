import { GetService } from "../../../../services";
import { Error, SalesQuery, Success } from "../../../../shared";
import { ModelResponse } from "../../../../types";

export const getAllModel = async (): Promise<ModelResponse> => {
  try {
    const response = await GetService.byQuery(SalesQuery.q012);
    if (!response) return { data: [], message: Error.m011 };
    return { data: response, message: Success.m001 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("SalesTable-Model [getAllModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: [], message: Error.m001 };
  }
};

export const getAllCountsModel = async (): Promise<ModelResponse> => {
  try {
    const response = await GetService.byQuery(SalesQuery.q013);
    //if (!response) return { data: [], message: Error.m011 };
    return { data: response, message: Success.m001 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("Generic-Model [getAllCount]:", error.message);
    logging.log("----------------------------------------");
    return { data: [], message: Error.m001 };
  }
};
