import { ModelResponse, TermInitial, TermTable } from "../../../../types";
import { isFound } from "../../../../functions";
import { DBTable, Error, Success, TermQuery } from "../../../../shared";
import { AddService, GetService } from "../../../../services";

export const addModel = async (
  Data: TermTable = TermInitial,
  CurrentId: number = 0,
): Promise<ModelResponse> => {
  try {
    if (!CurrentId || typeof CurrentId !== "number")
      return { data: false, message: Error.m015 };
    if (!Data) return { data: false, message: Error.m014 };
    if (
      (
        await isFound(
          TermQuery.q003,
          ["Term", "ChapterId"],
          [String, Number],
          [Data.Term, Data?.ChapterId],
        )
      ).data
    )
      return { data: false, message: Error.m016 };
    (Data.CreatedBy = CurrentId), (Data.DateCreated = new Date());
    const Fields = Object.keys(Data),
      Types = Object.values(Data).map((val) => typeof val),
      Values = Object.values(Data);
    if (!(await AddService.record(DBTable.t005, Fields, Types, Values)))
      return { data: false, message: Error.m003 };
    return { data: true, message: Success.m002 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("TermTable-Model [addModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: false, message: Error.m001 };
  }
};

export const importModel = async (
  Data: string,
  CurrentId: number = 0,
): Promise<ModelResponse> => {
  try {
    if (!CurrentId || typeof CurrentId !== "number")
      return { data: false, message: Error.m015 };
    if (!Data) return { data: false, message: Error.m014 };
    if (!(await GetService.byQuery(Data)))
      return { data: false, message: Error.m003 };
    return { data: true, message: Success.m002 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("TermTable-Model [importModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: false, message: error.message || Error.m001 };
  }
};
