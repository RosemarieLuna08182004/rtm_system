import { useSyncExternalStore } from 'react';

// Current display size (1 = original), shared by every Text in the app.
// Set by PreferencesProvider; read by ScaledText/ScaledTextInput.
let current = 1;
const listeners = new Set<() => void>();

export const setDisplayScaleValue = (scale: number) => {
  if (scale === current) return;
  current = scale;
  listeners.forEach((listener) => listener());
};

export const getDisplayScaleValue = () => current;

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useDisplayScale = () => useSyncExternalStore(subscribe, getDisplayScaleValue, getDisplayScaleValue);
