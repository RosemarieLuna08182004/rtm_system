/**********************************************
 * AUTHOR       : Mark Dinglasa
 * COMMENT/S    : Fn-isDefault 
 * CHANGES      : N/A
 * LOG-DATE     : 2024-09-24 
 ***********************************************/

import { Error, Success, defaultRecord } from "../../../shared";
import { ModelResponse } from "../../../types";
export const isDefault = async (Id: number = 0, Table: string = ''): Promise<ModelResponse> => {
    try {
        if (!Id || typeof Id !== 'number' || isNaN(Id)) 
            return { data: false, message: Error.m005 };

        if (!Table || typeof Table !== 'string') 
            return { data: false, message: Error.m006 };

        if (defaultRecord.hasOwnProperty(Table)) {
            const tableKey = Table as keyof typeof defaultRecord;
            if (defaultRecord[tableKey].includes(Id)) 
                return { data: true, message: Success.m005 };
        }

        return { data: false, message: Error.m007 };

    } catch (error: any) {
        logging.log("----------------------------------------");
        logging.error("Find-Fn [isDefault]:", error.message);
        logging.log("----------------------------------------");
        return { data: false, message: Error.m001 };
    }
};

