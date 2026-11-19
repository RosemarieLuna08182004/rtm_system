import React, { useState } from 'react'
import { useAuth } from "@/hooks"
import * as S from '@/styles'
import { Error, ErrorTitle, } from "@/shared"
import { imageInitial } from "@/types"
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { API, RoutesChannel } from "@/constants";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editProfileValidator } from "@/validators";
import { useRouter } from "expo-router";
// Profile picture editing disabled - backend support not available
// import * as ImagePicker from 'expo-image-picker'
// import * as FileSystem from 'expo-file-system';
import { CustomInput } from '../../FormInputs/CustomInput'
import { TouchableButton } from '../../FormInputs/TouchableButton'
import { CountryPicker } from '../../FormInputs/CountryPicker'
import { Alert } from 'react-native'

export const EditProfileForm = ({ClassName}) => {
  const {auth,setAuth} = useAuth();
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(editProfileValidator),
		defaultValues: {
      Name: auth?.user?.Name || '',
      Email: auth?.user?.Email || '',
      Country: auth?.user?.Country || undefined,
    }
  });
	const axios = useAxiosPrivate();
	const imageSource = auth?.user?.ProfilePhoto 
	? { uri: auth?.user?.ProfilePhoto } 
	: { uri: imageInitial.avatarUrl };

	// Profile picture editing functions disabled - backend support not available
	// const saveImageToFileSystem = async (imageUri: string) => {
	// 	try {
	// 		const filename = imageUri.split('/').pop();
	// 		const newPath = FileSystem.documentDirectory + filename;
	// 		await FileSystem.moveAsync({
	// 			from: imageUri,
	// 			to: newPath,
	// 		});
	// 		return newPath;
	// 	} catch (error) {
	// 		return null;
	// 	}
	// };

	// const pickImage = async () => {
	// 	const result = await ImagePicker.launchImageLibraryAsync({
	// 		mediaTypes: ImagePicker.MediaTypeOptions.Images,
	// 		allowsEditing: true,
	// 		aspect: [1, 1],
	// 		quality: 1,
	// 	});
	// 	if (!result.canceled) {
	// 		const localUri = result.assets[0].uri;
	// 		const savedImageUri = await saveImageToFileSystem(localUri);
	// 		if (savedImageUri) {
	// 			setAuth((prevAuth) => ({ 
	// 				...prevAuth, 
	// 				user: { ...prevAuth.user, ProfilePhoto: savedImageUri }
	// 			}))
	// 		} else {
	// 			Alert.alert(ErrorTitle.m0002, Error.m0001)
	// 		}
	// 	}
	// };

	const onSubmit = async (data:any) => {
		setIsSubmitting(true);
		try{
			const response = await axios.patch(`${API}/user/update/${auth?.user?.Id}`, {
				Name: data.Name,
				Email: data.Email,
				Country: data.Country
			})
			if(response.data.data){
				setAuth((prevAuth) => ({ 
					...prevAuth, 
					user: { ...prevAuth?.user, Name:data.Name, Email:data.Email, Country:data.Country }
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
						/>
					)}
				/>
				<Controller
					name="Country"
					control={control}
					render={({ field: { onChange, value } }) => (
						<CountryPicker
							ClassName="mb-3 w-full"
							Text={'Country'}
							Value={value}
							OnChange={onChange}
							Errors={errors.Country?.message}
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