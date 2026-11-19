import { Request, Response, NextFunction } from "express";
import { Error } from "../shared/messages";

/**
 * Slows password guessing on /auth/login and /auth/verify-password.
 * A failure is a 401 response. Limits per 15 minutes:
 * - 5 failures for the same email from the same network address
 * - 50 failures from one network address across all emails
 * Keyed by email + address (not email alone) so nobody can lock someone else out
 * just by typing their email wrong. A successful login clears that email's count.
 * Counts live in memory: they reset on restart, which is fine for one server.
 */
export const LOGIN_WINDOW_MS = 15 * 60 * 1000;
export const MAX_FAILURES_PER_EMAIL = 5;
export const MAX_FAILURES_PER_ADDRESS = 50;

const failures = new Map<string, number[]>();

const recent = (key: string, now: number) => {
  const times = (failures.get(key) ?? []).filter((t) => now - t < LOGIN_WINDOW_MS);
  if (times.length) failures.set(key, times);
  else failures.delete(key);
  return times;
};

/** For tests */
export const resetLoginLimiter = () => failures.clear();

export const loginLimiter = (req: Request, res: Response, next: NextFunction): any => {
  const now = Date.now();
  const address = req.ip || req.socket?.remoteAddress || "unknown";
  // The account being tried: the email for login, or the logged-in user for password changes
  const loggedInId = (req as Request & { User?: { Id?: number | string } }).User?.Id;
  const email = String(req.body?.Email ?? (loggedInId ? `user#${loggedInId}` : "")).trim().toLowerCase();
  const emailKey = `${address}|${email}`;
  const addressKey = address;

  const emailFailures = recent(emailKey, now);
  const addressFailures = recent(addressKey, now);
  const blocked = emailFailures.length >= MAX_FAILURES_PER_EMAIL ? emailFailures
    : addressFailures.length >= MAX_FAILURES_PER_ADDRESS ? addressFailures : null;
  if (blocked) {
    const retryAfter = Math.ceil((blocked[0] + LOGIN_WINDOW_MS - now) / 1000);
    res.setHeader("Retry-After", String(retryAfter));
    return res.status(429).json({ data: false, message: `${Error.m037} (about ${Math.ceil(retryAfter / 60)} min)` });
  }

  res.on("finish", () => {
    if (res.statusCode === 401) {
      const at = Date.now();
      failures.set(emailKey, [...recent(emailKey, at), at]);
      failures.set(addressKey, [...recent(addressKey, at), at]);
    } else if (res.statusCode < 400) {
      failures.delete(emailKey);
    }
  });
  next();
};

// Drop expired entries now and then so memory can't grow without bound
setInterval(() => {
  const now = Date.now();
  [...failures.keys()].forEach((key) => recent(key, now));
}, LOGIN_WINDOW_MS).unref();
