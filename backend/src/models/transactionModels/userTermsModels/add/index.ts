import {
  ModelResponse,
  UserTermsInitial,
  UserTermsTable,
} from "../../../../types";
import { DBTable, Error, Success, UserTermsQuery } from "../../../../shared";
import { AddService } from "../../../../services";
import { isFound } from "../../../../functions";

export const addModel = async (
  Data: UserTermsTable,
): Promise<ModelResponse> => {
  try {
    if (
      !Data ||
      Data === undefined ||
      typeof Data === "undefined" ||
      typeof Data !== "object"
    )
      return { data: false, message: Error.m014 };
    Data.DateCreated = new Date();
    if (
      (
        await isFound(
          UserTermsQuery.q014,
          ["UserId", "TermId"],
          [Number, Number],
          [Data.UserId, Data.TermId],
        )
      ).data
    )
      return { data: false, message: Error.m016 };
    const Fields = Object.keys(Data),
      Types = Object.values(Data).map((val) => typeof val),
      Values = Object.values(Data);
    if (!(await AddService.record(DBTable.t009, Fields, Types, Values)))
      return { data: false, message: Error.m003 };
    return { data: true, message: Success.m002 };
  } catch (error: any) {
    // A unique key (email, bookmark, unlock) rejected the row.
    if (error?.code === "ER_DUP_ENTRY") return { data: false, message: Error.m016 };
    logging.log("----------------------------------------");
    logging.error("UserTermsTable-Model [addModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: false, message: Error.m001 };
  }
};
