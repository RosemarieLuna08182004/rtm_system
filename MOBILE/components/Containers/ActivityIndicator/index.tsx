import { SFC } from "@/types";
import * as S from '@/styles'
import React from "react";

interface ActivityIndicatorProps {
    Style?: any
}

export const ActivityIndicator:  SFC<ActivityIndicatorProps> = ({ClassName, Style}) => {
    return (
        <>
            <S.View className={`flex justify-center items-center h-full w-full z-0 ${ClassName}`}>
                <S.ActivityIndicator size="large" color={S.colors.primary} className="" style={Style}/>
            </S.View>
        </>
    )
}