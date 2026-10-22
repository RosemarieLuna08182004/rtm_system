import React from "react"
import * as S from '@/styles'
import { EditProfileForm, SecondaryHeader } from "@/components"
import { RequireAuth } from "@/context"

export default function EditProfile() {
	return (
		<>
		<RequireAuth>
			<S.SafeAreaView className=" bg-blue-700 py-0">
				<SecondaryHeader title="Edit Profile"/>
				<S.View className="h-screen  items-center bg-slate-100 dark:bg-slate-950 flex justify-start">
					<EditProfileForm ClassName="w-full mt-5"/>
				</S.View>
			</S.SafeAreaView>
		</RequireAuth>
		</>
	)
}
