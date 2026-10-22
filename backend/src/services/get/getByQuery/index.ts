/**********************************************
 * AUTHOR       : Mark Dinglasa
 * COMMENT/S    : Service-getByQuery 
 * CHANGES      : N/A
 * LOG-DATE     : 2024-09-24 
 ***********************************************/

import { pool } from '../../../config'
export const getByQuery = async (Query: string = ''): Promise<Array<any>> => {
    try {
        if (typeof Query !== 'string' || !Query.trim()) 
            throw new Error('Query must be provided as a non-empty string');

        if (!pool) throw new Error('Connection failed');

        const [rows] = await pool.execute(Query) as unknown as [any]; 

        if (rows.length === 0) {
            throw new Error(`No record found`);
        }

        return rows; 

    } catch (error: any) {
        logging.log("----------------------------------------");
        logging.error("Get-Service [getByQuery]:", error.message);
        logging.log("----------------------------------------");
        throw error;
    }
}