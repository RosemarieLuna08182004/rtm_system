/**********************************************
 * AUTHOR       : Mark Dinglasa
 * COMMENT/S    : Model-getAllModel 
 * CHANGES      : N/A
 * LOG-DATE     : 2024-09-25
 ***********************************************/

import { GetService } from "../../../../services";
import { CategoryQuery, Error, Success } from "../../../../shared";
import { ModelResponse } from "../../../../types";

export const getAllModel = async (): Promise<ModelResponse> => {
  try {
    const response = await GetService.byQuery(CategoryQuery.q002)
    if (!response) return { data: [], message: Error.m011 }
    return { data: response, message: Success.m001 }
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("CategoryTable-Model [getAllModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: [], message: Error.m001 };
  }
};
