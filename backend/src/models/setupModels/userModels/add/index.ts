import { ModelResponse, UserInitial, UserTable } from "../../../../types";
import { AddService } from "../../../../services";
import { isFound } from "../../../../functions";
import { DBTable, Error, Success, UserQuery } from "../../../../shared";
import bcrypt from "bcrypt";

export const addModel = async (Data: UserTable = UserInitial): Promise<ModelResponse> => {
  try {
    if (!Data) return { data: false, message: Error.m014}
    if ((await isFound(UserQuery.q003, ["Email"], [String], [Data.Email])).data) return { data: false, message: Error.m016 };
    Data.Password = await bcrypt.hash(Data.Password, 10), Data.DateCreated = new Date();
    const Fields = Object.keys(Data), Types = Object.values(Data).map((val) => typeof val), Values = Object.values(Data);
    if (!(await AddService.record(DBTable.t007, Fields, Types, Values))) return { data: false, message: Error.m003 };
    return { data: true, message: Success.m002 }
  } catch (error: any) {
    // A unique key (email, bookmark, unlock) rejected the row.
    if (error?.code === "ER_DUP_ENTRY") return { data: false, message: Error.m016 };
    logging.log("----------------------------------------");
    logging.error("UserTable-Model [addModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: false, message: Error.m001 };
  }
};
