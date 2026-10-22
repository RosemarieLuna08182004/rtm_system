import { ChapterInitial, ChapterTable } from "../../../../types";
import { isFound } from "../../../../functions";
import { ChapterQuery, DBTable, Error, Success } from "../../../../shared";
import { AddService } from "../../../../services";

export const addModel = async (Data: ChapterTable = ChapterInitial, CurrentId: number = 0) => {
  try {
    
    if (!CurrentId || typeof CurrentId !== 'number') return { data: false, message: Error.m015 }
    if (!Data) return { data: false, message: Error.m014}
    if ((await isFound(ChapterQuery.q003, ["Title"], [String], [Data.Title])).data) return { data: false, message: Error.m016 };
    Data.CreatedBy = CurrentId, Data.DateCreated = new Date();
    const Fields = Object.keys(Data), Types = Object.values(Data).map((val) => typeof val), Values = Object.values(Data);
    if (!(await AddService.record(DBTable.t002, Fields, Types, Values))) return { data: false, message: Error.m003 };
    return { data: true, message: Success.m002 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("ChapterTable-Model [addModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: false, message: Error.m001 };
  }
};
