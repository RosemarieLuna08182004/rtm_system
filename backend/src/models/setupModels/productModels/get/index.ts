import { isFound } from "../../../../functions";
import { GetService } from "../../../../services";
import { Error, ProductQuery, Success } from "../../../../shared";
import { ModelResponse } from "../../../../types";

export const getModel = async (Id: number = 0): Promise<ModelResponse> => {
  try {
    if (!Id || typeof Id !== 'number') return { data: [], message: Error.m014 }
    const isExists = await isFound(ProductQuery.q006,['Id'], [Number], [Id])
    if(!isExists.data) return { data: [], message: isExists.message }
    const response = await GetService.byFields(ProductQuery.q0010, ['Id'], [Number], [Id])
    if (!response) return {data: [], message: Error.m011 }
    return { data: response[0], message: Success.m001 }
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("ProductTable-Model [getModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: [], message: Error.m001 };
  }
};
