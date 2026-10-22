import React from 'react';
import * as S from '@/styles'
import { NavigationButtonProps, SFC } from '@/types';
import { BackIcon } from '@/constants';

export const NavigationButton: SFC<NavigationButtonProps> = ({
  ClassName,
  icon,
  title,
  onPress,
  tintColor,
  iconColor = 'text-blue-600 dark:text-blue-400',
  textColor = 'text-gray-700 dark:text-slate-200',
}) => {
  return (
    <>
    <S.View className={ClassName}> 
      <S.TouchableOpacity onPress={onPress} className={'flex-row items-center p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700'} >
          <S.View className='flex flex-row justify-between items-center w-full'>
            <S.View className='flex flex-row items-center justify-center'>
              <S.Image source={icon} className={`w-6 h-6 mr-4 ${iconColor}`} style={{ tintColor: tintColor }} />
              <S.Text className={`text-lg font-pmedium ${textColor}`}>{title}</S.Text>
            </S.View>
            <S.Image source={BackIcon} className={`w-[15px] h-[15px] mr-4 ${iconColor}`} />
          </S.View>
        </S.TouchableOpacity>
    </S.View>
    </>
  );
};