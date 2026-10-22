import { ModelResponse, SalesInitial, SalesTable } from "../../../../types";
import { GenerateFn, } from "../../../../functions";
import { DBTable, Error, Success } from "../../../../shared";
import { AddService } from "../../../../services";

export const addModel = async (Data: SalesTable = SalesInitial): Promise<ModelResponse> => {
  try {
    if (!Data || Data === undefined || typeof Data === 'undefined' || typeof Data !== 'object') return { data: false, message: Error.m014}
    Data.SalesNumber = (await GenerateFn.tableNumber(DBTable.t004)).data; Data.DateCreated = new Date();
    const Fields = Object.keys(Data), Types = Object.values(Data).map((val) => typeof val), Values = Object.values(Data);
    if (!(await AddService.record(DBTable.t004, Fields, Types, Values))) return { data: false, message: Error.m003 };
    return { data:true, message: Success.m002 }
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("SalesTable-Model [addModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: false, message: Error.m001 };
  }
};
