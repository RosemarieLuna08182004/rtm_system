import React from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as S from "@/styles"
import { RequireAuth, usePreferences } from '@/context';
import { useAuth, useSignOut } from '@/hooks';
import { RLogoWhiteIcon, RoutesChannel } from '@/constants';
import { IconName } from '@/utils/subjectStyle';
import { FadeInItem } from '@/components/Motion';

// From app.json, so the footer never goes stale.
const appVersion = Constants.expoConfig?.version;
const AVATAR = 128;
const BLUE_SHADOW = { shadowColor: '#1d4ed8', shadowOpacity: 0.16, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 5 };

interface ActionProps {
  icon: IconName;
  title: string;
  subtitle: string;
  onPress: () => void;
}

// White card with a blue glow and a blue gradient icon.
const ActionCard: React.FC<ActionProps> = ({ icon, title, subtitle, onPress }) => {
  const { isDark } = usePreferences();
  return (
    <S.TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="flex-row items-center mb-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-950"
      style={BLUE_SHADOW}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
    >
      <S.LinearGradient
        colors={['#1e3a8a', '#2563eb', '#60a5fa']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ height: 52, width: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}
      >
        <MaterialCommunityIcons name={icon} size={26} color="#ffffff" />
      </S.LinearGradient>
      <S.View className="flex-1 ml-4">
        <S.Text className="text-base font-pbold text-blue-950 dark:text-slate-100">{title}</S.Text>
        <S.Text className="text-sm font-pregular text-slate-500 dark:text-slate-400">{subtitle}</S.Text>
      </S.View>
      <S.View className="h-8 w-8 rounded-full items-center justify-center bg-blue-50 dark:bg-slate-800">
        <MaterialCommunityIcons name="chevron-right" size={22} color={isDark ? '#93c5fd' : '#1d4ed8'} />
      </S.View>
    </S.TouchableOpacity>
  );
};

const SectionLabel: React.FC<{ title: string }> = ({ title }) => (
  <S.View className="flex-row items-center mb-3 mt-2 ml-1">
    <S.View className="h-4 w-1 rounded-full bg-blue-600 dark:bg-blue-400" />
    <S.Text className="ml-2 text-xs uppercase tracking-widest font-pbold text-blue-800 dark:text-blue-300" accessibilityRole="header">{title}</S.Text>
  </S.View>
);

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

  const general: ActionProps[] = [
    { icon: 'eye', title: 'Display & Comfort', subtitle: 'Text size, dark mode and zoom', onPress: () => router.push(RoutesChannel.DISPLAY_SETTINGS) },
    { icon: 'help-circle-outline', title: 'Help & FAQ', subtitle: 'Answers to common questions', onPress: () => router.push(RoutesChannel.FAQ) },
    { icon: 'information-outline', title: 'About the app', subtitle: 'Roots & Morphology and its author', onPress: () => router.push(RoutesChannel.ABOUT) },
  ];
  const account: ActionProps[] = [
    { icon: 'account-circle-outline', title: 'Account', subtitle: 'Edit your name and photo', onPress: () => router.push(RoutesChannel.EDIT_PROFILE) },
    { icon: 'file-document-outline', title: 'Terms and Conditions', subtitle: 'How the app may be used', onPress: () => router.push(RoutesChannel.TERMS_AND_CONDITIONS) },
    { icon: 'lock-reset', title: 'Change password', subtitle: 'Update your sign-in password', onPress: () => router.push(RoutesChannel.CHANGE_PASSWORD) },
  ];

  return (
    <RequireAuth>
      <S.View className="flex-1 bg-blue-50/60 dark:bg-slate-950">
        <S.ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}>
          {/* Blue header with a curved bottom */}
          <S.LinearGradient
            colors={['#1e3a8a', '#1d4ed8', '#3b82f6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ paddingTop: insets.top + 12, paddingBottom: 36, paddingHorizontal: 22, borderBottomLeftRadius: 56, borderBottomRightRadius: 56, ...BLUE_SHADOW }}
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
                  style={{ shadowColor: '#1e3a8a', shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 4 }}
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

          <S.View className="px-5 mt-7">
            <SectionLabel title="General" />
            {general.map((action, i) => (
              <FadeInItem key={action.title} index={i}><ActionCard {...action} /></FadeInItem>
            ))}

            <S.View className="mt-4" />
            <SectionLabel title="Account" />
            {account.map((action, i) => (
              <FadeInItem key={action.title} index={i + general.length}><ActionCard {...action} /></FadeInItem>
            ))}

            <FadeInItem index={general.length + account.length}>
              <S.TouchableOpacity onPress={confirmSignOut} activeOpacity={0.85} className="mt-4" accessibilityRole="button" accessibilityLabel="Sign out">
                <S.LinearGradient
                  colors={['#1e3a8a', '#1d4ed8', '#2563eb']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ borderRadius: 18, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', ...BLUE_SHADOW }}
                >
                  <MaterialCommunityIcons name="logout" size={22} color="#ffffff" />
                  <S.Text className="ml-2 text-white text-base font-pbold">Sign out</S.Text>
                </S.LinearGradient>
              </S.TouchableOpacity>
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
