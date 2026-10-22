import { isFound } from "../../../../functions";
import { UpdateService } from "../../../../services";
import { ChapterQuery, DBTable, Error, Success } from "../../../../shared";
import { ChapterInitial, ChapterTable } from "../../../../types";

export const updateModel = async (Id: number = 0, Data: ChapterTable = ChapterInitial, CurrentId: number = 0) => {
  try {
    if (!Id || typeof Id !== 'number') return { data: false, message: Error.m005 }
    if (!Data || Data === undefined || typeof Data === 'undefined' || typeof Data !== 'object' ) return { data: false, message: Error.m014 };
    if (!CurrentId || typeof CurrentId !== 'number') return { data: false, message: Error.m015 }
    if (!(await isFound(ChapterQuery.q006,['Id'],[Number],[Id])).data) return { data: false, message: Error.m011 };
    Data.UpdatedBy = CurrentId, Data.DateUpdated = new Date()
    const Fields = Object.keys(Data), Types = Object.values(Data).map((val) => typeof val), Values = Object.values(Data);
    if (!(await UpdateService.record(Id, DBTable.t002, Fields, Types, Values))) return { data: false, message: Error.m003 };
    return { data: true, message: Success.m004 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("ChapterTable-Model [updateModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: false, message: Error.m001 };
  }
};
