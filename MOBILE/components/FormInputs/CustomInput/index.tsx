import { InputProps, SFC } from "@/types";
import React from "react";
import * as S from '@/styles'

export const CustomInput: SFC<InputProps> = ({ 
    ClassName, 
    Text = 'NA', 
    Value, 
    OnChange, 
    Placeholder, 
    OnBlur, 
    Errors,
    KeyboardType = 'default',
    AutoCapitalize = 'sentences',
    AutoCorrect = true,
    AutoComplete,
    TextContentType,
    ReturnKeyType = 'next'
}) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
        <S.View className={`mb-4 ${ClassName}`}>
            <S.Text className='text-gray-700 text-medium font-pmedium mb-1.5'>{Text}</S.Text>
            <S.View 
                className={`w-full h-14 px-4 rounded-lg border-2 flex flex-row items-center 
                    ${isFocused ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}
                    ${Errors ? 'border-red-500' : ''}`}
            >
                <S.TextInput
                    className="flex-1 text-gray-800 font-pregular text-base leading-5 h-full py-0 m-0"
                    style={{ textAlignVertical: 'center' }}
                    placeholder={Placeholder}
                    placeholderTextColor="#9CA3AF"
                    value={Value}
                    onChangeText={OnChange}
                    onBlur={(e) => {
                        setIsFocused(false);
                        OnBlur?.(e);
                    }}
                    onFocus={() => setIsFocused(true)}
                    selectionColor="#3B82F6" // blue-500
                    keyboardType={KeyboardType}
                    autoCapitalize={AutoCapitalize}
                    autoCorrect={AutoCorrect}
                    autoComplete={AutoComplete}
                    textContentType={TextContentType}
                    returnKeyType={ReturnKeyType}
                    blurOnSubmit={false}
                />
            </S.View>
            {Errors && (
                <S.Text className="text-red-500 text-xs mt-1.5 ml-1 font-pregular">
                    {Errors}
                </S.Text>
            )}
        </S.View>
    )
}