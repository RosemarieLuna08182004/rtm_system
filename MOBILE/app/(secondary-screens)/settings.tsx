import React from "react"
import * as S from '@/styles'
import { SecondaryHeader, SettingsList } from "@/components"
import { RequireAuth } from "@/context"

export default function SettingsScreen() {
	return (
		<>
		<RequireAuth>
			<S.View className="flex-1 bg-slate-100 dark:bg-slate-950">
				<S.SafeAreaView edges={['top']} className="bg-blue-700 py-0">
					<SecondaryHeader title={'Settings'}/>
				</S.SafeAreaView>

				<S.View className="flex-1">
					<S.ScrollView className="flex-1 px-4 py-6" contentContainerStyle={{ paddingBottom: 30 }}>
						<S.Text className="text-base font-pregular text-gray-600 dark:text-slate-300">
							Manage your account and app preferences
						</S.Text>

						<S.View className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm mt-4 overflow-hidden">
							<SettingsList ClassName="w-full"/>
						</S.View>
					</S.ScrollView>
				</S.View>

				<S.SafeAreaView edges={['bottom']} className="bg-slate-100 dark:bg-slate-950" />
			</S.View>
		</RequireAuth>
		</>
	)
}
