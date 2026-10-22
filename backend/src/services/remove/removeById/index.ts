/**********************************************
 * AUTHOR       : 
 * COMMENT/S    : Service-removeById 
 * CHANGES      : N/A
 * LOG-DATE     : 2024-09-24 
 ***********************************************/

import { ResultSetHeader } from 'mysql2/promise';
import { pool } from '../../../config';
import { DBTable } from '../../../shared';

export const removeById = async (Id: number = 0, Table: DBTable = DBTable.t000): Promise<boolean> => {
    try {
        if (!Id || typeof Id !== 'number' || isNaN(Id)) 
            throw new Error('Id must be a valid number');

        if (!Object.values(DBTable).includes(Table) || typeof Table !== 'string' || !Table.trim())
            throw new Error('Table must be provided as a valid non-empty string');
        
        if (!pool) throw new Error('Connection failed');

        const sqlQuery = `DELETE FROM \`${Table}\` WHERE Id = ? LIMIT 1`;
        const [result] = await pool.execute<ResultSetHeader>(sqlQuery, [Id]);

        if (result.affectedRows <= 0) throw new Error('No records were deleted');

        return true; 
    } catch (error: any) {
        logging.log("----------------------------------------");
        logging.error("Remove-Service [removeById]:", error.message);
        logging.log("----------------------------------------");
        throw error;
    }
};
