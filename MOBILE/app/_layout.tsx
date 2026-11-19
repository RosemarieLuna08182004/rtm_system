import '../global.css';
import React, { useEffect } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, BookmarkProvider } from '@/context';
import { ToasterManager } from '@/shared';
import { Provider } from 'react-redux';
import store from '@/stored';
import { IsConnectedCard } from '@/components';
import { useNetworkStatus } from '@/hooks';
import { useAppFonts } from '@/hooks/useFonts';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const isConnected = useNetworkStatus(); 
  const fontsLoaded = useAppFonts();
  
  useEffect(()=>{
      if (fontsLoaded) SplashScreen.hideAsync();
  },[fontsLoaded])

  if (!fontsLoaded) return null
  if (!isConnected) return <IsConnectedCard />;
  return (
    <>
    <Provider store={store}>
        <AuthProvider>
          <BookmarkProvider>
            <ToasterManager />
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(secondary-screens)" options={{ headerShown: false }} />
              </Stack>
          </BookmarkProvider>
        </AuthProvider>
    </Provider>
    <StatusBar style="light" />
    </>
  );
};
