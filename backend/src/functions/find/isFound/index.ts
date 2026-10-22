import { Error, Success } from "../../../shared";
import { GetService } from "../../../services";
import { ModelResponse } from "../../../types";
export const isFound = async (Query: string = '', Fields: Array<string> = [], Types:Array<any> = [], Datas: Array<any> = []): Promise<ModelResponse> => {
    try {
        if (!Query || typeof Query !== 'string' || !Query.trim()) return { data: false, message: Error.m010 };
        if (!Array.isArray(Fields) || Fields.length === 0 || Fields.some(field => typeof field !== 'string')) return { data: false, message: Error.m008 };

        if (!Types.every(field => field !== undefined)) {
            const undefinedIndex = Types.findIndex((field) => field === undefined);
            return { data: false, message: `Type for field'${undefinedIndex + 1}' is undefined` };
        }

        if (!Datas.every(data => data !== undefined)) {
            const undefinedIndex = Datas.findIndex((data) => data === undefined);
            return { data: false, message: `Data for field'${undefinedIndex + 1}' is undefined` };
        }

        if (Fields.length !== Datas.length || Fields.length !== Types.length) return { data: false, message: Error.m009 };
        const response:any = await GetService.byFields(Query, Fields, Types, Datas)

        if (!response || response.length < 1) return { data: false, message: Error.m011 };
        
        return { data: true, message: Success.m005 };

    } catch (error: any) {
        logging.log("----------------------------------------");
        logging.error("Find-Fn [isFound]:", error.message);
        logging.log("----------------------------------------");
        return { data: false, message: Error.m001 };
    }
}