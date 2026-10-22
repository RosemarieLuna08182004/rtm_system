import React from 'react';
import { useRouter } from 'expo-router';
import { ComposeIcon, RoutesChannel } from '@/constants';
import * as S from "@/styles";
import { imageInitial, SFC } from '@/types';
import { useAuth } from '@/hooks';
import { ProfilePicture } from '@/components/Images';
import { View } from 'react-native';

export const ProfileInfo: SFC = () => {
  const router = useRouter();
  const { auth } = useAuth();

  const handleEditPress = () => {
    try {
      router.push(RoutesChannel.EDIT_PROFILE);
    } catch (error) {
      // Navigation error handled silently
    }
  };

  return (
    <View style={{ alignItems: 'center', width: '100%' }}>
      <View style={{ marginBottom: 24, position: 'relative' }}>
        <ProfilePicture 
          imageUri={auth?.user?.ProfilePhoto || imageInitial.avatarUrl} 
          size={140}
          borderWidth={4}
          borderColor="white"
          onPress={handleEditPress}
          showEditButton={false}
        />
        <S.TouchableOpacity
          onPress={handleEditPress}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: 'white',
            padding: 8,
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
          accessibilityLabel="Edit profile"
        >
          <S.Image 
            source={ComposeIcon} 
            style={{ width: 24, height: 24 }} 
            tintColor={S.colors.primary} 
          />
        </S.TouchableOpacity>
      </View>
      <S.Text className="text-white text-2xl font-pbold mb-1 text-center">
        {auth?.user?.Name || imageInitial.name}
      </S.Text>
      <S.Text className="text-white/90 text-base font-pregular text-center">
        {auth?.user?.Email || imageInitial.username}
      </S.Text>
    </View>
  );
};