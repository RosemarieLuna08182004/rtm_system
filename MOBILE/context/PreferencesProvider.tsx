import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { colorScheme as nativewindColorScheme, useColorScheme } from 'nativewind';
import { setDisplayScaleValue } from '@/utils/displayScale';
import { getItem, setItem } from '@/utils/asyncStorage';

// Display size and theme, chosen in Settings → Display & comfort. Saved on this device.

export type ThemePreference = 'system' | 'light' | 'dark';

// Display size steps shown in Settings (1 = the original design).
export const DISPLAY_SCALES = [0.9, 1, 1.15, 1.3, 1.5, 1.75] as const;
const STORAGE_KEY = 'preferences.v1';

interface Preferences {
  displayScale: number;
  theme: ThemePreference;
  // Two-finger pinch magnifies whatever is on screen.
  pinchZoom: boolean;
}

interface PreferencesContextType extends Preferences {
  isDark: boolean;
  setDisplayScale: (scale: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setTheme: (theme: ThemePreference) => void;
  setPinchZoom: (enabled: boolean) => void;
  // Multiplies a fixed pixel size (for the few places that don't use classes).
  scaled: (size: number) => number;
}

const DEFAULTS: Preferences = { displayScale: 1, theme: 'system', pinchZoom: true };
const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const clampScale = (scale: number) => {
  const closest = DISPLAY_SCALES.reduce((best, step) => (Math.abs(step - scale) < Math.abs(best - scale) ? step : best), 1 as number);
  return closest;
};

export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULTS);
  const { colorScheme } = useColorScheme();

  // Load saved preferences once.
  useEffect(() => {
    (async () => {
      try {
        const saved = await getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setPrefs({
            displayScale: clampScale(Number(parsed.displayScale) || 1),
            theme: ['system', 'light', 'dark'].includes(parsed.theme) ? parsed.theme : 'system',
            pinchZoom: parsed.pinchZoom !== false,
          });
        }
      } catch {
        // Keep defaults.
      }
    })();
  }, []);

  // Apply to the whole app whenever they change.
  useEffect(() => {
    // Every S.Text / S.TextInput reads this and scales its final font size.
    // (NativeWind bakes class sizes in at build time, so this is done in ScaledText.)
    setDisplayScaleValue(prefs.displayScale);
  }, [prefs.displayScale]);

  useEffect(() => {
    nativewindColorScheme.set(prefs.theme);
  }, [prefs.theme]);

  // Functional updates, so two changes in a row (e.g. "Reset to default") both apply.
  const update = useCallback((change: (prev: Preferences) => Preferences) => {
    setPrefs((prev) => {
      const next = change(prev);
      setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const setDisplayScale = useCallback((scale: number) => update((prev) => ({ ...prev, displayScale: clampScale(scale) })), [update]);
  const step = useCallback((direction: 1 | -1) => update((prev) => {
    const index = DISPLAY_SCALES.indexOf(prev.displayScale as typeof DISPLAY_SCALES[number]);
    const next = DISPLAY_SCALES[Math.min(DISPLAY_SCALES.length - 1, Math.max(0, (index < 0 ? 1 : index) + direction))];
    return { ...prev, displayScale: next };
  }), [update]);
  const setTheme = useCallback((theme: ThemePreference) => update((prev) => ({ ...prev, theme })), [update]);
  const setPinchZoom = useCallback((pinchZoom: boolean) => update((prev) => ({ ...prev, pinchZoom })), [update]);

  const value = useMemo<PreferencesContextType>(() => ({
    ...prefs,
    isDark: colorScheme === 'dark',
    setDisplayScale,
    zoomIn: () => step(1),
    zoomOut: () => step(-1),
    setTheme,
    setPinchZoom,
    scaled: (size) => Math.round(size * prefs.displayScale),
  }), [prefs, colorScheme, setDisplayScale, step, setTheme, setPinchZoom]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
};

export const usePreferences = (): PreferencesContextType => {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used within a PreferencesProvider');
  return context;
};

// Colours for the few places that need plain values instead of classes (tab bar, HTML text, status bar).
export const useThemeColors = () => {
  const { isDark } = usePreferences();
  return isDark
    ? { background: '#020617', surface: '#0f172a', card: '#1e293b', border: '#334155', text: '#e2e8f0', mutedText: '#94a3b8', primary: '#60a5fa', header: '#1e3a8a', icon: '#93c5fd', iconMuted: '#64748b' }
    : { background: '#f1f5f9', surface: '#ffffff', card: '#ffffff', border: '#e5e7eb', text: '#334155', mutedText: '#6b7280', primary: '#1d4ed8', header: '#1d4ed8', icon: '#1d4ed8', iconMuted: '#94a3b8' };
};
