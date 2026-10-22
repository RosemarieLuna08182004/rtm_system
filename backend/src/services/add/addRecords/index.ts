// add multiple records using transaction

import { ResultSetHeader } from "mysql2";
import { pool } from "../../../config";

export const addRecords = async (Table: string = "", Fields: Array<string> = [], Datas: Array<Array<any>> = []) => {
  try {
    if (!Table || typeof Table !== "string")
      throw new Error("Table name must be provided as a non-empty string");

    if (Fields.length === 0 || Datas.length === 0)
      throw new Error("Fields array must not be empty and at least one record must be provided");

    const placeholders = Fields.map(() => "?").join(", ");
    const valuePlaceholders = Datas.map(() => `(${placeholders})`).join(", ");
    const query = `INSERT INTO ${Table} (${Fields.join(", ")}) VALUES ${valuePlaceholders}`;

    const flatData = Datas.flat();

    const [result] = await pool.execute<ResultSetHeader>(query, flatData);
    return result.affectedRows;
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("Add-Service [addRecords]:", error.message);
    logging.log("----------------------------------------");
    throw error;
  }
};
