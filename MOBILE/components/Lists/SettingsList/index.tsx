import React from 'react';
import * as S from '@/styles';
import { useRouter } from 'expo-router';
import { LockIcon, RoutesChannel, TermsAndConditionIcon, VisibilityIcon } from '@/constants';
import { NavigationButton } from '@/components/Buttons';

export const SettingsList = ({ClassName}) => {
  const router = useRouter()
  return (
    <>
      <S.View className={ClassName}>
        <NavigationButton
          icon={VisibilityIcon}
          tintColor={S.colors.primary}
          title="Display & comfort"
          onPress={() => router.push(RoutesChannel.DISPLAY_SETTINGS)}
        />
        <NavigationButton
          icon={TermsAndConditionIcon}
          tintColor={S.colors.primary}
          title="Terms and Conditions"
          onPress={() => router.push(RoutesChannel.TERMS_AND_CONDITIONS)}
        />
        <NavigationButton
          icon={LockIcon}
          tintColor={S.colors.primary}
          title="Change Password"
          onPress={() => router.push(RoutesChannel.CHANGE_PASSWORD)}
        />
      </S.View>
    </>
  );
};
