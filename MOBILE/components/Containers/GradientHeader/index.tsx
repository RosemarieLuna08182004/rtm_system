import React from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as S from '@/styles';
import { IconName } from '@/utils/subjectStyle';

interface Props {
  title: string;
  subtitle?: string;
  icon?: IconName;   // large faded icon on the right
}

// Blue gradient header with a back button, like the Terms and term screens.
export const GradientHeader: React.FC<Props> = ({ title, subtitle, icon }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <S.LinearGradient
      colors={['#1e3a8a', '#1d4ed8', '#3b82f6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ paddingTop: insets.top + 14, paddingBottom: 26, paddingHorizontal: 18, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: 'hidden' }}
    >
      {!!icon && (
        <S.View className="absolute -right-6 -bottom-8 opacity-15" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <MaterialCommunityIcons name={icon} size={120} color="#ffffff" />
        </S.View>
      )}
      <S.View className="flex-row items-center">
        <S.TouchableOpacity
          onPress={() => router.back()}
          className="h-12 w-12 rounded-full items-center justify-center bg-white/15 border border-white/20"
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#ffffff" />
        </S.TouchableOpacity>
        <S.View className="flex-1 ml-4 pr-16">
          <S.Text className="text-white text-2xl font-pbold" numberOfLines={2} accessibilityRole="header">{title}</S.Text>
          {!!subtitle && <S.Text className="text-blue-100 text-sm font-pregular mt-0.5">{subtitle}</S.Text>}
        </S.View>
      </S.View>
    </S.LinearGradient>
  );
};
