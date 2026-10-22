import { ResultSetHeader } from 'mysql2/promise';
import { pool } from '../../../config';
import { DBTable } from '../../../shared';

export const updateByCondition = async (Table: DBTable = DBTable.t000, Fields: Array<string> = [], Types: Array<any> = [], Datas: Array<any> = [], Condition: string = '', ConditionValues: Array<any> = []): Promise<boolean> => {
  try {
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

      if (!Condition || typeof Condition !== 'string' || !Condition.trim()) {
        throw new Error('A valid condition must be provided for the WHERE clause');
      }

      if (!Array.isArray(ConditionValues) || ConditionValues.length === 0) {
        throw new Error('ConditionValues must be a non-empty array');
			}

      if (!pool) throw new Error('Connection failed');

      const setFields = Fields.map((field) => `${field} = ?`).join(', ');
      const sqlQuery = `UPDATE \`${Table}\` SET ${setFields} WHERE ${Condition}`;

      const values = [...Datas, ...ConditionValues];

      const [result] = await pool.execute<ResultSetHeader>(sqlQuery, values);
      if (result.affectedRows <= 0) throw new Error('No records were updated');

      return true;

  } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("Update-Service [updateByCondition]:", error.message);
      logging.log("----------------------------------------");
      throw error;
  }
};