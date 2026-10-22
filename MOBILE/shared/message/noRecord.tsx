import React from 'react';
import * as S from '@/styles'
import { NoRecordsFoundProps, SFC } from '@/types';

export const NoRecordsFound: SFC<NoRecordsFoundProps> = ({
  ClassName,
  title,
  message,
  buttonText,
  onPress,
  icon,
}) => {
    return (
      <>
      <S.View className={`${ClassName} flex justify-center items-center p-5`}>
        <S.View className='p-2 flex flex-col items-center justify-center'>
          {icon && <S.Image source={icon} className='w-24 h-24 mb-6' tintColor={S.colors.palette.neutral['300']}/> }
          <S.Text className='text-gray-600 dark:text-slate-300 font-bold text-lg'>{title}</S.Text>
          {message && (
            <S.Text className=' text-gray-500 dark:text-slate-400 text-center mb-6 mt-2 border'>
              {message}
            </S.Text>
          )}
          {buttonText && (
            <S.TouchableOpacity
              onPress={onPress}
              className='bg-gray-200 dark:bg-slate-700 rounded-lg px-6 py-3 border border-gray-300 dark:border-slate-700'
            >
              <S.Text className={'text-gray-700 dark:text-slate-200 font-medium'}>{buttonText}</S.Text>
            </S.TouchableOpacity>
          )}
        </S.View>
      </S.View>
      </>
    )
}
