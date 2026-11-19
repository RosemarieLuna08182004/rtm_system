import React, { useState, useEffect } from "react"
import * as S from '@/styles'
import { SignUpForm, TouchableButton } from "@/components"
import { useRouter } from "expo-router"
import { RoutesChannel } from "@/constants"
import AuthRedirect from "@/context/AuthRedirect"
import { Image, Platform, Keyboard } from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { BackIcon } from "@/constants/icons"

export default function SignUp() {
    const router = useRouter()
    const [isKeyboardVisible, setKeyboardVisible] = useState(false)

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true)
            }
        )
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false)
            }
        )

        return () => {
            keyboardDidHideListener?.remove()
            keyboardDidShowListener?.remove()
        }
    }, [])

    return (
        <AuthRedirect>
            <S.SafeAreaView className="flex-1 bg-white">
              <KeyboardAwareScrollView
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                enableOnAndroid={true}
                extraHeight={20}
                extraScrollHeight={20}
                enableAutomaticScroll={true}
                resetScrollToCoords={{ x: 0, y: 0 }}
              >
                <S.View className="flex-1 justify-center px-6 py-8">
                  <S.View className="mb-10">
                    <S.Text className="text-3xl font-pbold text-blue-700 mb-1">Create Account</S.Text>
                    <S.Text className="text-gray-500 font-pregular">Start learning Anatomy and Physiology today</S.Text>
                  </S.View>

                  <S.View className="space-y-5">
                    <SignUpForm ClassName="w-full" />
                  </S.View>
                </S.View>
              </KeyboardAwareScrollView>

  {!isKeyboardVisible && (
    <S.View className="absolute top-16 left-6">
      <S.TouchableOpacity 
        className="flex-row items-center"
        onPress={()=>router.push(`${RoutesChannel.INDEX}?showOnboarding=true`)}
      >
        <S.Text className="text-gray-500 font-pregular text-lg mr-2">
          &lt;
        </S.Text>
        <S.Text className="text-gray-500 font-pregular">
          Onboarding
        </S.Text>
      </S.TouchableOpacity>
    </S.View>
  )}

              <S.View className="py-6 border-t border-gray-100">
                <S.Text className="text-center text-gray-600 font-pregular">
                  Already have an account?{' '}
                  <S.Text 
                    className="text-blue-700 font-pbold" 
                    onPress={()=>router.push(RoutesChannel.SIGN_IN)}
                  >
                    Sign in
                  </S.Text>
                </S.Text>
              </S.View>
</S.SafeAreaView>
        </AuthRedirect>
    )
}