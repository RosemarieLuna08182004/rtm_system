import React from "react"
import * as S from '@/styles'
import { SecondaryHeader } from "@/components"
import { RequireAuth } from "@/context"
import { Linking } from "react-native"
import { responsiveDimension } from "@/utils"

export default function TermsAndConditionScreen() {
  return (
    <RequireAuth>
      <S.SafeAreaView className="bg-blue-700 py-0">
        <SecondaryHeader title="Terms and Conditions" />
        <S.View className="h-screen bg-slate-100 dark:bg-slate-950 flex items-start justify-start">
          <S.ScrollView
            className="flex-1"
            contentContainerStyle={{
              paddingHorizontal: responsiveDimension(20),
              paddingTop: 24,
              paddingBottom: responsiveDimension(20),
            }}
          >
            <S.Text className="text-2xl font-pbold text-gray-800 dark:text-slate-100 mb-2">
              Terms and Conditions
            </S.Text>

            <S.Text className="text-regular text-gray-600 dark:text-slate-300 mb-6 font-pregular">
              Last updated: August 12, 2025
            </S.Text>

            <S.View className="mb-6">
              <S.Text className="text-lg font-psemibold text-gray-800 dark:text-slate-100 mb-2">
                1. Acceptance of Terms
              </S.Text>
              <S.Text className="text-sm text-gray-600 dark:text-slate-300 text-justify font-pregular">
                By accessing and using the Roots and Morphology application (the “App”), you
                agree to be bound by these Terms and Conditions. If you do not agree with
                these terms, please do not use the App.
              </S.Text>
            </S.View>

            <S.View className="mb-6">
              <S.Text className="text-lg font-psemibold text-gray-800 dark:text-slate-100 mb-2">
                2. Use of Service
              </S.Text>
              <S.Text className="text-sm text-gray-600 dark:text-slate-300 text-justify mb-2 font-pregular">
                The App is designed to help users study and memorize medical terminology,
                with a focus on roots and morphology. You agree to use the App only for
                lawful purposes and in a way that does not infringe the rights of, restrict,
                or inhibit anyone else's use and enjoyment of the App.
              </S.Text>
            </S.View>

            <S.View className="mb-6">
              <S.Text className="text-lg font-psemibold text-gray-800 dark:text-slate-100 mb-2">
                3. User Account
              </S.Text>
              <S.Text className="text-sm text-gray-600 dark:text-slate-300 text-justify mb-2 font-pregular">
                To access certain features of the application, you may be required to create
                an account. You are responsible for maintaining the confidentiality of your
                account information and for all activities that occur under your account.
              </S.Text>
            </S.View>

            <S.View className="mb-6">
              <S.Text className="text-lg font-psemibold text-gray-800 dark:text-slate-100 mb-2">
                4. Intellectual Property
              </S.Text>
              <S.Text className="text-sm text-gray-600 dark:text-slate-300 text-justify mb-2 font-pregular">
                All content, features, and functionality of the App, including but not
                limited to text, graphics, logos, and software (collectively, “Content”),
                are the property of Roots and Morphology or its licensors.
              </S.Text>
            </S.View>

            <S.View className="mb-6">
              <S.Text className="text-lg font-psemibold text-gray-800 dark:text-slate-100 mb-2">
                5. U.S. Copyright Notice
              </S.Text>
              <S.Text className="text-sm text-gray-600 dark:text-slate-300 text-justify mb-2 font-pregular">
                All Content is protected by United States and international copyright laws.
                © {new Date().getFullYear()} Roots and Morphology. All rights reserved. You
                may not copy, reproduce, distribute, modify, create derivative works of,
                publicly display, or publicly perform any Content without our prior written
                permission, except as expressly permitted by applicable law.
              </S.Text>
            </S.View>

            <S.View className="mb-6">
              <S.Text className="text-lg font-psemibold text-gray-800 dark:text-slate-100 mb-2">
                6. Privacy
              </S.Text>
              <S.Text className="text-sm text-gray-600 dark:text-slate-300 text-justify mb-2 font-pregular">
                Your privacy is important to us. Our Privacy Policy explains how we collect,
                use, and protect your personal information. By using our application, you
                agree to the collection and use of information in accordance with our Privacy
                Policy.
              </S.Text>
            </S.View>

            <S.View className="mb-6">
              <S.Text className="text-lg font-psemibold text-gray-800 dark:text-slate-100 mb-2">
                7. Limitation of Liability
              </S.Text>
              <S.Text className="text-sm text-gray-600 dark:text-slate-300 text-justify mb-2 font-pregular">
                Roots and Morphology shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages resulting from your use of or
                inability to use the App. The App is provided "as is" without any warranties,
                express or implied.
              </S.Text>
            </S.View>

            <S.View className="mb-6">
              <S.Text className="text-lg font-psemibold text-gray-800 dark:text-slate-100 mb-2">
                8. Changes to Terms
              </S.Text>
              <S.Text className="text-sm text-gray-600 dark:text-slate-300 text-justify mb-2 font-pregular">
                We reserve the right to modify these terms at any time. We will notify users
                of any changes by updating the "Last updated" date at the top of these terms.
                Your continued use of the application after such modifications constitutes
                your acceptance of the new terms.
              </S.Text>
            </S.View>

            <S.View className="mb-6">
              <S.Text className="text-lg font-psemibold text-gray-800 dark:text-slate-100 mb-2">
                9. Governing Law
              </S.Text>
              <S.Text className="text-sm text-gray-600 dark:text-slate-300 text-justify mb-2 font-pregular">
                These Terms are governed by and construed in accordance with the laws of the
                United States, without regard to its conflict of law principles.
              </S.Text>
            </S.View>

            <S.View className="mb-9 pb-10">
              <S.Text className="text-lg font-psemibold text-gray-800 dark:text-slate-100 mb-2">
                10. Contact Us
              </S.Text>
              <S.Text className="text-sm text-gray-600 dark:text-slate-300 text-justify font-pregular">
                For questions about these Terms and Conditions, contact us at
                <S.Text
                  className="text-blue-700 dark:text-blue-300 underline"
                  onPress={() =>
                    Linking.openURL("mailto:rootsandmorphology@gmail.com")
                  }
                >
                  {" "}
                  rootsandmorphology@gmail.com
                </S.Text>
                .
              </S.Text>
            </S.View>
          </S.ScrollView>
        </S.View>
      </S.SafeAreaView>
    </RequireAuth>
  )
}
