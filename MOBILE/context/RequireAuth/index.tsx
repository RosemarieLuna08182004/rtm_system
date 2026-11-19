import { RoutesChannel } from "@/constants";
import { useAuth } from "../../hooks/useAuth";
import React, { useState, useEffect } from "react";
import { RequireAuthProps, SFC } from '@/types';
import { useRouter } from "expo-router";
import { ActivityIndicator } from "react-native";
import * as S from '@/styles';

export const RequireAuth: SFC<RequireAuthProps> = ({ children }) => {
  const { auth } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add a small delay to prevent premature redirects during auth state initialization
    const timeoutId = setTimeout(() => {
      // Check if we have an access token
      if (!auth?.accessToken) {
        router.replace(RoutesChannel.SIGN_IN);
      } else {
        setIsLoading(false);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [auth?.accessToken, router]);

  if (isLoading) {
    return (
      <S.View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={S.colors.primary} />
      </S.View>
    );
  }

  // If we have an access token, render children
  if (auth?.accessToken) {
    return <>{children}</>;
  }

  // Fallback to loading state
  return (
    <S.View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color={S.colors.primary} />
    </S.View>
  );
};
