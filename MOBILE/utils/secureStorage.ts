import * as SecureStore from "expo-secure-store";

// Credentials (access/refresh tokens) live in the OS keychain/keystore, not AsyncStorage.
export const SecureKeys = {
  accessToken: "auth.accessToken",
  refreshToken: "auth.refreshToken",
} as const;

export const getSecureItem = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
};

export const setSecureItem = async (key: string, value?: string | null): Promise<void> => {
  try {
    if (value) await SecureStore.setItemAsync(key, value);
    else await SecureStore.deleteItemAsync(key);
  } catch {
    // Storage unavailable: the session simply won't survive an app restart.
  }
};

export const clearSecureAuth = async (): Promise<void> => {
  await Promise.all(Object.values(SecureKeys).map((key) => setSecureItem(key, null)));
};
