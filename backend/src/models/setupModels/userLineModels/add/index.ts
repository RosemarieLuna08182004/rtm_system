import { ModelResponse, UserLineInitial, UserLineTable } from "../../../../types";
import { DBTable, Error, Success } from "../../../../shared";
import { AddService } from "../../../../services";

export const addModel = async (Data: UserLineTable = UserLineInitial): Promise<ModelResponse> => {
  try {
    if (!Data) return { data: false, message: Error.m014}
    Data.DateCreated = new Date();
    const Fields = Object.keys(Data), Types = Object.values(Data).map((val) => typeof val), Values = Object.values(Data);
    if (!(await AddService.record(DBTable.t008, Fields, Types, Values))) return { data: false, message: Error.m003 };
    return { data:true, message: Success.m002 }
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("UserLineTable-Model [addModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: false, message: Error.m001 };
  }
};
