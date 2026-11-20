import { GetService } from "../../../../services";
import { DBTable, Error, Success, UserQuery } from "../../../../shared";
import { ModelResponse } from "../../../../types";
import { withoutSecrets } from "../../../../functions/security";

export const getAllModel = async (): Promise<ModelResponse> => {
  try {
    const response = await GetService.byQuery(UserQuery.q001)
    if (!response) return { data: [], message: Error.m011 }
    return { data: response.map(withoutSecrets), message: Success.m001 }
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("UserTable-Model [getAllModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: [], message: Error.m001 };
  }
};
