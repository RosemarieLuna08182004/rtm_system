import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, OnBoardingCon } from '@/components';
import { ONBOARDING_SEEN_KEY, RoutesChannel } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { getItem } from '@/utils/asyncStorage';
import * as S from '@/styles';
import { StatusBar } from 'expo-status-bar';
import { usePreferences } from '@/context';

// Start screen. The onboarding slides show once; after that people go straight to
// Home (signed in) or Sign In. "About the Author" / "‹ Onboarding" open the slides on purpose.
export default function App() {
  const router = useRouter()
  const { auth, initialized } = useAuth();
  const { isDark } = usePreferences();
  const { showOnboarding } = useLocalSearchParams<{ showOnboarding?: string }>();
  const [showSlides, setShowSlides] = useState(false);

  useEffect(() => {
    if (!initialized) return;
    if (showOnboarding === 'true') {
      setShowSlides(true);
      return;
    }
    if (auth?.accessToken) {
      router.replace(RoutesChannel.HOME);
      return;
    }
    let active = true;
    getItem(ONBOARDING_SEEN_KEY).then((seen) => {
      if (!active) return;
      if (seen) router.replace(RoutesChannel.SIGN_IN);
      else setShowSlides(true);
    });
    return () => { active = false; };
  }, [initialized, auth?.accessToken, showOnboarding, router]);

  if (!showSlides) return <ActivityIndicator/>;

  return (
    <S.SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      {/* The slides are white in light mode, so the status bar icons go dark there. */}
      <StatusBar style={isDark ? "light" : "dark"} />
      <OnBoardingCon/>
    </S.SafeAreaView>
  );
}
