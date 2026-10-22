/**********************************************
 * AUTHOR       : Mark Dinglasa
 * COMMENT/S    : Service-getByIdAndQuery 
 * CHANGES      : N/A
 * LOG-DATE     : 2024-09-24 
 ***********************************************/

import { pool } from '../../../config'
export const getByIdAndQuery = async (Id: number = 0, Query: string = ''): Promise<Array<any>> => {
    try {
        if (!Id || typeof Id !== 'number' || isNaN(Id)) 
            throw new Error('Id must be a valid number');

        if (typeof Query !== 'string' || !Query.trim()) 
            throw new Error('Query must be provided as a non-empty string');

        if (!pool) throw new Error('Connection failed');

        const [rows] = await pool.execute(Query, Id) as [any, any]; 

        if (rows.length === 0) {
            throw new Error(`No record found with Id ${Id}`);
        }

        return rows; 

    } catch (error: any) {
        logging.log("----------------------------------------");
        logging.error("Get-Service [getByIdAndQuery]:", error.message);
        logging.log("----------------------------------------");
        throw error;
    }
}