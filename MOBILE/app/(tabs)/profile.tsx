import React from 'react';
import * as S from "@/styles"
import { ProfileButtonList, ProfileInfo } from '@/components';
import { RequireAuth } from '@/context';

export default function Profile() {
  return (
    <S.View className="flex-1 bg-gray-50">
      <RequireAuth>
        {/* Header with Profile Info */}
        <S.View className="bg-blue-700 pb-3">
          <S.SafeAreaView className="px-5 pt-5">
            <S.Text className="text-white text-2xl font-pbold text-center pt-3">Profile</S.Text>
            <S.View className="mt-4">
              <ProfileInfo />
            </S.View>
          </S.SafeAreaView>
        </S.View>

        {/* Action Buttons */}
        <S.View className="flex-1 px-5 mt-6">
          <S.View className="bg-white rounded-2xl overflow-hidden">
            <ProfileButtonList />
          </S.View>
        </S.View>

        {/* App Version */}
        <S.View className="py-4 items-center">
          <S.Text className="text-gray-400 text-sm font-pregular"> © 2025 Roots and Morphology</S.Text>
        </S.View>
      </RequireAuth>
    </S.View>
  );
}
