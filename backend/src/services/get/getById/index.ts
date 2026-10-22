/**********************************************
 * AUTHOR       : Mark Dinglasa
 * COMMENT/S    : Service-getById 
 * CHANGES      : N/A
 * LOG-DATE     : 2024-09-24 
 ***********************************************/

import { pool } from '../../../config'
import { DBTable } from '../../../shared';
export const getById = async (Id: number = 0, Table: DBTable = DBTable.t000): Promise<Array<any>> => {
    try {
        if (!Id || typeof Id !== 'number' || isNaN(Id)) 
            throw new Error('Id must be a valid number');

        if (!Object.values(DBTable).includes(Table) || typeof Table !== 'string' || !Table.trim())
            throw new Error('Table must be provided as a valid non-empty string');

        if (!pool) throw new Error('Connection failed');

        const sqlQuery = `SELECT * FROM \`${Table}\` WHERE Id = ?`;
        const [rows] = await pool.execute(sqlQuery, [Id]) as [any, any]; 

        if (rows.length === 0) {
            throw new Error(`No record found with Id ${Id} in table ${Table}`);
        }

        return rows; 

    } catch (error: any) {
        logging.log("----------------------------------------");
        logging.error("Get-Service [getById]:", error.message);
        logging.log("----------------------------------------");
        throw error;
    }
};
