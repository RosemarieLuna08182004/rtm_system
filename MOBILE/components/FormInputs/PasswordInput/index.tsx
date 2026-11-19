import { InputProps, SFC } from "@/types";
import React from "react";
import * as S from '@/styles'
import { useToggle } from "@/hooks";
import { VisibilityIcon, VisibilityOffIcon } from "@/constants";

export const PasswordInput: SFC<InputProps> = ({ Text = 'Password', Value, OnChange, Errors, OnBlur }) => {
    const [showPassword, toggleShowPassword] = useToggle(false);
    const [isFocused, setIsFocused] = React.useState(false);

    return (
        <S.View className="mb-4">
            <S.Text className='text-gray-700 text-medium font-pmedium mb-1.5'>{Text}</S.Text>
            <S.View 
                className={`w-full h-14 px-4 rounded-lg border-2 flex flex-row items-center 
                    ${Errors ? 'border-red-500 bg-red-50' : 
                      isFocused ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
            >
                <S.TextInput
                    className="flex-1 text-gray-800 font-pregular text-base leading-5 h-full py-0 m-0"
                    style={{ textAlignVertical: 'center' }}
                    placeholderTextColor="#9CA3AF"
                    value={Value}
                    onChangeText={OnChange}
                    onBlur={(e) => {
                        setIsFocused(false);
                        OnBlur?.(e);
                    }}
                    onFocus={() => setIsFocused(true)}
                    secureTextEntry={!showPassword}
                    selectionColor="#3B82F6" // blue-500
                />
                <S.TouchableOpacity 
                    onPress={toggleShowPassword} 
                    className="ml-2 p-2 -mr-2"
                    activeOpacity={0.7}
                >
                    <S.Image 
                        source={showPassword ? VisibilityIcon : VisibilityOffIcon} 
                        className="w-5 h-5"
                        tintColor={isFocused ? '#3B82F6' : '#6B7280'}
                    />
                </S.TouchableOpacity>
            </S.View>
            {Errors && (
                <S.View className="flex-row items-center mt-1.5 ml-1">
                    <S.View className="w-3 h-3 bg-red-500 rounded-full items-center justify-center mr-1.5">
                        <S.Text className="text-white text-xs font-pbold" style={{ fontSize: 8 }}>!</S.Text>
                    </S.View>
                    <S.Text className="text-red-600 text-xs font-pmedium flex-1">
                        {Errors}
                    </S.Text>
                </S.View>
            )}
        </S.View>
    )
}