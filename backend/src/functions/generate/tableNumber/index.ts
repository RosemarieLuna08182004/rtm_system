import { GetService } from "../../../services";
import { DBTable, Error, Success } from "../../../shared";
import { ModelResponse } from "../../../types";

export const tableNumber = async (Table: DBTable = DBTable.t000): Promise<ModelResponse> => {
    try {
        if (!Object.values(DBTable).includes(Table) || typeof Table !== 'string' || !Table.trim()) return { data: null, message: Error.m006 }
        const response = await GetService.byQuery(`SELECT MAX(${Table}Number) AS Number FROM \`${Table}\``)
        const maxNumber = response && response[0].Number ? parseInt(response[0].Number, 10) : 0
        const tableNumber = String((isNaN(maxNumber) ? 0 : maxNumber) + 1).padStart(8, '0')
        return { data: tableNumber, message: Success.m001 }
    } catch (error: any) {
        logging.log("----------------------------------------");
        logging.error("Generate-Fn [tableNumber]:", error.message);
        logging.log("----------------------------------------");
        return { data: null, message: Error.m001 };
    }
}