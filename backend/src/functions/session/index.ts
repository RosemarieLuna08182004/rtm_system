import { verify } from "jsonwebtoken";
import { SECRET_KEY, SECRET_REFRESH_KEY, SESSION_MAX_DAYS } from "../../config";

export interface SessionClaims {
  UserId: number;
  /** Original login time, seconds since epoch */
  LoginAt: number;
}

export type SessionResult = { claims: SessionClaims; reason?: undefined } | { claims?: undefined; reason: "invalid" | "expired" };

const toClaims = (UserId: unknown, LoginAt: unknown, iat: unknown): SessionClaims | null => {
  const id = Number(UserId);
  // Tokens issued before LoginAt existed fall back to their issue time
  const loginAt = Number(LoginAt ?? iat);
  return id && loginAt ? { UserId: id, LoginAt: loginAt } : null;
};

/**
 * Who may refresh their login. Accepts a refresh token (web admin), or the app's
 * expired access token (published mobile app, which doesn't send a refresh token).
 * Either way the signature must be valid and the original login must be within
 * SESSION_MAX_DAYS, so a session can't be renewed forever.
 */
export const readSession = (refreshToken?: string, accessToken?: string, nowSeconds: number = Date.now() / 1000): SessionResult => {
  let claims: SessionClaims | null = null;

  if (refreshToken) {
    try {
      const payload = verify(refreshToken, SECRET_REFRESH_KEY) as Record<string, unknown>;
      claims = toClaims(payload.UserId, payload.LoginAt, payload.iat);
    } catch { /* fall through to the access token */ }
  }
  if (!claims && accessToken) {
    try {
      const payload = verify(accessToken, SECRET_KEY, { ignoreExpiration: true }) as Record<string, unknown>;
      claims = toClaims(payload.Id, payload.LoginAt, payload.iat);
    } catch { /* invalid signature */ }
  }

  if (!claims) return { reason: "invalid" };
  if (nowSeconds - claims.LoginAt > SESSION_MAX_DAYS * 24 * 60 * 60) return { reason: "expired" };
  return { claims };
};
