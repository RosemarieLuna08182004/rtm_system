import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { changePassValidator } from '@/validators';
import { SFC } from '@/types';
import { PasswordInput, TouchableButton } from '@/components/FormInputs';
import * as S from '@/styles';
import { useRouter } from "expo-router";
import { Error, Success } from '@/shared';
import { useAuth } from '@/hooks';
import { authApi, userApi } from "@/services/api";

export const ChangePassForm: SFC = ({ClassName}) => {
  const router = useRouter()
	const { auth } = useAuth();
	const userId = auth?.user?.Id;
	const [errorMessage, setErrorMessage] = useState<string>('')
	const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: yupResolver(changePassValidator)
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setErrorMessage(''); // Clear any previous error messages
    try {
      const { CurrentPass, NewPassword } = data;
			await authApi.verifyPassword(CurrentPass)
      const response = await userApi.update(userId, {Password: NewPassword, CurrentPassword: CurrentPass});
      if(response.data) {
        setErrorMessage(Success.m0006);
        setTimeout(() => {
          router.back(); // Navigate after success message
        }, 1500);
      } else {
        setErrorMessage(response.message);
      }
    } catch (error: any) {
			if(error?.response?.data?.message == 'Password is incorrect') {
				setError('CurrentPass',{type:'manual',message:error.response.data.message})
      } else {
        setErrorMessage(Error.m0007);
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <S.View className={ClassName}>
      <Controller
        name="CurrentPass"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
					<PasswordInput
							ClassName="mb-3 border"
							Text={'Current Password'} 
							Value={value} 
							OnChange={onChange} 
							OnBlur={onBlur} 
							Errors={errors.CurrentPass?.message}
					/>
        )}
      />
      <Controller
        name="NewPassword"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput 
            ClassName="mb-3 border"
            Text={'New Password'} 
            Value={value} 
            OnChange={onChange} 
            OnBlur={onBlur} 
            Errors={errors.NewPassword?.message}
          />
        )}
      />
      <Controller
        name="ConfirmPassword"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput 
            ClassName="mb-3 border"
            Text={'Confirm New Password'} 
            Value={value} 
            OnChange={onChange} 
            OnBlur={onBlur} 
            Errors={errors.ConfirmPassword?.message}
          />
        )}
      />
      { errorMessage && (
        <S.View className={`${errorMessage === Success.m0006 ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'} border rounded-lg p-3 mb-4`}>
          <S.View className="flex-row items-center">
            <S.View className={`w-5 h-5 ${errorMessage === Success.m0006 ? 'bg-green-500' : 'bg-red-500'} rounded-full items-center justify-center mr-2`}>
              <S.Text className="text-white text-xs font-pbold">{errorMessage === Success.m0006 ? '✓' : '!'}</S.Text>
            </S.View>
            <S.Text className={`text-sm ${errorMessage === Success.m0006 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'} font-pmedium flex-1`}>{errorMessage}</S.Text>
          </S.View>
        </S.View>
      )}
      <TouchableButton 
        ClassName="mt-3 mb-2" 
        OnPress={handleSubmit(onSubmit)} 
        Text={isSubmitting ? 'Changing Password...' : 'Change Password'} 
        BgStyle={isSubmitting ? 'bg-gray-400 mt-5' : 'bg-blue-700 mt-5'} 
        TextStyle='text-white font-pbold'
        Disabled={isSubmitting}
      />
    </S.View>
  );
}