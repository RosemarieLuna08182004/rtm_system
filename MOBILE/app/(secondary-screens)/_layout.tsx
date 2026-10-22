import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar} from 'expo-status-bar'

import { AppErrorBoundary } from '@/components/States/AppErrorBoundary';
// A screen that crashes shows a friendly 'Try again' page instead of closing the app.
export { AppErrorBoundary as ErrorBoundary }

export default function ScreenLayout() {
  return (
   <>
    {/* Screens slide in from the right; search rises from the bottom. */}
    <Stack screenOptions={{ animation: 'ios_from_right' }}>
        <Stack.Screen name="edit-profile" options={{headerShown:false}}/>
        <Stack.Screen name="terms" options={{headerShown:false}}/>
        <Stack.Screen name="term-line" options={{headerShown:false}}/>
        <Stack.Screen name="settings" options={{headerShown:false}}/>
        <Stack.Screen name="change-password" options={{headerShown:false}}/>
        <Stack.Screen name="terms-condition" options={{headerShown:false}}/>
        <Stack.Screen name="root" options={{headerShown:false}}/>
        <Stack.Screen name="search" options={{headerShown:false, animation: 'fade_from_bottom'}}/>
        <Stack.Screen name="display-settings" options={{headerShown:false}}/>
        <Stack.Screen name="faq" options={{headerShown:false}}/>
        <Stack.Screen name="about" options={{headerShown:false}}/>
    </Stack>
    <StatusBar style="light"/>
   </> 
  )
}

