import { isFound } from "../../../../functions";
import { UpdateService } from "../../../../services";
import { DBTable, Error, Success, UserLineQuery } from "../../../../shared";
import { ModelResponse, UserLineInitial, UserLineTable } from "../../../../types";

export const updateByConditionModel = async (UserId: number = 0, Data: UserLineTable = UserLineInitial): Promise<ModelResponse> => {
  try {
    if (!UserId || typeof UserId !== 'number') return { data: false, message: Error.m005 }
    if (!Data || Data === undefined || typeof Data === 'undefined' || typeof Data !== 'object') return { data: false, message: Error.m014 };
    if (!(await isFound(UserLineQuery.q013,['UserId'], [Number], [UserId])).data) return { data: false, message: Error.m011 };
    Data.DateUpdated = new Date()
    const Fields = Object.keys(Data), Types = Object.values(Data).map((val) => typeof val), Values = Object.values(Data);
    if (!(await UpdateService.condition(DBTable.t008, Fields, Types, Values, "UserId = ?", [UserId]))) return { data: false, message: Error.m003 };
    return { data: true, message: Success.m004 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("UserLineTable-Model [updateByConditionModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: false, message: Error.m001 };
  }
};
