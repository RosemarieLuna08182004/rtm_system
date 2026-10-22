import { isFound } from "../../../../functions";
import { GetService } from "../../../../services";
import { Error, Success, TermQuery } from "../../../../shared";
import { ModelResponse } from "../../../../types";

export const getModel = async (Id: number): Promise<ModelResponse> => {
  try {
    if (!Id || typeof Id !== 'number') return { data: [], message: Error.m014 }
    const isExists = await isFound(TermQuery.q006,['Id'], [Number], [Id])
    if (!isExists.data) return { data: [], message: isExists.message }
    const response = await GetService.byFields(TermQuery.q0011, ['Id'], [Number], [Id])
    if (!response) return {data: [], message: Error.m011 }
    return { data: response[0], message: Success.m001 }
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("TermTable-Model [getModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: [], message: Error.m001 };
  }
};
