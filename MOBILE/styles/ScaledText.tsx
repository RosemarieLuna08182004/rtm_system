import React, { createContext, forwardRef, useContext } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TextProps, TextStyle } from 'react-native';
import { cssInterop } from 'nativewind';
import { useDisplayScale } from '@/utils/displayScale';

// Text that follows Settings → Display & comfort on every screen.
// It runs after NativeWind has turned className into style, so it scales sizes from
// classes, inline styles and the default (14) alike.

const DEFAULT_FONT_SIZE = 14;
// Nested text without its own size inherits the parent's (already scaled) size.
const InsideScaledText = createContext(false);

const scaleStyle = (style: TextProps['style'], scale: number, inherit: boolean): TextStyle | null => {
  const flat = (StyleSheet.flatten(style) ?? {}) as TextStyle;
  const out: TextStyle = {};
  if (typeof flat.fontSize === 'number') out.fontSize = flat.fontSize * scale;
  else if (!inherit) out.fontSize = DEFAULT_FONT_SIZE * scale;
  if (typeof flat.lineHeight === 'number') out.lineHeight = flat.lineHeight * scale;
  return Object.keys(out).length ? out : null;
};

export const ScaledText = forwardRef<Text, TextProps>((props, ref) => {
  const scale = useDisplayScale();
  const inherit = useContext(InsideScaledText);
  const extra = scale === 1 ? null : scaleStyle(props.style, scale, inherit);
  return (
    <InsideScaledText.Provider value={true}>
      <Text ref={ref} {...props} style={extra ? [props.style, extra] : props.style} />
    </InsideScaledText.Provider>
  );
});
ScaledText.displayName = 'ScaledText';

export const ScaledTextInput = forwardRef<TextInput, TextInputProps>((props, ref) => {
  const scale = useDisplayScale();
  const extra = scale === 1 ? null : scaleStyle(props.style as TextProps['style'], scale, false);
  return <TextInput ref={ref} {...props} style={extra ? [props.style, extra] : props.style} />;
});
ScaledTextInput.displayName = 'ScaledTextInput';

// Let these accept className like the built-in components.
cssInterop(ScaledText, { className: 'style' });
cssInterop(ScaledTextInput, { className: { target: 'style' }, placeholderClassName: { target: false, nativeStyleToProp: { color: 'placeholderTextColor' } } });
