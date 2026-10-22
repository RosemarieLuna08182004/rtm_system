import { readFileSync } from "fs";
import { createPool } from "mysql2/promise";
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, NODE_ENV } from "..";

let sslConfig = undefined;

if (NODE_ENV === "production") {
  try {
    sslConfig = {
      ca: readFileSync("./ca.pem"),
    };
  } catch (error: any) {
    logging.log('---------------------------------------------')
    logging.error("Failed to load SSL certificate", error.message);
    logging.log('---------------------------------------------')
  }
}

export const poolConfig = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT ? Number(DB_PORT) : 3306,
  ssl: sslConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

export const pool = createPool(poolConfig);

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    logging.log("----------------------------------------");
    logging.log("Connected to MySQL Database");
    logging.log("----------------------------------------");
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("Connection error:", error.message);
    logging.error("Unable to connect to MySQL Database");
    logging.log("----------------------------------------");
  }
};

export const closePool = async () => {
  try {
    await pool.end();
    logging.log("----------------------------------------");
    logging.log("MySQL Connection is now closed");
    logging.log("----------------------------------------");
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("Closing error:", error.message);
    logging.error("Unable to close to MySQL Connection");
    logging.log("----------------------------------------");
  }
};