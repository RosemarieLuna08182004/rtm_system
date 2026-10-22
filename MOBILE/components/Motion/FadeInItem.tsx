import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';

interface Props {
  // Position in a list: each item starts a little after the one before it (capped).
  index?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

// Slides content up into place while it fades in. Skipped when the phone asks for less motion.
export const FadeInItem: React.FC<Props> = ({ index = 0, style, children }) => (
  <Animated.View
    entering={FadeInDown.duration(420).delay(Math.min(index, 8) * 55).reduceMotion(ReduceMotion.System)}
    style={style}
    // Fade as one layer: on Android, card shadows inside a fading view otherwise show as dark boxes.
    renderToHardwareTextureAndroid
    needsOffscreenAlphaCompositing
  >
    {children}
  </Animated.View>
);
