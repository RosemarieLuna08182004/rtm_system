import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, IsConnectedCard, OnBoardingCon } from '@/components';
import { RoutesChannel } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useSignOut } from '@/hooks/useSignOut';
import * as S from '@/styles';
import { isTokenExpired } from '@/context/AuthProvider';
import { Alert } from 'react-native';
import { Error, ErrorTitle } from '@/shared';

export default function App() {
  const router = useRouter()
  const { auth } = useAuth();
  const isConnected = useNetworkStatus(); 
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {signOut}= useSignOut()

  useEffect(() => { 
    const checkAuthAndOnboarding = async () => {
      try {
        // We no longer check hasOnboarded here to make it persistent every time the app opens
        setIsLoading(false);
      } catch (error) {
        Alert.alert(ErrorTitle.m0001, Error.m0001);
        router.replace(RoutesChannel.SIGN_IN);
      } finally {
        if (isLoading) {
          setIsLoading(false);
        }
      }
    };

    const timer = setTimeout(() => {
      checkAuthAndOnboarding();
    }, 100);

    return () => clearTimeout(timer);
  }, [auth]);

  if (isLoading) return <ActivityIndicator/>;
  
  if (!isConnected) return <IsConnectedCard />;

  return (
    <S.SafeAreaView className="flex-1 bg-white">
      <OnBoardingCon/>
    </S.SafeAreaView>
  );
}