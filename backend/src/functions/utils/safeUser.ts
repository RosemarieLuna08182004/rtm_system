// Columns that must never leave the server.
const PRIVATE_USER_FIELDS = ["Password", "AccessToken", "RefreshToken"];

export const toSafeUser = <T extends Record<string, any>>(user: T): Partial<T> => {
  if (!user || typeof user !== "object") return user;
  const safe: Record<string, any> = { ...user };
  PRIVATE_USER_FIELDS.forEach((field) => delete safe[field]);
  return safe as Partial<T>;
};

export const toSafeUsers = <T extends Record<string, any>>(users: T[]): Partial<T>[] =>
  Array.isArray(users) ? users.map(toSafeUser) : users;

// Accounts created through Google sign-in were given this fixed password, so it must
// never be accepted by the email/password login.
export const GOOGLE_PLACEHOLDER_PASSWORD = "GoogleAuthenticatedOnly";
