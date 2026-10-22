/**********************************************
 * AUTHOR       : 
 * COMMENT/S    : Service-removeByFields 
 * CHANGES      : N/A
 * LOG-DATE     : 2024-09-24 
 ***********************************************/
import { ResultSetHeader } from 'mysql2/promise';
import { pool } from '../../../config';

export const removeByFields = async (Query: string = '', Fields: Array<string> = [], Types: Array<any> = [], Datas: Array<any> =[]): Promise<boolean> => {
    try {
        if (typeof Query !== 'string' || !Query.trim()) 
            throw new Error('Query must be provided as a non-empty string');

        if (!Array.isArray(Fields) || Fields.length === 0 || Fields.some(field => typeof field !== 'string')) 
            throw new Error('Fields must be a non-empty array of strings');
        
        if (!Array.isArray(Types) || !Types.every(field => field !== undefined)) {
            const undefinedIndex2 = Types.findIndex((field) => field === undefined);
            throw new Error(`Type for field'${undefinedIndex2 + 1}' is undefined`);
        }

        if (!Array.isArray(Datas) || !Datas.every(data => data !== undefined)) {
            const undefinedIndex3 = Datas.findIndex((data) => data === undefined);
            throw new Error(`Data for field'${undefinedIndex3 + 1}' is undefined`);
        }

        if (Fields.length !== Datas.length || Fields.length !== Types.length) 
            throw new Error('Parameters are empty, or their lengths do not match');

        if (!pool) throw new Error('Connection failed');

        const whereClause = Fields.map((field) => `${field} = ?`).join(' AND ');

        const fullQuery = `${Query} WHERE ${whereClause}`;
        const values = [...Datas];
        
        const [result] = await pool.execute<ResultSetHeader>(fullQuery, values);

        if (result.affectedRows <= 0) throw new Error('No records were deleted');

        return true; 
    } catch (error: any) {
        logging.log("----------------------------------------");
        logging.error("Remove-Service [removeByFields]:", error.message);
        logging.log("----------------------------------------");
        throw error;
    }
};
