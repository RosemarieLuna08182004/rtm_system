import { jwtDecode } from "jwt-decode";

// Treats tokens that cannot be decoded as expired
// instead of throwing.
export const isTokenExpired = (token?: string | null, skewSeconds: number = 30): boolean => {
  if (!token) return true;
  try {
    const decoded: { exp?: number } = jwtDecode(token);
    if (!decoded?.exp) return false;
    return decoded.exp < Date.now() / 1000 + skewSeconds;
  } catch {
    return true;
  }
};
