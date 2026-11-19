import * as S from '@/styles'
import { SFC, TabIconProps } from '@/types';
import React from 'react';

export const TabIcon: SFC<TabIconProps> = ({ Icon, Color, Name, Focused }) => {
    return (
        <>
        <S.View className="flex items-center justify-center p-2 w-[110px] h-[60px]">
            <S.Image source={Icon} resizeMode="contain" className="w-8 h-8 mb-1.0" style={{ tintColor: Color }} />
            <S.Text className={`${Focused ? 'font-pmedium' : 'font-pregular'} text-center`} style={{color: Color, marginTop: 4, fontSize: 13}} numberOfLines={1}>
                {Name}
            </S.Text>
        </S.View>
        </>
    );
  };