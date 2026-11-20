import React, { useEffect, useState } from 'react';
import { Modal } from 'react-native';
import * as S from '@/styles';
import { useAuth } from '@/hooks';
import { useAxiosPrivate } from '@/hooks/useAxiosPrivate';
import { API } from '@/constants';
import { showMessage } from '@/shared';
import { ToastType } from '@/types';
import { deviceCountry } from '@/shared/data/countries';
import { CountryPicker } from '../../FormInputs/CountryPicker';

/**
 * Asks once for the user's country when their account has none: accounts made before
 * the country was asked (including sign-ups from older app versions). "Not now" hides it until the app is next opened.
 */
export const CountryPrompt = () => {
  const { auth, setAuth } = useAuth();
  const axios = useAxiosPrivate();
  const [visible, setVisible] = useState(false);
  const [country, setCountry] = useState<string | null>(deviceCountry());
  const [saving, setSaving] = useState(false);
  const userId = auth?.user?.Id;
  const known = !!auth?.user?.Country;

  useEffect(() => {
    if (!userId || known) return;
    let cancelled = false;
    // The saved login may predate a country set on another device: check the account first
    axios.get(`${API}/user/get/${userId}`)
      .then((response) => {
        if (cancelled) return;
        const saved = response.data?.data?.Country;
        if (saved) setAuth((prev) => ({ ...prev, user: { ...prev?.user, Country: saved } }));
        else setVisible(true);
      })
      .catch(() => { /* offline or session issue: ask another time */ });
    return () => { cancelled = true; };
  }, [userId, known]);

  const save = async () => {
    if (!country || !userId) return;
    setSaving(true);
    try {
      const response = await axios.patch(`${API}/user/update/${userId}`, { Country: country });
      if (!response.data?.data) throw new Error(response.data?.message);
      setAuth((prev) => ({ ...prev, user: { ...prev?.user, Country: country } }));
      setVisible(false);
      showMessage('Thanks! Your country has been saved.', ToastType.success);
    } catch (error: any) {
      showMessage(error?.response?.data?.message || 'Could not save your country. Please try again.', ToastType.error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
      <S.View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
        <S.View className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm">
          <S.Text className="text-xl font-pbold text-gray-800 dark:text-slate-100 mb-1">Where are you based?</S.Text>
          <S.Text className="text-gray-600 dark:text-slate-300 font-pregular mb-5 leading-5">
            Pick your country so we can improve RTM for learners where you are. You can change it later in Edit Profile.
          </S.Text>
          <CountryPicker Text="Country" Value={country} OnChange={setCountry} />
          <S.TouchableOpacity
            onPress={save}
            disabled={!country || saving}
            accessibilityRole="button"
            className={`h-12 rounded-lg items-center justify-center mt-1 ${!country || saving ? 'bg-blue-300' : 'bg-blue-700'}`}
          >
            <S.Text className="text-white font-pbold">{saving ? 'Saving...' : 'Save'}</S.Text>
          </S.TouchableOpacity>
          <S.TouchableOpacity onPress={() => setVisible(false)} disabled={saving} accessibilityRole="button" className="h-11 items-center justify-center mt-2">
            <S.Text className="text-gray-500 dark:text-slate-400 font-pmedium">Not now</S.Text>
          </S.TouchableOpacity>
        </S.View>
      </S.View>
    </Modal>
  );
};
