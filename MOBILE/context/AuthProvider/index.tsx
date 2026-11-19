import { createContext, useState, useEffect, ReactNode } from "react";
import { AuthContextType, AuthType, Roles, SFC } from "@/types";
import {jwtDecode} from "jwt-decode"; 
import React from "react";
import { AuthChannel } from "@/constants";
import { getItem, setItem } from "@/utils";
import { authInitial } from "@/shared";

const AuthContext = createContext<AuthContextType | undefined>(undefined);
interface ProviderProps {
  children:ReactNode
}
export const isTokenExpired = (token: string): boolean => {
  const decoded: { exp: number } = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

export const AuthProvider: SFC<ProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthType>(authInitial);
  const [persist, setPersist] = useState<boolean>(true);

  useEffect(() => {
    const loadPersistState = async () => {
      try {
        const storedPersist = await getItem(AuthChannel.persist);
        if (storedPersist !== null) {
          const persistValue = JSON.parse(storedPersist);
          
          // Always default to true for better user experience
          // Users shouldn't lose their login state unless they explicitly sign out
          if (persistValue === false) {
            await setItem(AuthChannel.persist, JSON.stringify(true));
            setPersist(true);
          } else {
            setPersist(persistValue);
          }
        } else {
          // If no persist value is stored, initialize it to true
          await setItem(AuthChannel.persist, JSON.stringify(true));
          setPersist(true);
        }
      } catch (error) {
        console.error('Error reading persist state:', error);
        // Default to true on error
        setPersist(true);
      }
    };

    loadPersistState();
  }, []);

  useEffect(() => {
    const loadStoredAuthData = async () => {
      try {
        const storedAuth = await getItem(AuthChannel.auth);
        
        if (!storedAuth) {
          return;
        }

        try {
          const parsedAuth = JSON.parse(storedAuth);
          
          // Validate the parsed auth object structure
          if (!parsedAuth || typeof parsedAuth !== 'object') {
            await setItem(AuthChannel.auth, JSON.stringify(authInitial));
            return;
          }

          // If we have a token and it's not expired, use it
          if (parsedAuth.accessToken) {
            if (!isTokenExpired(parsedAuth.accessToken)) {
              setAuth(parsedAuth);
            } else {
              setAuth(authInitial);
              await setItem(AuthChannel.auth, JSON.stringify(authInitial));
            }
          } else {
            setAuth(authInitial);
          }
        } catch (parseError) {
          console.error('Error parsing stored auth data:', parseError);
          // If we can't parse the stored data, reset it
          await setItem(AuthChannel.auth, JSON.stringify(authInitial));
          setAuth(authInitial);
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
        // On any error, reset to initial state
        await setItem(AuthChannel.auth, JSON.stringify(authInitial));
        setAuth(authInitial);
      }
    };

    if (persist) {
      loadStoredAuthData();
    }
  }, [persist]);

  useEffect(() => {
    const saveAuthData = async () => {
      try {
        if (persist && auth) {
          // If we have a valid auth object and persistence is enabled, save it
          await setItem(AuthChannel.auth, JSON.stringify(auth));
        } else if (!persist) {
          // If persistence is disabled, clear the stored auth data
          await setItem(AuthChannel.auth, JSON.stringify(authInitial));
        } else if (!auth) {
          // If auth is null, ensure we store the initial state
          await setItem(AuthChannel.auth, JSON.stringify(authInitial));
        }
      } catch (error) {
        console.error('Error saving auth data:', error);
      }
    };

    // Only run this effect when persist or auth changes
    // We don't need to run it on mount because loadStoredAuthData handles that
    if (auth !== undefined) {
      saveAuthData();
    }
  }, [auth, persist]);

  useEffect(() => {
    const savePersistPreference = async () => {
      try {
        await setItem(AuthChannel.persist, JSON.stringify(persist));
        // We don't clear auth data here anymore - it's handled in the saveAuthData effect
      } catch (error) {
        console.error('Error saving persist preference:', error);
      }
    };

    // Only run this effect when persist changes
    savePersistPreference();
  }, [persist]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
