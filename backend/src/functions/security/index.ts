/** Fields that must never leave the server. */
const SECRET_USER_FIELDS = ["Password", "AccessToken", "RefreshToken"];

/** A user record without its password hash or stored tokens, safe to send to a client. */
export const withoutSecrets = <T>(user: T): T => {
  if (!user || typeof user !== "object") return user;
  const safe: Record<string, unknown> = { ...(user as Record<string, unknown>) };
  SECRET_USER_FIELDS.forEach((field) => delete safe[field]);
  return safe as T;
};
