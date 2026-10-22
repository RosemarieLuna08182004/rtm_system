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
export const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 12345;

export const server = {
  SERVER_HOSTNAME,
  SERVER_PORT,
};

// Secrets must come from the environment. A random fallback is only allowed in
// tests; elsewhere a missing secret stops start-up instead of silently using a
// known or per-restart value.
const requireSecret = (name: string): string => {
  const value = process.env[name];
  if (value) return value;
  if (TEST) return randomBytes(32).toString("hex");
  throw new Error(`${name} is required. Set it in the environment.`);
};

export const SECRET_KEY = requireSecret("SECRET_KEY");
export const SECRET_REFRESH_KEY = requireSecret("SECRET_REFRESH_KEY");
// Access tokens should be short-lived (e.g. "30m") once every app build refreshes
// correctly; the default stays long so older installed builds are not logged out.
export const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || "30d";
export const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || "60d";

// EMAIL (SMTP) — used for password reset codes. Any SMTP provider works.
export const SMTP_HOST = process.env.SMTP_HOST || "";
export const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
export const SMTP_USER = process.env.SMTP_USER || "";
export const SMTP_PASS = process.env.SMTP_PASS || "";
export const MAIL_FROM = process.env.MAIL_FROM || SMTP_USER;

// STRIPE API

export const PUBLISHABLE_KEY = process.env.PUBLISHABLE_KEY || "";
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
