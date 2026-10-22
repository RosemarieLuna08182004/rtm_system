import React from 'react';
import * as S from '@/styles';
import { useSignOut } from '@/hooks';
import { useRouter } from 'expo-router';
import { CogIcon, LogoutIcon, RoutesChannel, VisibilityIcon } from '@/constants';
import { NavigationButton } from '@/components/Buttons';

export const ProfileButtonList = () => {
  const router = useRouter();
  const { signOut } = useSignOut();

  return (
    <>
    <S.View>
      {/* Easy to reach for people who need larger text or dark mode. */}
      <NavigationButton
        icon={VisibilityIcon}
        tintColor={S.colors.primary}
        title="Display & comfort"
        onPress={() => router.push(RoutesChannel.DISPLAY_SETTINGS)}
      />
      <NavigationButton
        icon={CogIcon}
        tintColor={S.colors.primary}
        title="Settings"
        onPress={() => router.push(RoutesChannel.SETTINGS)}
      />
      <NavigationButton
        icon={LogoutIcon}
        tintColor="red"
        title="Sign out"
        onPress={async()=> await signOut()}
      />
    </S.View>
    </>
  );
};