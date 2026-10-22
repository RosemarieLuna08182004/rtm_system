import React from 'react';
import * as S from '@/styles';
import { AnimatedSearchProps, SFC } from '@/types';
import { CloseIcon } from '@/constants';

export const AnimatedSearch: SFC<AnimatedSearchProps> = ({ value, onChangeText }) => {
  return (
    <S.View className="relative w-full">
      <S.TextInput
        className="h-12 border-blue-500 border-2 px-4 pr-12 rounded-xl w-full font-pregular bg-white dark:bg-slate-900"
        style={{ textAlignVertical: 'center' }}
        placeholder="Search..."
        accessibilityLabel="Search"
        returnKeyType="search"
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
      />
      {!!value && (
        <S.TouchableOpacity
          onPress={() => onChangeText('')}
          className="absolute right-0 top-0 bottom-0 w-12 justify-center items-center"
          accessibilityLabel="Clear search"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <S.Image source={CloseIcon} className="w-[20px] h-[20px] opacity-60" />
        </S.TouchableOpacity>
      )}
    </S.View>
  );
};
