import { RoutesChannel } from "@/constants";
import { useAuth } from "../../hooks/useAuth";
import React, { useEffect } from "react";
import { RequireAuthProps, SFC } from '@/types';
import { useRouter } from "expo-router";
import { ActivityIndicator } from "react-native";
import * as S from '@/styles';

export const RequireAuth: SFC<RequireAuthProps> = ({ children }) => {
  const { auth, initialized } = useAuth();
  const router = useRouter();

  // Decide only after the saved session has been read, so a restart never bounces
  // a signed-in user to the sign-in screen.
  useEffect(() => {
    if (initialized && !auth?.accessToken) router.replace(RoutesChannel.SIGN_IN);
  }, [initialized, auth?.accessToken, router]);

  if (initialized && auth?.accessToken) return <>{children}</>;

  return (
    // Matches the app background in both themes, so there is no white flash at night.
    <S.View className="flex-1 justify-center items-center bg-slate-50 dark:bg-slate-950">
      <ActivityIndicator size="large" color={S.colors.primary} />
    </S.View>
  );
};
