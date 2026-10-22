import { useContext } from "react";
import AuthContext from "@/context/AuthProvider";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const setAccessToken = (accessToken?: string) => {
    context.setAuth((prevAuth) => ({
        ...prevAuth,
        accessToken: accessToken,
    }));
  };
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return {...context,setAccessToken};
};
