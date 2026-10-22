/**********************************************
 * AUTHOR       : Mark Dinglasa
 * COMMENT/S    : Service-updateRecord 
 * CHANGES      : N/A
 * LOG-DATE     : 2024-09-24 
 ***********************************************/

import { ResultSetHeader } from 'mysql2/promise';
import { pool } from '../../../config';
import { DBTable } from '../../../shared';

export const updateRecord = async (Id: number = 0, Table: DBTable = DBTable.t000, Fields: Array<string> = [], Types: Array<any> = [], Datas: Array<any> = []): Promise<boolean> => {
    try {
        if (!Id || typeof Id !== 'number' || isNaN(Id)) 
            throw new Error('Id must be a valid number');

        if (!Object.values(DBTable).includes(Table) || typeof Table !== 'string' || !Table.trim())
            throw new Error('Table must be provided as a valid non-empty string');
        
        if (!Array.isArray(Fields) || Fields.length === 0 || Fields.some(field => typeof field !== 'string')) 
            throw new Error('Field must be a non-empty array of strings');

        if (!Types.every(field => field !== undefined)) {
            const undefinedIndex = Types.findIndex((field) => field === undefined);
            throw new Error(`Type for field'${undefinedIndex + 1}' is undefined`);
        }

        if (!Datas.every(data => data !== undefined)) {
            const undefinedIndex = Datas.findIndex((data) => data === undefined);
            throw new Error(`Data for field'${undefinedIndex + 1}' is undefined`);
        }

        if (Fields.length !== Datas.length || Fields.length !== Types.length) 
            throw new Error('Parameters are empty, or their lengths do not match');

        if (!pool) throw new Error('Connection failed');

        const setFields = Fields.map((field) => `${field} = ?`).join(', ');
        const sqlQuery = `UPDATE \`${Table}\` SET ${setFields} WHERE Id = ? LIMIT 1`;

        const values = [...Datas, Id];

        const [result] = await pool.execute<ResultSetHeader>(sqlQuery, values);
        if (result.affectedRows <= 0) throw new Error('No records were updated');

        return true;

    } catch (error: any) {
        logging.log("----------------------------------------");
        logging.error("Update-Service [updateRecord]:", error.message);
        logging.log("----------------------------------------");
        throw error;
    }
};
