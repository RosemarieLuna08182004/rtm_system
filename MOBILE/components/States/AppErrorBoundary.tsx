import React, { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ErrorBoundaryProps } from 'expo-router';

// Shown instead of a crash when a screen throws an unexpected error.
// Uses only plain React Native (no app providers), so it still works if a provider is what failed.
export function AppErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const dark = useColorScheme() === 'dark';
  const [retrying, setRetrying] = useState(false);

  const tryAgain = async () => {
    setRetrying(true);
    try {
      await retry();
    } finally {
      setRetrying(false);
    }
  };

  const c = dark
    ? { bg: '#020617', title: '#f8fafc', text: '#94a3b8', tile: '#450a0a', icon: '#f87171', detail: '#64748b' }
    : { bg: '#f8fafc', title: '#0f172a', text: '#475569', tile: '#fef2f2', icon: '#dc2626', detail: '#94a3b8' };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', padding: 32 }} accessibilityRole="alert">
      <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: c.tile, alignItems: 'center', justifyContent: 'center' }}>
        <MaterialCommunityIcons name="alert-circle-outline" size={42} color={c.icon} />
      </View>
      <Text style={{ marginTop: 18, fontSize: 20, fontFamily: 'Poppins_600SemiBold', color: c.title, textAlign: 'center' }}>
        Something went wrong
      </Text>
      <Text style={{ marginTop: 8, fontSize: 14, lineHeight: 21, fontFamily: 'Poppins_400Regular', color: c.text, textAlign: 'center', maxWidth: 320 }}>
        This screen ran into a problem. Your bookmarks and notes are safe. Try again, or go back and open it once more.
      </Text>
      <TouchableOpacity
        onPress={tryAgain}
        disabled={retrying}
        style={{ marginTop: 24, flexDirection: 'row', alignItems: 'center', backgroundColor: '#1d4ed8', borderRadius: 999, paddingHorizontal: 24, paddingVertical: 12, opacity: retrying ? 0.7 : 1 }}
        accessibilityRole="button"
        accessibilityLabel="Try again"
      >
        {retrying ? <ActivityIndicator color="#ffffff" size="small" /> : <MaterialCommunityIcons name="refresh" size={18} color="#ffffff" />}
        <Text style={{ marginLeft: 8, color: '#ffffff', fontSize: 15, fontFamily: 'Poppins_600SemiBold' }}>Try again</Text>
      </TouchableOpacity>
      {__DEV__ && !!error?.message && (
        <Text style={{ marginTop: 20, fontSize: 12, color: c.detail, textAlign: 'center' }} numberOfLines={4}>
          {error.message}
        </Text>
      )}
    </View>
  );
}
