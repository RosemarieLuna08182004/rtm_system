import React from 'react';
import * as S from '@/styles'
import { SFC } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientText {
    Text:string
}

export const GradientText : SFC<GradientText> = ({ ClassName, Text }) => {
    return (
        <S.View className={`${ClassName} flex justify-start items-center`}>
            <S.MaskedView
                className='h-[34px] w-full'
                maskElement={
                    <S.View className='flex'>
                        <S.Text className='text-3xl font-bold'>{Text}</S.Text>
                    </S.View>
                }
                >
                 <LinearGradient
                    colors={["#1B42CE", "#5177FD"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ flex: 1 }}
                />
            </S.MaskedView>
        </S.View>
    );
  };