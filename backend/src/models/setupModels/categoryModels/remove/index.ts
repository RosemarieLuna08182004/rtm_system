/**********************************************
 * AUTHOR       : Mark Dinglasa
 * COMMENT/S    : Model-removeModel 
 * CHANGES      : N/A
 * LOG-DATE     : 2024-09-25
 ***********************************************/

import { CategoryQuery, DBTable, Error, Success } from "../../../../shared";
import { RemoveService } from "../../../../services";
import { isDefault, isFound } from "../../../../functions";
import { ModelResponse } from "../../../../types";

export const removeModel = async (Id: number = 0): Promise<ModelResponse> => {
  try {
    if (!Id || typeof Id !== 'number') return { data: false, message: Error.m014 }
    if ((await isDefault(Id, DBTable.t001)).data) return { data: false, message: Error.m017 }
    if((await isFound(CategoryQuery.q004,['CategoryId'], [Number], [Id])).data) return { data: false, message: Error.m017 }
    if (!(await RemoveService.byId(Id, DBTable.t001))) return { data: false, message: Error.m014 }
    return { data: true, message: Success.m003 }
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("CategoryTable-Model [removeModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: false, message: Error.m001 };
  }
};
