import { SFC, TouchableButtonProps } from "@/types"
import React from "react"
import * as S from '@/styles'

export const TouchableButton: SFC<TouchableButtonProps> = ({ClassName, OnPress, Text, BgStyle='', TextStyle='', IsLoading = false, Icon, Disabled}) => {
    return (
        <>
        <S.TouchableOpacity className={` ${ClassName} ${BgStyle} w-full h-14 flex justify-center items-center rounded-lg p-3 mb-3  ${IsLoading?' opacity-50 ':''} `} onPress={OnPress} disabled={IsLoading || Disabled}>
            <S.View className="flex flex-row justify-center items-center gap-2">
                {Icon && <S.Image source={Icon} className="w-[30px] h-[30px]"/> }
                <S.Text className={`${TextStyle}` }>{Text}</S.Text>
            </S.View>
        </S.TouchableOpacity>    
        </>
    )
}