import React, { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { FadeInDown, FadeOutDown, ReduceMotion, runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePreferences } from '@/context/PreferencesProvider';

// Pinch with two fingers to magnify any screen (up to 300%), drag with two fingers to move
// around. While zoomed, a small bar at the bottom zooms in/out or resets.
// Turned on/off in Settings → Display & comfort. Resets when you change screen.

const MAX_SCALE = 3;
const STEP = 0.5;

export const ScreenZoom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pinchZoom, isDark } = usePreferences();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const scale = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const startScale = useSharedValue(1);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const [percent, setPercent] = useState(100);

  // Keep the zoomed screen covering the window (no empty edges).
  const clamp = (value: number, s: number, size: number) => {
    'worklet';
    const limit = (size * (s - 1)) / 2;
    return Math.min(limit, Math.max(-limit, value));
  };

  // Scale toward the point between the fingers, so what you pinch stays under them.
  const pinch = Gesture.Pinch()
    .enabled(pinchZoom)
    .onStart((e) => {
      startScale.value = scale.value;
      startX.value = tx.value;
      startY.value = ty.value;
      focalX.value = e.focalX - width / 2;
      focalY.value = e.focalY - height / 2;
    })
    .onUpdate((e) => {
      const next = Math.min(MAX_SCALE, Math.max(1, startScale.value * e.scale));
      const ratio = next / startScale.value;
      scale.value = next;
      tx.value = clamp(focalX.value - ratio * (focalX.value - startX.value), next, width);
      ty.value = clamp(focalY.value - ratio * (focalY.value - startY.value), next, height);
    })
    .onEnd(() => {
      if (scale.value < 1.05) {
        scale.value = withTiming(1);
        tx.value = withTiming(0);
        ty.value = withTiming(0);
      }
    });

  const pan = Gesture.Pan()
    .enabled(pinchZoom)
    .minPointers(2)
    .maxPointers(2)
    .onStart(() => {
      startX.value = tx.value;
      startY.value = ty.value;
    })
    .onUpdate((e) => {
      tx.value = clamp(startX.value + e.translationX, scale.value, width);
      ty.value = clamp(startY.value + e.translationY, scale.value, height);
    });

  const gesture = Gesture.Simultaneous(pinch, pan);

  const zoomStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }] as const,
  }));

  // Show the zoom level (in 10% steps) in the bar.
  useAnimatedReaction(
    () => Math.round(scale.value * 10) * 10,
    (value, previous) => { if (value !== previous) runOnJS(setPercent)(value); },
  );

  const zoomTo = useCallback((target: number) => {
    const next = Math.min(MAX_SCALE, Math.max(1, target));
    scale.value = withTiming(next, { duration: 250 });
    tx.value = withTiming(clamp(tx.value, next, width), { duration: 250 });
    ty.value = withTiming(clamp(ty.value, next, height), { duration: 250 });
  }, [scale, tx, ty, width, height]);

  // A new screen (or turning the feature off) starts at 100%.
  useEffect(() => { zoomTo(1); }, [pathname, pinchZoom, zoomTo]);

  const zoomed = percent > 100;
  const bar = isDark ? '#0f172a' : '#1e3a8a';

  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <View style={{ flex: 1, overflow: 'hidden' }} collapsable={false}>
          <Animated.View style={[{ flex: 1 }, zoomStyle]}>{children}</Animated.View>
        </View>
      </GestureDetector>

      {zoomed && (
        <Animated.View
          entering={FadeInDown.duration(220).reduceMotion(ReduceMotion.System)}
          exiting={FadeOutDown.duration(180).reduceMotion(ReduceMotion.System)}
          style={{
            position: 'absolute', alignSelf: 'center', bottom: insets.bottom + 92,
            flexDirection: 'row', alignItems: 'center', borderRadius: 999, paddingHorizontal: 6, paddingVertical: 6,
            backgroundColor: bar, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 8,
          }}
        >
          <ZoomButton icon="magnify-minus-outline" label="Zoom out" onPress={() => zoomTo(Math.round((scale.value - STEP) * 2) / 2)} />
          <Text style={{ color: '#ffffff', fontFamily: 'Poppins_600SemiBold', fontSize: 15, minWidth: 58, textAlign: 'center' }} accessibilityLiveRegion="polite">
            {percent}%
          </Text>
          <ZoomButton icon="magnify-plus-outline" label="Zoom in" onPress={() => zoomTo(Math.round((scale.value + STEP) * 2) / 2)} disabled={percent >= MAX_SCALE * 100} />
          <View style={{ width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 4 }} />
          <ZoomButton icon="fit-to-screen-outline" label="Reset zoom to 100 percent" onPress={() => zoomTo(1)} />
        </Animated.View>
      )}
    </View>
  );
};

const ZoomButton: React.FC<{ icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; label: string; onPress: () => void; disabled?: boolean }> = ({ icon, label, onPress, disabled }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={{ height: 44, width: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.4 : 1 }}
    accessibilityRole="button"
    accessibilityLabel={label}
  >
    <MaterialCommunityIcons name={icon} size={24} color="#ffffff" />
  </TouchableOpacity>
);
