import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';
import { forgotPasswordValidator, resetPasswordValidator } from '@/validators';
import { SFC, ToastType } from '@/types';
import { CustomInput, PasswordInput, TouchableButton } from '@/components/FormInputs';
import * as S from '@/styles';
import { RoutesChannel } from '@/constants';
import { showMessage } from '@/shared';
import { authApi } from "@/services/api";
import { errorMessageFrom } from "@/utils/errors";

const Notice: SFC<{ Kind: 'error' | 'info'; Text: string }> = ({ Kind, Text }) => (
  <S.View className={`w-full mb-4 p-3 border rounded-lg ${Kind === 'error' ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800' : 'bg-blue-50 dark:bg-slate-800 border-blue-200 dark:border-slate-700'}`}>
    <S.Text className={`text-sm font-pregular ${Kind === 'error' ? 'text-red-700 dark:text-red-300' : 'text-blue-800 dark:text-blue-200'}`}>{Text}</S.Text>
  </S.View>
);

// Two steps: 1) email → a 6-digit code is sent; 2) code + new password.
export const ForgotPasswordForm: SFC = ({ ClassName }) => {
  const router = useRouter();
  const [resetToken, setResetToken] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [info, setInfo] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const emailForm = useForm({ resolver: yupResolver(forgotPasswordValidator) });
  const resetForm = useForm({ resolver: yupResolver(resetPasswordValidator) });

  const requestCode = async (data: any) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const Email = String(data.Email ?? '').trim().toLowerCase();
      const response = await authApi.forgotPassword(Email);
      setEmail(Email);
      setResetToken(response.data?.resetToken ?? '');
      setInfo(response.message ?? 'If an account exists for that email, a 6-digit code has been sent.');
    } catch (error: any) {
      setErrorMessage(errorMessageFrom(error));
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (data: any) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await authApi.resetPassword(resetToken, String(data.Code ?? '').trim(), data.Password);
      showMessage(response.message ?? 'Your password has been reset.', ToastType.success);
      router.replace(RoutesChannel.SIGN_IN);
    } catch (error: any) {
      setErrorMessage(errorMessageFrom(error));
    } finally {
      setIsLoading(false);
    }
  };

  const startOver = () => {
    setResetToken('');
    setInfo('');
    setErrorMessage('');
    resetForm.reset();
  };

  if (!resetToken) {
    return (
      <S.View className={ClassName}>
        {errorMessage ? <Notice Kind="error" Text={errorMessage} /> : null}
        <Controller
          name="Email"
          control={emailForm.control}
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              ClassName="mb-3"
              Text="Email"
              Placeholder="(e.g. juan.delacruz@gmail.com)"
              Value={value}
              OnChange={onChange}
              OnBlur={onBlur}
              Errors={emailForm.formState.errors.Email?.message}
              KeyboardType="email-address"
              AutoCapitalize="none"
              AutoCorrect={false}
              AutoComplete="email"
              TextContentType="emailAddress"
              ReturnKeyType="send"
            />
          )}
        />
        <TouchableButton
          ClassName="mt-3 mb-2"
          OnPress={emailForm.handleSubmit(requestCode)}
          Text={isLoading ? 'Sending code...' : 'Send code'}
          BgStyle={isLoading ? 'bg-blue-400 mt-5' : 'bg-blue-700 mt-5'}
          TextStyle="text-white font-pbold"
          Disabled={isLoading}
        />
      </S.View>
    );
  }

  return (
    <S.View className={ClassName}>
      {info ? <Notice Kind="info" Text={`${info} (${email})`} /> : null}
      {errorMessage ? <Notice Kind="error" Text={errorMessage} /> : null}
      <Controller
        name="Code"
        control={resetForm.control}
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            ClassName="mb-3"
            Text="6-digit code"
            Placeholder="123456"
            Value={value}
            OnChange={onChange}
            OnBlur={onBlur}
            Errors={resetForm.formState.errors.Code?.message}
            KeyboardType="number-pad"
            AutoCapitalize="none"
            AutoCorrect={false}
            AutoComplete="one-time-code"
            TextContentType="oneTimeCode"
          />
        )}
      />
      <Controller
        name="Password"
        control={resetForm.control}
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            ClassName="mb-3 border"
            Text="New Password"
            Value={value}
            OnChange={onChange}
            OnBlur={onBlur}
            Errors={resetForm.formState.errors.Password?.message}
          />
        )}
      />
      <Controller
        name="ConfirmPassword"
        control={resetForm.control}
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            ClassName="mb-3 border"
            Text="Confirm New Password"
            Value={value}
            OnChange={onChange}
            OnBlur={onBlur}
            Errors={resetForm.formState.errors.ConfirmPassword?.message}
          />
        )}
      />
      <TouchableButton
        ClassName="mt-3 mb-2"
        OnPress={resetForm.handleSubmit(resetPassword)}
        Text={isLoading ? 'Resetting...' : 'Reset password'}
        BgStyle={isLoading ? 'bg-blue-400 mt-5' : 'bg-blue-700 mt-5'}
        TextStyle="text-white font-pbold"
        Disabled={isLoading}
      />
      <S.Text
        className="text-sm font-pregular text-slate-500 dark:text-slate-400 text-center mt-2"
        onPress={startOver}
        accessibilityRole="button"
      >
        Didn't get a code? Send a new one
      </S.Text>
    </S.View>
  );
};
