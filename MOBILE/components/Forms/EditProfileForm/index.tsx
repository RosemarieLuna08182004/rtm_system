import React, { useState } from 'react'
import { useAuth } from "@/hooks"
import * as S from '@/styles'
import { Error, ErrorTitle,} from "@/shared"
import { imageInitial } from "@/types"
import { RoutesChannel } from "@/constants"
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { editProfileValidator } from "@/validators"
import { useRouter } from "expo-router"
import { CustomInput } from '../../FormInputs/CustomInput'
import { TouchableButton } from '../../FormInputs/TouchableButton'
import { Alert } from 'react-native'
import { userApi } from "@/services/api"

export const EditProfileForm = ({ClassName}) => {
  const {auth,setAuth} = useAuth();
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(editProfileValidator),
		defaultValues: {
      Name: auth?.user?.Name || '',
      Email: auth?.user?.Email || '',
    }
  });
	const imageSource = auth?.user?.ProfilePhoto 
	? { uri: auth?.user?.ProfilePhoto } 
	: { uri: imageInitial.avatarUrl };

	const onSubmit = async (data:any) => {
		setIsSubmitting(true);
		try{
			const response = await userApi.update(auth?.user?.Id, {
				Name: String(data.Name ?? '').trim(),
				Email: String(data.Email ?? '').trim().toLowerCase()
			})
			if(response.data){
				setAuth((prevAuth) => ({ 
					...prevAuth, 
					user: { ...prevAuth?.user, Name: String(data.Name ?? '').trim(), Email: String(data.Email ?? '').trim().toLowerCase() }
				}))
			}
			router.push(RoutesChannel.PROFILE)
		} catch(error){
			Alert.alert(ErrorTitle.m0002, Error.m0001)
		} finally {
			setIsSubmitting(false);
		}
	}
  return (
    <S.View className={ClassName}>
      <S.View className={'items-center p-3'}>
				{/* Profile picture display only - editing disabled */}
			<S.View className="mb-6">
				<S.Image
						source={imageSource}
						className={'w-24 h-24 rounded-full'}
				/>
			</S.View>
				<Controller
					name="Name"
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<CustomInput
							ClassName="mb-3"
							Text={'Name'} 
							Value={value}
							OnChange={onChange} 
							OnBlur={onBlur} 
							Errors={errors.Name?.message}
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
							Value={value}
							OnChange={onChange} 
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
				<TouchableButton 
					ClassName="mt-5 mb-2" 
					OnPress={handleSubmit(onSubmit)} 
					Text={isSubmitting ? 'Saving...' : 'Save Edit'} 
					BgStyle={isSubmitting ? 'bg-gray-400 mt-5' : 'bg-blue-700 mt-5'} 
					TextStyle='text-white font-pbold'
					Disabled={isSubmitting}
				/>
			</S.View>
    </S.View>
  )
}