import '../global.css';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, BookmarkProvider, PreferencesProvider, StudyProvider } from '@/context';
import { ToasterManager } from '@/shared';
import { IsConnectedCard } from '@/components';
import { useNetworkStatus } from '@/hooks';
import { useAppFonts } from '@/hooks/useFonts';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ScreenZoom } from '@/components/Motion/ScreenZoom';
import { AppErrorBoundary } from '@/components/States/AppErrorBoundary';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { usePreferences } from '@/context';

SplashScreen.preventAutoHideAsync();

// A screen that crashes shows a friendly 'Try again' page instead of closing the app.
export { AppErrorBoundary as ErrorBoundary }

// Navigation background follows the app theme, so screen transitions never flash white in dark mode.
const LIGHT_NAV = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: '#f8fafc', card: '#ffffff' } };
const DARK_NAV = { ...DarkTheme, colors: { ...DarkTheme.colors, background: '#020617', card: '#0f172a' } };
const ThemedNavigation: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDark } = usePreferences();
  return <ThemeProvider value={isDark ? DARK_NAV : LIGHT_NAV}>{children}</ThemeProvider>;
};

export default function RootLayout() {
  const isConnected = useNetworkStatus(); 
  const fontsLoaded = useAppFonts();
  
  useEffect(()=>{
      if (fontsLoaded) SplashScreen.hideAsync();
  },[fontsLoaded])

  if (!fontsLoaded) return null
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PreferencesProvider>
        <AuthProvider>
          <StudyProvider>
          <BookmarkProvider>
            <ToasterManager />
              {/* Pinch with two fingers to magnify any screen. */}
              <ThemedNavigation>
              <ScreenZoom>
              {/* Cross-fade between sign-in and the main app. */}
              <Stack screenOptions={{ animation: 'fade' }}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(secondary-screens)" options={{ headerShown: false }} />
              </Stack>
              </ScreenZoom>
              </ThemedNavigation>
          </BookmarkProvider>
          </StudyProvider>
        </AuthProvider>
      </PreferencesProvider>
    {/* Offline: cover the app but keep it mounted, so sign-in state and the current
        screen survive a dropped connection. */}
    {!isConnected && (
      <View style={StyleSheet.absoluteFill}>
        <IsConnectedCard />
      </View>
    )}
    <StatusBar style="light" />
    </GestureHandlerRootView>
  );
};
