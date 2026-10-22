import * as S from '@/styles'
import { SFC, TabIconProps } from '@/types';
import React from 'react';
import { Text } from 'react-native';
import { usePreferences } from '@/context/PreferencesProvider';

export const TabIcon: SFC<TabIconProps> = ({ Icon, Color, Name, Focused }) => {
    const { displayScale } = usePreferences();
    // Plain Text (not S.Text): the label grows with the display size but is capped to fit a 4-tab bar.
    const fontSize = Math.round(12 * Math.min(displayScale, 1.4));
    return (
        <S.View className="flex items-center justify-center w-[84px]">
            <S.Image source={Icon} resizeMode="contain" className="w-7 h-7" style={{ tintColor: Color }} />
            <Text style={{ color: Color, marginTop: 3, fontSize, fontFamily: Focused ? 'Poppins_600SemiBold' : 'Poppins_400Regular', textAlign: 'center' }} numberOfLines={1}>
                {Name}
            </Text>
            {/* Underline under the active tab. */}
            <S.View style={{ marginTop: 4, height: 3, width: 40, borderRadius: 2, backgroundColor: Focused ? Color : 'transparent' }} />
        </S.View>
    );
};
