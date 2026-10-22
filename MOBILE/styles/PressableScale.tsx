import React, { forwardRef, useRef } from 'react';
import { AccessibilityInfo, Animated, GestureResponderEvent, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { cssInterop } from 'nativewind';

// A TouchableOpacity that also shrinks a little while pressed and springs back.
// Used as S.TouchableOpacity, so every button and card in the app gets the same feel.
// Turned off when the phone's "Remove animations" / reduce motion setting is on.

let reduceMotion = false;
AccessibilityInfo.isReduceMotionEnabled().then((value) => { reduceMotion = value; }).catch(() => {});
AccessibilityInfo.addEventListener('reduceMotionChanged', (value) => { reduceMotion = value; });

const PRESSED_SCALE = 0.97;

export const PressableScale = forwardRef<View, TouchableOpacityProps>(({ style, onPressIn, onPressOut, ...rest }, ref) => {
  const scale = useRef(new Animated.Value(1)).current;

  const springTo = (toValue: number) => {
    if (reduceMotion) return;
    Animated.spring(scale, { toValue, useNativeDriver: true, speed: 40, bounciness: toValue === 1 ? 8 : 0 }).start();
  };

  return (
    <TouchableOpacity
      ref={ref}
      {...rest}
      onPressIn={(event: GestureResponderEvent) => { springTo(PRESSED_SCALE); onPressIn?.(event); }}
      onPressOut={(event: GestureResponderEvent) => { springTo(1); onPressOut?.(event); }}
      style={[style, { transform: [{ scale }] }]}
    />
  );
});

cssInterop(PressableScale, { className: 'style' });
