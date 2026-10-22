import { ModelResponse, TermLineInitial, TermLineTable } from "../../../../types";
import { DBTable, Error, Success, TermLineQuery } from "../../../../shared";
import { AddService } from "../../../../services";
import { isFound } from "../../../../functions";

export const addModel = async (Data: TermLineTable = TermLineInitial, CurrentId: number = 0): Promise<ModelResponse> => {
  try {
    if (!CurrentId || typeof CurrentId !== 'number') return { data: false, message: Error.m015 }
    if (!Data) return { data: false, message: Error.m014}
    // ask for any duplication in term-line on nxt meeting
    Data.CreatedBy = CurrentId, Data.DateCreated = new Date();
    const Fields = Object.keys(Data), Types = Object.values(Data).map((val) => typeof val), Values = Object.values(Data);
    const hasDuplicate = await isFound(TermLineQuery.q0014, ['TermId', 'Position'], [Number, Number], [Data.TermId, Data.Position])
    if (hasDuplicate.data) return { data: false, message: Error.m027 };
    if (!(await AddService.record(DBTable.t006, Fields, Types, Values))) return { data: false, message: Error.m003 };
    return { data: true, message: Success.m002 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("TermLine-Model [addModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: false, message: Error.m001 };
  }
};
