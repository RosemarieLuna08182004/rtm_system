import { createHmac, randomInt, randomBytes, timingSafeEqual } from "crypto";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../config";

// Password reset without a database table:
// - the app receives a short-lived signed `resetToken`; the user receives a 6-digit code by email;
// - the token stores only an HMAC of the code (useless without the server secret);
// - the token is bound to the current password hash, so it stops working once the
//   password changes (single use).
const RESET_SECRET = `${SECRET_KEY}:password-reset`;
export const RESET_TOKEN_TTL = "15m";

const hmac = (value: string) => createHmac("sha256", RESET_SECRET).update(value).digest("hex");
const codeDigest = (userId: number, code: string) => hmac(`code:${userId}:${code}`);
const passwordFingerprint = (passwordHash: string) => hmac(`pwd:${passwordHash}`).slice(0, 32);

const safeEqual = (a: string, b: string) => {
  const left = Buffer.from(a), right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
};

export const createResetChallenge = (userId: number, passwordHash: string) => {
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const token = jwt.sign(
    { UserId: userId, type: "reset", c: codeDigest(userId, code), f: passwordFingerprint(passwordHash) },
    RESET_SECRET,
    { expiresIn: RESET_TOKEN_TTL },
  );
  return { code, token };
};

// Same shape as a real challenge, for unknown emails, so responses don't reveal accounts.
export const createDecoyResetToken = () =>
  jwt.sign(
    { UserId: 0, type: "reset", c: randomBytes(32).toString("hex"), f: randomBytes(16).toString("hex") },
    RESET_SECRET,
    { expiresIn: RESET_TOKEN_TTL },
  );

// Returns the user Id the token was issued for, or 0 when the token is invalid/expired.
export const readResetToken = (token: string): { userId: number; c: string; f: string } | null => {
  try {
    const payload: any = jwt.verify(String(token), RESET_SECRET);
    if (payload?.type !== "reset" || !payload?.UserId) return null;
    return { userId: Number(payload.UserId), c: String(payload.c), f: String(payload.f) };
  } catch {
    return null;
  }
};

export const isResetCodeValid = (
  challenge: { userId: number; c: string; f: string },
  code: string,
  currentPasswordHash: string,
): boolean =>
  safeEqual(challenge.c, codeDigest(challenge.userId, String(code).trim())) &&
  safeEqual(challenge.f, passwordFingerprint(currentPasswordHash));
