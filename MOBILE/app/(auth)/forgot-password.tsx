import React from "react"
import * as S from '@/styles'
import { useRouter } from "expo-router"
import { TouchableOpacity } from "react-native"

export default function ForgotPassword() {
    const router = useRouter()
    
    return (
        <S.SafeAreaView className="flex-1 bg-white">
            <S.View className="flex-1 justify-center items-center px-6">
                <S.View className="items-center mb-8">
                    <S.Text className="text-6xl mb-4">🚧</S.Text>
                    <S.Text className="text-2xl font-pbold text-blue-700 mb-2 text-center">
                        Under Development
                    </S.Text>
                    <S.Text className="text-gray-500 font-pregular text-center leading-6">
                        The forgot password feature is currently being developed. 
                        Please contact support if you need assistance with your account.
                    </S.Text>
                </S.View>
                
                <TouchableOpacity 
                    className="bg-blue-700 py-3 px-8 rounded-lg"
                    onPress={() => router.back()}
                >
                    <S.Text className="text-white font-pbold text-center">
                        Go Back
                    </S.Text>
                </TouchableOpacity>
            </S.View>
        </S.SafeAreaView>
    )
}