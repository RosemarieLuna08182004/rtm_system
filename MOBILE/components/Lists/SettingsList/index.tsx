import React from 'react';
import * as S from '@/styles';
import { useRouter } from 'expo-router';
import { LockIcon, RoutesChannel, TermsAndConditionIcon } from '@/constants';
import { NavigationButton } from '@/components/Buttons';

export const SettingsList = ({ClassName}) => {
  const router = useRouter()
  return (
    <>
      <S.View className={ClassName}>
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
