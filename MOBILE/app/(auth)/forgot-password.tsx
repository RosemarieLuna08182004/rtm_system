import React from "react"
import * as S from '@/styles'
import { useRouter } from "expo-router"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ForgotPasswordForm } from "@/components/Forms/ForgotPasswordForm"

export default function ForgotPassword() {
    const router = useRouter()

    return (
        <S.SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
            <KeyboardAwareScrollView
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                enableOnAndroid={true}
                extraHeight={20}
                extraScrollHeight={20}
            >
                <S.View className="flex-1 justify-center px-6 py-8">
                    <S.View className="mb-10">
                        <S.Text className="text-3xl font-pbold text-blue-700 dark:text-blue-300 mb-1">Reset Password</S.Text>
                        <S.Text className="text-gray-500 dark:text-slate-400 font-pregular">
                            Enter your email and we'll send you a 6-digit code.
                        </S.Text>
                    </S.View>
                    <ForgotPasswordForm ClassName="w-full" />
                    <S.Text
                        className="text-center text-blue-700 dark:text-blue-300 font-pbold mt-6"
                        onPress={() => router.back()}
                        accessibilityRole="button"
                    >
                        Back to sign in
                    </S.Text>
                </S.View>
            </KeyboardAwareScrollView>
        </S.SafeAreaView>
    )
}
