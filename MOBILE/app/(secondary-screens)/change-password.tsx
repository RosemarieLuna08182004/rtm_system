import React from "react"
import * as S from '@/styles'
import { ChangePassForm, SecondaryHeader } from "@/components"
import { RequireAuth } from "@/context"

export default function ChangePassword() {
	return (
		<>
		<RequireAuth>
			<S.View className="flex-1 bg-white dark:bg-slate-900">
				<S.SafeAreaView edges={['top']} className="bg-blue-700 py-0">
					<SecondaryHeader title="Change Password"/>
				</S.SafeAreaView>

				<S.ScrollView className="flex-1 px-6 py-6" contentContainerStyle={{ paddingBottom: 30 }}>
					<ChangePassForm ClassName="w-full"/>
				</S.ScrollView>

				<S.SafeAreaView edges={['bottom']} className="bg-white dark:bg-slate-900" />
			</S.View>
		</RequireAuth>
		</>
	)
}
