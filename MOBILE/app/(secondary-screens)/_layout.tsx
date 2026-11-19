import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar} from 'expo-status-bar'

export default function ScreenLayout() {
  return (
   <>
    <Stack>
        <Stack.Screen name="edit-profile" options={{headerShown:false}}/>
        <Stack.Screen name="terms" options={{headerShown:false}}/>
        <Stack.Screen name="term-line" options={{headerShown:false}}/>
        <Stack.Screen name="settings" options={{headerShown:false}}/>
        <Stack.Screen name="change-password" options={{headerShown:false}}/>
        <Stack.Screen name="terms-condition" options={{headerShown:false}}/>
    </Stack>
    <StatusBar style="light"/>
   </> 
  )
}

