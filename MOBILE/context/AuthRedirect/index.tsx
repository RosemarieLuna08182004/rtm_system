import { RoutesChannel } from "@/constants";
import React from "react"
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "expo-router";
import { useEffect } from "react";

const AuthRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth?.accessToken) {
      router.replace(RoutesChannel.HOME);
      return
    }
  }, [auth?.accessToken]);

  return <>{children}</>;
};

export default AuthRedirect;
