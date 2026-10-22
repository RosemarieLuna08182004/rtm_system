import { isFound } from "../../../../functions";
import { GetService } from "../../../../services";
import { ChapterQuery, Error, Success } from "../../../../shared";

export const getModel = async (Id: number) => {
  try {
    if (!Id || typeof Id !== 'number') return { data: [], message: Error.m014 }
    const isExists = await isFound(ChapterQuery.q006,['Id'], [Number], [Id])
    if(!isExists.data) return { data: [], message: isExists.message }
    const response = await GetService.byFields(ChapterQuery.q0011, ['Id'], [Number], [Id])
    if (!response) return {data: [], message: Error.m011 }
    return { data: response[0], message: Success.m001 }
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("CategoryTable-Model [getModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: [], message: Error.m001 };
  }
};
