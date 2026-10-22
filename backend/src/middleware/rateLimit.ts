import rateLimit from "express-rate-limit";
import { Error } from "../shared/messages";

const limitResponse = { data: false, message: Error.m037 };

// Login, password checks and token refresh: per client IP.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: limitResponse,
});

// Account creation: per client IP.
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: limitResponse,
});
