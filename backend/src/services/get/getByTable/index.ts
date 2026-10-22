/**********************************************
 * AUTHOR       : Mark Dinglasa
 * COMMENT/S    : Service-getByQuery 
 * CHANGES      : N/A
 * LOG-DATE     : 2024-09-24 
 ***********************************************/

import { pool } from '../../../config'
import { DBTable } from '../../../shared';
export const getByTable = async (Table: DBTable = DBTable.t000): Promise<Array<any>> => {
    try {
        if (!Object.values(DBTable).includes(Table) || typeof Table !== 'string' || !Table.trim())
            throw new Error('Table must be provided as a valid non-empty string');

        if (!pool) throw new Error('Connection failed');

        const [rows] = await pool.execute(`SELECT * FROM ${Table}`) as unknown as [any]; 

        if (rows.length === 0) {
            throw new Error(`No record found`);
        }

        return rows; 

    } catch (error: any) {
        logging.log("----------------------------------------");
        logging.error("Get-Service [getByTable]:", error.message);
        logging.log("----------------------------------------");
        throw error;
    }
}