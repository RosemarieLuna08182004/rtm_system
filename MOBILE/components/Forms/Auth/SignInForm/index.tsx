import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInValidator } from '@/validators';
import { SFC } from '@/types';
import { CustomInput, PasswordInput, TouchableButton } from '@/components/FormInputs';
import * as S from '@/styles';
import { useRouter } from "expo-router";
import { RoutesChannel } from '@/constants';
import { useAuth } from '@/hooks';
import { authApi } from "@/services/api";
import { errorMessageFrom } from "@/utils/errors";

export const SingInForm: SFC = ({ClassName}) => {
  const router = useRouter()
  const { setAuth } = useAuth()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { control, handleSubmit, formState: { errors } } = useForm({resolver: yupResolver(signInValidator)});
  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true)
      setErrorMessage('')
      const response = await authApi.login(String(data.Email ?? '').trim().toLowerCase(), data.Password)
      if (response.data) {
        const { user, accessToken, refreshToken } = response.data;
        setAuth({ user, accessToken, roles: user?.AccountType ? [user.AccountType as any] : [], refreshToken });
        router.replace(RoutesChannel.HOME);
      } else setErrorMessage(response.message)
    } catch (error: any) {
      setErrorMessage(errorMessageFrom(error));
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <S.View className={ClassName}>
      { errorMessage && (
        <S.View className='w-full mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg'>
          <S.View className='flex-row items-center'>
            <S.Text className='text-red-600 font-pregular mr-2'>⚠️</S.Text>
            <S.Text className='text-sm text-red-700 dark:text-red-300 font-pregular flex-1'>{errorMessage}</S.Text>
          </S.View>
        </S.View>
      )}
      <Controller
        name="Email"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput 
            ClassName="mb-3"
            Text={'Email'} 
            Placeholder='(e.g. juan.delacruz@gmail.com)' 
            Value={value} OnChange={onChange} 
            OnBlur={onBlur} 
            Errors={errors.Email?.message}
            KeyboardType="email-address"
            AutoCapitalize="none"
            AutoCorrect={false}
            AutoComplete="email"
            TextContentType="emailAddress"
          />
        )}
      />
      <Controller
        name="Password"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput 
            ClassName="mb-3 border"
            Text={'Password'} 
            Value={value} 
            OnChange={onChange} 
            OnBlur={onBlur} 
            Errors={errors.Password?.message}
          />
        )}
      />
      <S.View>
        <S.Text className='text-sm font-pregular text-slate-500 dark:text-slate-400' onPress={()=>router.push(RoutesChannel.FORGOT_PASSWORD)}>Forgot password?</S.Text>
      </S.View>
      <TouchableButton 
        ClassName="mt-3 mb-2" 
        OnPress={handleSubmit(onSubmit)} 
        Text={isLoading ? 'Signing in...' : 'Sign In'} 
        BgStyle={isLoading ? 'bg-blue-400 mt-5' : 'bg-blue-700 mt-5'} 
        TextStyle='text-white font-pbold' 
        Disabled={isLoading}
      />
    </S.View>
  );
}