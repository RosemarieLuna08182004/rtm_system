import { ReactNode } from "react";
import { Roles } from "./roles";

export interface AuthType {
  user: any; 
  roles: Array<Roles>;
  accessToken: string;
  refreshToken: string;
  googleProvider?: string;
}

export interface AuthContextType {
  auth: AuthType;
  setAuth: React.Dispatch<React.SetStateAction<AuthType>>;
  persist: boolean;
  setPersist: React.Dispatch<React.SetStateAction<boolean>>;
  clearAuth?: any
}
export interface RequireAuthProps {
  children: ReactNode;
}