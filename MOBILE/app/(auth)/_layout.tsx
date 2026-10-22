import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar} from 'expo-status-bar'
import { usePreferences } from '@/context'

import { AppErrorBoundary } from '@/components/States/AppErrorBoundary';
// A screen that crashes shows a friendly 'Try again' page instead of closing the app.
export { AppErrorBoundary as ErrorBoundary }

export default function AuthLayout() {
  // Light screens in light mode, dark screens in dark mode: icons must contrast with both.
  const { isDark } = usePreferences()
  return (
   <>
    {/* Slide between sign-in, sign-up and forgot password. */}
    <Stack screenOptions={{ animation: 'ios_from_right' }}>
        <Stack.Screen name="sign-in" options={{headerShown:false}}/>
        <Stack.Screen name="sign-up" options={{headerShown:false}}/>
        <Stack.Screen name="forgot-password" options={{headerShown:false}}/>
    </Stack>
    <StatusBar style={isDark ? "light" : "dark"} />
   </> 
  )
}

