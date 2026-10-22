import { isDefault, isFound } from "../../../../functions";
import { RemoveService } from "../../../../services";
import { DBTable, Error, Success, TermQuery } from "../../../../shared";
import { ModelResponse } from "../../../../types";

export const removeModel = async (Id: number = 0): Promise<ModelResponse> => {
  try {
    if (!Id || typeof Id !== 'number') return { data: false, message: Error.m014 }
    if ((await isDefault(Id, DBTable.t003)).data) return { data: false, message: Error.m017 }
    if ((await isFound(TermQuery.q007,['Id'], [Number], [Id])).data) return { data: false, message: Error.m020 }
    if (!(await RemoveService.byId(Id, DBTable.t005))) return { data: false, message: Error.m014 }
    return { data: true, message: Success.m003 }
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("TermTable-Model [removeModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: false, message: Error.m001 };
  }
};
