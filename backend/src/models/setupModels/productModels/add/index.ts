import { ProductTable, ProductInitial, ModelResponse } from "../../../../types";
import { isFound } from "../../../../functions";
import { DBTable, Error, ProductQuery, Success } from "../../../../shared";
import { AddService } from "../../../../services";

export const addModel = async (Data: ProductTable = ProductInitial, CurrentId: number = 0): Promise<ModelResponse> => {
  try {
    if (!CurrentId || typeof CurrentId !== 'number') return { data: false, message: Error.m015 }
    if (!Data) return { data: false, message: Error.m014}
    if ((await isFound(ProductQuery.q003, ["Name"], [String], [Data.Name])).data) return { data: false, message: Error.m016 };
    Data.CreatedBy = CurrentId, Data.DateCreated = new Date();
    const Fields = Object.keys(Data), Types = Object.values(Data).map((val) => typeof val), Values = Object.values(Data);
    if (!(await AddService.record(DBTable.t003, Fields, Types, Values))) return { data: false, message: Error.m003 };
    return { data: true, message: Success.m002 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("ProductTable-Model [addModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: false, message: Error.m001 };
  }
};
