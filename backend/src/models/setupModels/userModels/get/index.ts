import { isFound } from "../../../../functions";
import { GetService } from "../../../../services";
import { DBTable, Error, Success, UserQuery } from "../../../../shared";
import { ModelResponse } from "../../../../types";

export const getModel = async (Id: number = 0): Promise<ModelResponse> => {
  try {
    if (!Id || typeof Id !== 'number') return { data: [], message: Error.m014 }
    const isExists = await isFound(UserQuery.q006,['Id'], [Number], [Id])
    if(!isExists.data) return { data: [], message: isExists.message }
    const response = await GetService.byId(Id, DBTable.t007);
    if (!response) return {data: [], message: Error.m011 }
    return { data: response[0], message: Success.m001 }
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("UserTable-Model [getModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: [], message: Error.m001 };
  }
};
