import { isFound } from "../../../../functions";
import { UpdateService } from "../../../../services";
import { DBTable, Error, Success, UserTermsQuery } from "../../../../shared";
import {
  ModelResponse,
  UserTermsInitial,
  UserTermsTable,
} from "../../../../types";

export const updateModel = async (
  Id: number = 0,
  Data: UserTermsTable = UserTermsInitial,
): Promise<ModelResponse> => {
  try {
    if (!Id || typeof Id !== "number")
      return { data: false, message: Error.m005 };
    if (
      !Data ||
      Data === undefined ||
      typeof Data === "undefined" ||
      typeof Data !== "object"
    )
      return { data: false, message: Error.m014 };
    if (!(await isFound(UserTermsQuery.q006, ["Id"], [Number], [Id])).data)
      return { data: false, message: Error.m011 };
    Data.DateUpdated = new Date();
    const Fields = Object.keys(Data),
      Types = Object.values(Data).map((val) => typeof val),
      Values = Object.values(Data);
    if (!(await UpdateService.record(Id, DBTable.t009, Fields, Types, Values)))
      return { data: false, message: Error.m003 };
    return { data: true, message: Success.m004 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("UserTermsTable-Model [updateModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: false, message: Error.m001 };
  }
};
