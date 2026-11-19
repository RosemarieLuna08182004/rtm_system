import React, { useMemo, useState } from 'react';
import { Modal, Platform } from 'react-native';
import * as S from '@/styles';
import { COUNTRIES, countryFlag, Country } from '@/shared/data/countries';

interface CountryPickerProps {
  ClassName?: string;
  Text?: string;
  /** Two-letter code, e.g. "PH" */
  Value?: string | null;
  OnChange: (code: string) => void;
  Errors?: string;
  Placeholder?: string;
}

/**
 * A form field that looks like CustomInput; tapping it opens a searchable list of
 * the Google Play countries (shared/data/countries.ts).
 */
export const CountryPicker = ({ ClassName = '', Text = 'Country', Value, OnChange, Errors, Placeholder = 'Select your country' }: CountryPickerProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = COUNTRIES.find((c) => c.Code === Value);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter((c) => c.Name.toLowerCase().includes(q) || c.Code.toLowerCase() === q);
  }, [query]);

  const close = () => { setOpen(false); setQuery(''); };
  const pick = (country: Country) => { OnChange(country.Code); close(); };

  return (
    <S.View className={`mb-4 ${ClassName}`}>
      <S.Text className="text-gray-700 text-medium font-pmedium mb-1.5">{Text}</S.Text>
      <S.TouchableOpacity
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${Text}: ${selected ? selected.Name : 'not selected'}. Tap to choose.`}
        className={`w-full h-14 px-4 rounded-lg border-2 flex flex-row items-center bg-white ${Errors ? 'border-red-500' : 'border-gray-300'}`}
      >
        {selected ? (
          <S.Text className="flex-1 text-gray-800 font-pregular text-base">{countryFlag(selected.Code)}  {selected.Name}</S.Text>
        ) : (
          <S.Text className="flex-1 font-pregular text-base" style={{ color: '#9CA3AF' }}>{Placeholder}</S.Text>
        )}
        <S.Text className="text-gray-400 text-lg">▾</S.Text>
      </S.TouchableOpacity>
      {Errors ? <S.Text className="text-red-500 text-xs mt-1.5 ml-1 font-pregular">{Errors}</S.Text> : null}

      <Modal visible={open} animationType="slide" onRequestClose={close} presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : undefined}>
        <S.SafeAreaView className="flex-1 bg-white">
          <S.View className="flex-row items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
            <S.Text className="text-xl font-pbold text-gray-800">Select your country</S.Text>
            <S.TouchableOpacity onPress={close} accessibilityRole="button" accessibilityLabel="Close">
              <S.Text className="text-blue-700 font-pmedium text-base">Close</S.Text>
            </S.TouchableOpacity>
          </S.View>
          <S.View className="px-5 py-3">
            <S.TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search countries"
              placeholderTextColor="#9CA3AF"
              autoCorrect={false}
              autoCapitalize="none"
              className="h-12 px-4 rounded-lg border-2 border-gray-300 bg-gray-50 text-gray-800 font-pregular text-base"
            />
          </S.View>
          <S.FlatList
            data={results}
            keyExtractor={(item: Country) => item.Code}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={20}
            renderItem={({ item }: { item: Country }) => {
              const isSelected = item.Code === Value;
              return (
                <S.TouchableOpacity
                  onPress={() => pick(item)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  className={`flex-row items-center px-5 py-3.5 border-b border-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                >
                  <S.Text className="text-2xl mr-3">{countryFlag(item.Code)}</S.Text>
                  <S.Text className={`flex-1 text-base ${isSelected ? 'font-pbold text-blue-700' : 'font-pregular text-gray-800'}`}>{item.Name}</S.Text>
                  {isSelected ? <S.Text className="text-blue-700 text-lg">✓</S.Text> : null}
                </S.TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <S.Text className="text-center text-gray-500 font-pregular mt-10 px-6">
                No match. Only countries where the app is available on Google Play are listed.
              </S.Text>
            }
          />
        </S.SafeAreaView>
      </Modal>
    </S.View>
  );
};
