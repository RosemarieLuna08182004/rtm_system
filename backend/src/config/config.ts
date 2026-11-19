import dotenv from "dotenv";
import { randomBytes } from "crypto";

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV;
export const TEST = process.env.NODE_ENV === "test";

export const DB_USER = process.env.DB_USER || "";
export const DB_PASSWORD = process.env.DB_PASSWORD || "";
export const DB_HOST = process.env.DB_HOST || "";
export const DB_URL = process.env.DB_URL || "";
export const DB_PORT = process.env.DB_PORT || 3306;
export const DB_NAME = process.env.DB_NAME || "";

export const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
// SERVER_PORT if set, otherwise PORT (which hosts such as Render provide)
export const SERVER_PORT = Number(process.env.SERVER_PORT || process.env.PORT || 12345);

export const server = {
  SERVER_HOSTNAME,
  SERVER_PORT,
};

export const SECRET_KEY =
  process.env.SECRET_KEY || randomBytes(32).toString("hex");
export const SECRET_REFRESH_KEY =
  process.env.SECRET_REFRESH_KEY || randomBytes(32).toString("hex");
/** How long one login token lasts before the app must refresh it */
export const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || "1d";
/** Refreshing stops this many days after the original login; then the user logs in again */
export const SESSION_MAX_DAYS = Number(process.env.SESSION_MAX_DAYS) || 30;
export const SESSION_SECRET: string =
  process.env.SESSION_SECRET || "rtm-morphology-sx2";

// GOOGLE API
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";

