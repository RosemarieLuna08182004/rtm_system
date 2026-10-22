/**********************************************
 * AUTHOR       : Mark Dinglasa
 * COMMENT/S    : Model-addModel 
 * CHANGES      : N/A
 * LOG-DATE     : 2024-09-25
 ***********************************************/

import { CategoryInitial, CategoryTable, ModelResponse } from "../../../../types";
import { CategoryQuery, DBTable, Error, Success } from "../../../../shared";
import { isFound } from "../../../../functions";
import { AddService } from "../../../../services";

export const addModel = async (Data: CategoryTable = CategoryInitial, CurrentId: number = 0): Promise<ModelResponse> => {
  try {
    if (!CurrentId || typeof CurrentId !== 'number') return { data: false, message: Error.m015 }
    if (!Data) return { data: false, message: Error.m014}
    if ((await isFound(CategoryQuery.q003, ['Category'], [String], [Data.Category])).data) return { data:false, message: Error.m016 }
    Data.CreatedBy = CurrentId, Data.DateCreated = new Date();
    const Fields = Object.keys(Data), Types = Object.values(Data).map((val) => typeof val), Values = Object.values(Data);
    if (!(await AddService.record(DBTable.t001, Fields, Types, Values))) return { data: false, message: Error.m003 };
    return { data:true, message: Success.m002 }
  } catch (error: any) {
    logging.log("----------------------------------------");                                                                           
    logging.error("CategoryTable-Model [AddModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: false, message: Error.m001 };
  }
};