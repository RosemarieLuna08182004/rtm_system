import { createContext, useState, useEffect, useRef, ReactNode } from "react";
import { AuthContextType, AuthType, SFC } from "@/types";
import React from "react";
import { AuthChannel } from "@/constants";
import {
  configureSession,
  getItem,
  getSecureItem,
  isTokenExpired,
  removeItem,
  SecureKeys,
  setItem,
  setSecureItem,
} from "@/utils";
import { authInitial } from "@/shared";

export { isTokenExpired } from "@/utils/token";

const AuthContext = createContext<AuthContextType | undefined>(undefined);
interface ProviderProps {
  children:ReactNode
}

// Fields that must never be kept on the device (older servers returned them).
const stripPrivateUserFields = (user: any) => {
  if (!user || typeof user !== "object") return user ?? null;
  const { Password, AccessToken, RefreshToken, ...safe } = user;
  return safe;
};

// Reads the saved session: tokens from secure storage, profile data from AsyncStorage.
// Sessions saved by older builds (tokens inside AsyncStorage) are migrated once.
const loadStoredAuth = async (): Promise<AuthType> => {
  let meta: any = {};
  try {
    const stored = await getItem(AuthChannel.auth);
    meta = stored ? JSON.parse(stored) ?? {} : {};
  } catch {
    meta = {};
  }

  let accessToken = await getSecureItem(SecureKeys.accessToken);
  let refreshToken = await getSecureItem(SecureKeys.refreshToken);
  if (!accessToken && meta.accessToken) {
    accessToken = meta.accessToken;
    refreshToken = meta.refreshToken || refreshToken;
    await setSecureItem(SecureKeys.accessToken, accessToken);
    await setSecureItem(SecureKeys.refreshToken, refreshToken);
  }

  const auth: AuthType = {
    user: stripPrivateUserFields(meta.user),
    roles: meta.roles ?? [],
    accessToken: accessToken ?? "",
    refreshToken: refreshToken ?? "",
  };

  // An expired access token is fine while a refresh token exists; the API client renews it.
  const usable =
    !!auth.accessToken &&
    // Sessions from the removed Google sign-in are discarded.
    meta.googleProvider !== "google" &&
    (!isTokenExpired(auth.accessToken) || !!auth.refreshToken);
  return usable ? auth : authInitial;
};

const saveAuth = async (auth: AuthType) => {
  await setSecureItem(SecureKeys.accessToken, auth?.accessToken);
  await setSecureItem(SecureKeys.refreshToken, auth?.refreshToken);
  if (!auth?.accessToken) {
    await removeItem(AuthChannel.auth);
    return;
  }
  await setItem(
    AuthChannel.auth,
    JSON.stringify({
      user: stripPrivateUserFields(auth.user),
      roles: auth.roles,
    }),
  );
};

export const AuthProvider: SFC<ProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthType>(authInitial);
  const [persist, setPersist] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);
  const authRef = useRef<AuthType>(auth);
  authRef.current = auth;

  // Load first; saving only starts once loading is finished, so the empty initial
  // state can never overwrite a saved session.
  useEffect(() => {
    let active = true;
    loadStoredAuth()
      .then((stored) => { if (active) setAuth(stored); })
      .catch((error) => console.error("Error loading auth data:", error))
      .finally(() => { if (active) setInitialized(true); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!initialized) return;
    saveAuth(persist ? auth : authInitial).catch((error) =>
      console.error("Error saving auth data:", error),
    );
  }, [auth, persist, initialized]);

  // Let the shared API client read and update the session.
  useEffect(() => {
    configureSession({
      getSession: () => ({
        accessToken: authRef.current?.accessToken,
        refreshToken: authRef.current?.refreshToken,
      }),
      onTokens: ({ accessToken, refreshToken }) => {
        // Update the ref immediately so queued requests use the new token.
        authRef.current = { ...authRef.current, accessToken, refreshToken: refreshToken ?? authRef.current.refreshToken };
        setAuth((prev) => ({ ...prev, accessToken, refreshToken: refreshToken ?? prev.refreshToken }));
      },
      onSessionExpired: () => {
        authRef.current = authInitial;
        setAuth(authInitial);
      },
    });
    return () => configureSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist, initialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
