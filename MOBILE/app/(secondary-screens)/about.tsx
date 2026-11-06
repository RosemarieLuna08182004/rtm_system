import React from "react"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import Constants from "expo-constants"
import * as S from '@/styles'
import { FadeInItem } from "@/components/Motion"
import { GradientHeader } from "@/components/Containers/GradientHeader"
import { RequireAuth, useThemeColors } from "@/context"
import { RLogoIcon } from "@/constants"

const appVersion = Constants.expoConfig?.version

// What the app is, in Dr. Oliva's words, and a link to the author.
export default function AboutScreen() {
	const router = useRouter()
	const insets = useSafeAreaInsets()
	const theme = useThemeColors()
	const shadow = { shadowColor: '#1d4ed8', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 }

	return (
		<RequireAuth>
			<S.View className="flex-1 bg-slate-50 dark:bg-slate-950">
				<GradientHeader title="About the app" subtitle="Roots and Morphology" icon="information-outline" />
				<S.ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 20, paddingBottom: insets.bottom + 30 }}>
					<FadeInItem index={0}>
						<S.View className="items-center rounded-2xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 p-6" style={shadow}>
							<S.View className="h-24 w-24 rounded-3xl items-center justify-center bg-blue-50 dark:bg-slate-800">
								<S.Image source={RLogoIcon} className="w-16 h-16" resizeMode="contain" accessibilityLabel="Roots and Morphology logo" />
							</S.View>
							<S.Text className="mt-4 text-2xl font-pbold text-blue-950 dark:text-slate-100 text-center">Roots & Morphology</S.Text>
							{!!appVersion && (
								<S.View className="mt-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-slate-800">
									<S.Text className="text-xs font-psemibold text-blue-700 dark:text-blue-300">Version {appVersion}</S.Text>
								</S.View>
							)}
							<S.Text className="mt-5 text-lg font-psemibold italic leading-7 text-blue-800 dark:text-blue-300 text-center">
								“Take a small step back, a giant leap forward to retention and mastery.”
							</S.Text>
							<S.View className="mt-5 h-px w-16 bg-blue-200 dark:bg-slate-700" />
							<S.Text className="mt-5 text-sm font-pregular leading-6 text-slate-700 dark:text-slate-300 text-center">
								Linguistic foundation of <S.Text className="font-pbold text-blue-900 dark:text-slate-100">3000+ Terms</S.Text> (13 systems, here termed{' '}
								<S.Text className="font-pbold text-blue-900 dark:text-slate-100">Volumes</S.Text>). Metaphors, imagery, simile, and literal translations of{' '}
								<S.Text className="font-pbold text-blue-900 dark:text-slate-100">1400+ Greek & Latin Roots</S.Text>.
							</S.Text>
						</S.View>
					</FadeInItem>

					<FadeInItem index={1}>
						<S.TouchableOpacity
							onPress={() => router.push('/?showOnboarding=true')}
							activeOpacity={0.85}
							className="mt-4 flex-row items-center p-4 rounded-2xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800"
							style={shadow}
							accessibilityRole="button"
							accessibilityLabel="About the author and developer"
						>
							<S.View className="h-11 w-11 rounded-xl items-center justify-center bg-blue-700">
								<MaterialCommunityIcons name="account-outline" size={24} color="#ffffff" />
							</S.View>
							<S.Text className="flex-1 ml-3 text-base font-psemibold text-blue-950 dark:text-slate-100">About the author/developer</S.Text>
							<MaterialCommunityIcons name="chevron-right" size={22} color={theme.iconMuted} />
						</S.TouchableOpacity>
					</FadeInItem>

					<S.Text className="mt-8 text-center text-sm font-pregular text-slate-400 dark:text-slate-500">
						© {new Date().getFullYear()} Roots and Morphology. All rights reserved.
					</S.Text>
				</S.ScrollView>
			</S.View>
		</RequireAuth>
	)
}
