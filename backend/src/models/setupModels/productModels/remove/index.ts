import { isDefault, isFound } from "../../../../functions";
import { RemoveService } from "../../../../services";
import { DBTable, Error, ProductQuery, Success } from "../../../../shared";
import { ModelResponse } from "../../../../types";

export const removeModel = async (Id: number = 0): Promise<ModelResponse> => {
  try {
    if (!Id || typeof Id !== 'number') return { data: false, message: Error.m014 }
    if ((await isDefault(Id, DBTable.t003)).data) return { data: false, message: Error.m017 }
    if((await isFound(ProductQuery.q007, ['ProductId'], [Number], [Id])).data) return { data: false, message: Error.m020 }
    if (!(await RemoveService.byId(Id, DBTable.t003))) return { data: false, message: Error.m014 }
    return { data: true, message: Success.m003 }
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("ProductTable-Model [removeModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: false, message: Error.m001 };
  }
};
