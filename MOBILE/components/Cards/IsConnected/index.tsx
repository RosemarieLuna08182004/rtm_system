import { SFC } from "@/types";
import React from "react";
import * as S from '@/styles'
import { NoWifi } from "@/constants";

export const IsConnectedCard :SFC = ({ClassName}) => {
    return (
        <>
        <S.View className={`${ClassName} flex justify-center items-center w-screen h-full bg-slate-100 dark:bg-slate-950 p-3`}>
            <S.View className="flex flex-col justify-center items-center">
                <S.View>
                    <S.Image source={NoWifi} className={`w-20 h-20`} tintColor={S.colors.palette.neutral['300']}/>
                </S.View>
                <S.Text className="text-xl font-bold text-gray-700 dark:text-slate-200"> No Internet Connection </S.Text>
                <S.Text className="text-[13px] text-gray-500 dark:text-slate-400 mt-1"> Please connect to the internet to continue. </S.Text>
            </S.View>
        </S.View>
        </>
    )
}