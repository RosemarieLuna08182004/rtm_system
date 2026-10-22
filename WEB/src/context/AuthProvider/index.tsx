import { createContext, useState, useEffect, ReactNode } from "react";
import { Roles } from "../../types";
import { jwtDecode } from "jwt-decode";

export interface AuthState {
  user?: any;
  roles?: Roles;
  accessToken?: string;
  refreshToken?: string;
}

type SetAuthAction = AuthState | ((prevState: AuthState) => AuthState);

interface AuthContextType {
  auth: AuthState;
  setAuth: (auth: SetAuthAction) => void;
  persist: boolean;
  setPersist: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export  const isTokenExpired = (token: string): boolean => {
  const decoded: { exp: number } = jwtDecode(token);
  const currentTime = Date.now() / 1000;  
  return decoded.exp < currentTime;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
 
  const [auth, setAuth] = useState<AuthContextType['auth']>(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : {};
  });
  const [persist, setPersist] = useState<boolean>(() => {
    const storedPersist = localStorage.getItem("persist");
    return storedPersist ? JSON.parse(storedPersist) : false;
  });

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist));
  }, [persist]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
