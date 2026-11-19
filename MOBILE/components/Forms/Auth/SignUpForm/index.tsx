import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';
import axios from 'axios';

import { singUpValidator } from '@/validators';
import { AlertType, SFC, ToastType } from '@/types';
import { CountryPicker, CustomInput, PasswordInput, TouchableButton } from '@/components/FormInputs';
import { deviceCountry } from '@/shared/data/countries';
import { ActivityIndicator } from '@/components';
import * as S from '@/styles';
import { API, RoutesChannel } from '@/constants';
import { Error, showMessage, Success } from '@/shared';
import { useAuth } from '@/hooks';
import { getItem, setItem } from '@/utils/asyncStorage';

export const SignUpForm: SFC = ({ClassName}) => {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(singUpValidator),
    // Pre-filled from the phone's region; the user can change it
    defaultValues: { Country: deviceCountry() ?? undefined },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setErrorMessage(''); // Clear previous errors
      const dataToSend = {...data};
      dataToSend.AccountType = 'user';
      
      const response = await axios.post(`${API}/user/add`, dataToSend);
      
      if (response.data) {
        // Auto-login after successful sign-up
        const loginResponse = await axios.post(`${API}/auth/login`, {
          Email: data.Email,
          Password: data.Password
        });

        if (loginResponse.data.data) {
          const { user, accessToken, refreshToken, AccountType } = loginResponse.data.data;
          
          // Save auth data to context and storage
          setAuth({ 
            user, 
            accessToken, 
            roles: AccountType, 
            refreshToken 
          });
          
          // Save tokens to storage
          await setItem('auth', JSON.stringify({
            user,
            accessToken,
            refreshToken,
            roles: AccountType
          }));
          
          // Redirect to home/dashboard
          router.replace(RoutesChannel.HOME);
        } else {
          // If auto-login fails, redirect to sign-in
          showMessage('Account created successfully! Please sign in.', ToastType.success);
          router.replace(RoutesChannel.SIGN_IN);
        }
      } else {
        const errorMsg = response.data?.message || 'Failed to create account. Please try again.';
        setErrorMessage(errorMsg);
        showMessage(errorMsg, ToastType.error);
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'An error occurred. Please try again.';
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
        name="Country"
        control={control}
        render={({ field: { onChange, value } }) => (
          <CountryPicker
            ClassName="mb-3"
            Text="Country"
            Value={value}
            OnChange={onChange}
            Errors={errors.Country?.message}
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
        <S.View className='w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
          <S.View className='flex-row items-center'>
            <S.Text className='text-red-600 font-pregular mr-2'>⚠️</S.Text>
            <S.Text className='text-sm text-red-700 font-pregular flex-1'>{errorMessage}</S.Text>
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