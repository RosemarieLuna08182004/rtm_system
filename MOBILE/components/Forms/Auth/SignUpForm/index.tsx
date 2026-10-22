import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';

import { singUpValidator } from '@/validators';
import { SFC, ToastType } from '@/types';
import { CustomInput, PasswordInput, TouchableButton } from '@/components/FormInputs';
import * as S from '@/styles';
import { RoutesChannel } from '@/constants';
import { showMessage } from '@/shared';
import { useAuth } from '@/hooks';
import { authApi } from "@/services/api";
import { errorMessageFrom } from "@/utils/errors";

export const SignUpForm: SFC = ({ClassName}) => {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(singUpValidator)
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setErrorMessage(''); // Clear previous errors
      const Email = String(data.Email ?? '').trim().toLowerCase();
      const response = await authApi.register({ Name: String(data.Name ?? '').trim(), Email, Password: data.Password });
      
      if (response.data) {
        // Auto-login after successful sign-up
        const loginResponse = await authApi.login(Email, data.Password);

        if (loginResponse.data) {
          const { user, accessToken, refreshToken } = loginResponse.data;
          
          // AuthProvider persists the session (tokens go to secure storage).
          setAuth({
            user,
            accessToken,
            roles: user?.AccountType ? [user.AccountType as any] : [],
            refreshToken
          });
          
          // Redirect to home/dashboard
          router.replace(RoutesChannel.HOME);
        } else {
          // If auto-login fails, redirect to sign-in
          showMessage('Account created successfully! Please sign in.', ToastType.success);
          router.replace(RoutesChannel.SIGN_IN);
        }
      } else {
        const errorMsg = response.message || 'Failed to create account. Please try again.';
        setErrorMessage(errorMsg);
        showMessage(errorMsg, ToastType.error);
      }
    } catch (error: any) {
      const errorMsg = errorMessageFrom(error);
      setErrorMessage(errorMsg);
      showMessage(errorMsg, ToastType.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <S.View className={ClassName}>
      <Controller
        name="Name"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput 
            ClassName="mb-3"
            Text={'Name'} 
            Placeholder='(e.g. Juan dela Cruz)' 
            Value={value} OnChange={onChange} 
            OnBlur={onBlur} 
            Errors={errors.Name?.message}
            KeyboardType="default"
            AutoCapitalize="words"
            AutoCorrect={true}
            AutoComplete="name"
            TextContentType="name"
            ReturnKeyType="next"
          />
        )}
      />
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
            ReturnKeyType="next"
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
      { errorMessage && (
        <S.View className='w-full mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg'>
          <S.View className='flex-row items-center'>
            <S.Text className='text-red-600 font-pregular mr-2'>⚠️</S.Text>
            <S.Text className='text-sm text-red-700 dark:text-red-300 font-pregular flex-1'>{errorMessage}</S.Text>
          </S.View>
        </S.View>
      )}
      <TouchableButton 
        ClassName="mt-3 mb-2" 
        OnPress={handleSubmit(onSubmit)} 
        Text={isLoading ? 'Creating account...' : 'Register'} 
        BgStyle={isLoading ? 'bg-blue-400 mt-5' : 'bg-blue-700 mt-5'} 
        TextStyle='text-white font-pbold' 
        Disabled={isLoading}
      />
    </S.View>
  );
}