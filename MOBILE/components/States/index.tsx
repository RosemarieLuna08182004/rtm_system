import React from 'react';
import { ActivityIndicator } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as S from '@/styles';
import { SFC } from '@/types';
import { usePreferences } from '@/context/PreferencesProvider';
import { IconName } from '@/utils/subjectStyle';

export { errorMessageFrom } from '@/utils/errors';

export type StateKind = 'loading' | 'empty' | 'error';

export interface StateViewProps {
  Kind: StateKind;
  Title?: string;
  Message?: string;
  OnRetry?: () => void;
  // Optional: a different icon, and a button for empty states (e.g. "Browse volumes").
  Icon?: IconName;
  ActionLabel?: string;
  OnAction?: () => void;
}

const DEFAULT_TITLES: Record<StateKind, string> = {
  loading: 'Loading...',
  empty: 'Nothing here yet',
  error: 'Something went wrong',
};

const DEFAULT_ICONS: Record<Exclude<StateKind, 'loading'>, IconName> = {
  empty: 'text-box-search-outline',
  error: 'cloud-alert',
};

// One look for loading, empty and error states across screens.
// Errors show inline with a Retry button instead of a popup alert.
export const StateView: SFC<StateViewProps> = ({ ClassName, Kind, Title, Message, OnRetry, Icon, ActionLabel, OnAction }) => {
  const { isDark } = usePreferences();
  const isError = Kind === 'error';
  const icon = Icon ?? (Kind === 'loading' ? undefined : DEFAULT_ICONS[Kind]);
  const buttonLabel = isError && OnRetry ? 'Try again' : ActionLabel;
  const onButton = isError && OnRetry ? OnRetry : OnAction;

  return (
    <S.View
      className={`flex-1 items-center justify-center px-8 py-10 bg-slate-50 dark:bg-slate-950 ${ClassName ?? ''}`}
      accessibilityLiveRegion={isError ? 'assertive' : 'polite'}
      accessibilityRole={isError ? 'alert' : undefined}
    >
      <Animated.View entering={FadeIn.duration(300).reduceMotion(ReduceMotion.System)} style={{ alignItems: 'center', maxWidth: 360 }}>
        {Kind === 'loading' ? (
          <ActivityIndicator size="large" color={isDark ? '#60a5fa' : '#1d4ed8'} />
        ) : (
          <S.View className={`h-20 w-20 rounded-full items-center justify-center ${isError ? 'bg-red-50 dark:bg-red-950' : 'bg-blue-50 dark:bg-slate-800'}`}>
            <MaterialCommunityIcons
              name={icon!}
              size={38}
              color={isError ? (isDark ? '#f87171' : '#dc2626') : (isDark ? '#93c5fd' : '#1d4ed8')}
            />
          </S.View>
        )}
        <S.Text className={`text-lg font-psemibold text-center mt-4 ${isError ? 'text-red-700 dark:text-red-400' : 'text-slate-800 dark:text-slate-100'}`}>
          {Title ?? DEFAULT_TITLES[Kind]}
        </S.Text>
        {Message ? (
          <S.Text className="text-sm font-pregular text-slate-500 dark:text-slate-400 text-center mt-2 leading-5">{Message}</S.Text>
        ) : null}
        {buttonLabel && onButton ? (
          <S.TouchableOpacity
            onPress={onButton}
            className="mt-6 flex-row items-center rounded-full px-6 py-3 bg-blue-700 dark:bg-blue-600"
            accessibilityRole="button"
            accessibilityLabel={buttonLabel}
          >
            {isError && <MaterialCommunityIcons name="refresh" size={18} color="#ffffff" style={{ marginRight: 6 }} />}
            <S.Text className="text-white font-psemibold">{buttonLabel}</S.Text>
          </S.TouchableOpacity>
        ) : null}
      </Animated.View>
    </S.View>
  );
};
