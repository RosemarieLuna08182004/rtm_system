import { isDefault, isFound } from "../../../../functions";
import { RemoveService } from "../../../../services";
import { ChapterQuery, DBTable, Error, Success } from "../../../../shared";

export const removeModel = async (Id: number = 0) => {
  try {
    if (!Id || typeof Id !== 'number') return { data: false, message: Error.m014 }
    if ((await isDefault(Id, DBTable.t002)).data) return { data: false, message: Error.m017 }
    if((await isFound(ChapterQuery.q007,['ChapterId'], [Number], [Id])).data) return { data: false, message: Error.m020 }
    const response = await RemoveService.byId(Id, DBTable.t002);
    if (!response) return { data: false, message: Error.m014 }
    return { data: true, message: Success.m003 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("ChapterTable-Model [removeModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: false, message: Error.m001 };
  }
};
