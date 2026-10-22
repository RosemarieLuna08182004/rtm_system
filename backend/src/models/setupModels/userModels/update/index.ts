import { isFound } from "../../../../functions";
import { UpdateService } from "../../../../services";
import { DBTable, Error, Success, UserQuery } from "../../../../shared";
import { ModelResponse, UserInitial, UserTable } from "../../../../types";
import bcrypt from 'bcrypt'

export const updateModel = async (Id: number = 0, Data: UserTable = UserInitial): Promise<ModelResponse> => {
  try {
    if (!Id || typeof Id !== 'number') return { data: false, message: Error.m005 }
    if (!Data || Data === undefined || typeof Data === 'undefined' || typeof Data !== 'object') return { data: false, message: Error.m014 };
    if (!(await isFound(UserQuery.q006,['Id'],[Number],[Id])).data) return { data: false, message: Error.m011 };
    if(Data.Password) Data.Password = await bcrypt.hash(Data.Password, 10), Data.DateUpdated = new Date()
    const Fields = Object.keys(Data), Types = Object.values(Data).map((val) => typeof val), Values = Object.values(Data);
    if (!(await UpdateService.record(Id, DBTable.t007, Fields, Types, Values))) return { data: false, message: Error.m003 };
    return { data: true, message: Success.m004 };
  } catch (error: any) {
    // A unique key (email, bookmark, unlock) rejected the row.
    if (error?.code === "ER_DUP_ENTRY") return { data: false, message: Error.m016 };
    logging.log("----------------------------------------");
    logging.error("UserTable-Model [updateModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: false, message: Error.m001 };
  }
};
