import React from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as S from "@/styles"
import { RequireAuth, usePreferences, useThemeColors } from '@/context';
import { useAuth, useSignOut } from '@/hooks';
import { RLogoWhiteIcon, RoutesChannel } from '@/constants';
import { IconName } from '@/utils/subjectStyle';
import { FadeInItem } from '@/components/Motion';

// From app.json, so the footer never goes stale.
const appVersion = Constants.expoConfig?.version;
const AVATAR = 128;

interface ActionProps {
  icon: IconName;
  iconColor: string;
  tile: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const ActionCard: React.FC<ActionProps> = ({ icon, iconColor, tile, title, subtitle, onPress }) => {
  const theme = useThemeColors();
  return (
  <S.TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    className="flex-row items-center mb-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
    style={{ shadowColor: '#1e3a8a', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2 }}
    accessibilityRole="button"
    accessibilityLabel={`${title}. ${subtitle}`}
  >
    <S.View className={`h-14 w-14 rounded-full items-center justify-center ${tile}`}>
      <MaterialCommunityIcons name={icon} size={28} color={iconColor} />
    </S.View>
    <S.View className="flex-1 ml-4">
      <S.Text className="text-lg font-pbold text-blue-950 dark:text-slate-100">{title}</S.Text>
      <S.Text className="text-sm font-pregular text-slate-500 dark:text-slate-400">{subtitle}</S.Text>
    </S.View>
    <MaterialCommunityIcons name="chevron-right" size={26} color={theme.icon} />
  </S.TouchableOpacity>
  );
};

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = usePreferences();
  const { auth } = useAuth();
  const { signOut } = useSignOut();
  const name = String(auth?.user?.Name ?? '').trim();
  const email = String(auth?.user?.Email ?? '').trim();
  const photo: string | undefined = auth?.user?.ProfilePhoto || undefined;

  const confirmSignOut = () =>
    Alert.alert('Sign out?', 'You can sign back in any time.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => signOut() },
    ]);

  return (
    <RequireAuth>
      <S.View className="flex-1 bg-slate-50 dark:bg-slate-950">
        <S.ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}>
          {/* Blue header with a curved bottom */}
          <S.LinearGradient
            colors={['#1d4ed8', '#1d4ed8', '#2563eb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ paddingTop: insets.top + 12, paddingBottom: 36, paddingHorizontal: 22, borderBottomLeftRadius: 56, borderBottomRightRadius: 56 }}
          >
            <S.View className="flex-row items-center">
              <S.Image source={RLogoWhiteIcon} className="w-[44px] h-[44px]" resizeMode="contain" />
              <S.View className="h-8 w-px bg-white/50 mx-4" />
              <S.Text className="flex-shrink text-white text-lg font-psemibold" numberOfLines={1}>Roots & Morphology</S.Text>
            </S.View>

            <S.View className="items-center mt-6">
              <S.View>
                <S.View
                  className="items-center justify-center bg-blue-100 dark:bg-slate-700 overflow-hidden"
                  style={{ width: AVATAR, height: AVATAR, borderRadius: AVATAR / 2, borderWidth: 5, borderColor: '#ffffff' }}
                  accessibilityRole="image"
                  accessibilityLabel="Profile picture"
                >
                  {photo ? (
                    <S.Image source={{ uri: photo }} style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <MaterialCommunityIcons name="account" size={AVATAR * 0.82} color={isDark ? '#94a3b8' : '#6b87c7'} style={{ marginTop: AVATAR * 0.16 }} />
                  )}
                </S.View>
                <S.TouchableOpacity
                  onPress={() => router.push(RoutesChannel.EDIT_PROFILE)}
                  className="absolute bottom-0 right-0 h-11 w-11 rounded-full bg-white items-center justify-center"
                  style={{ shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3 }}
                  accessibilityRole="button"
                  accessibilityLabel="Edit profile"
                >
                  <MaterialCommunityIcons name="square-edit-outline" size={22} color="#1d4ed8" />
                </S.TouchableOpacity>
              </S.View>

              <S.Text className="text-white text-3xl font-pbold mt-4 text-center" numberOfLines={1}>{name || 'Your profile'}</S.Text>
              {!!email && <S.Text className="text-blue-100 text-base font-pregular mt-1 text-center" numberOfLines={1}>{email}</S.Text>}
            </S.View>
          </S.LinearGradient>

          {/* Actions */}
          <S.View className="px-5 mt-7">
            <FadeInItem index={0}>
              <ActionCard
                icon="eye"
                iconColor={isDark ? '#93c5fd' : '#1d4ed8'}
                tile="bg-blue-50 dark:bg-blue-950"
                title="Display & Comfort"
                subtitle="Adjust display, text size and reading comfort"
                onPress={() => router.push(RoutesChannel.DISPLAY_SETTINGS)}
              />
            </FadeInItem>
            <FadeInItem index={1}>
              <ActionCard
                icon="help-circle-outline"
                iconColor={isDark ? '#22d3ee' : '#0891b2'}
                tile="bg-cyan-50 dark:bg-cyan-950"
                title="Help & FAQ"
                subtitle="Answers to common questions"
                onPress={() => router.push(RoutesChannel.FAQ)}
              />
            </FadeInItem>
            <FadeInItem index={2}>
              <ActionCard
                icon="information-outline"
                iconColor={isDark ? '#34d399' : '#059669'}
                tile="bg-emerald-50 dark:bg-emerald-950"
                title="About the app"
                subtitle="What Roots & Morphology is and what it can do"
                onPress={() => router.push(RoutesChannel.ABOUT)}
              />
            </FadeInItem>
            <FadeInItem index={3}>
              <ActionCard
                icon="cog"
                iconColor={isDark ? '#a78bfa' : '#7c3aed'}
                tile="bg-violet-100 dark:bg-violet-950"
                title="Settings"
                subtitle="App preferences and account settings"
                onPress={() => router.push(RoutesChannel.SETTINGS)}
              />
            </FadeInItem>
            <FadeInItem index={4}>
              <ActionCard
                icon="logout"
                iconColor={isDark ? '#f87171' : '#dc2626'}
                tile="bg-red-50 dark:bg-red-950"
                title="Sign out"
                subtitle="Log out of your account"
                onPress={confirmSignOut}
              />
            </FadeInItem>
          </S.View>

          {/* Footer */}
          <S.View className="flex-1 justify-end items-center pt-10">
            <S.Text className="text-slate-400 dark:text-slate-500 text-sm font-pregular">
              © {new Date().getFullYear()} Roots and Morphology{appVersion ? ` • v${appVersion}` : ""}
            </S.Text>
          </S.View>
        </S.ScrollView>
      </S.View>
    </RequireAuth>
  );
}
