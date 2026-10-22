import React from "react"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import Constants from "expo-constants"
import * as S from '@/styles'
import { FadeInItem } from "@/components/Motion"
import { GradientHeader } from "@/components/Containers/GradientHeader"
import { RequireAuth, usePreferences, useThemeColors } from "@/context"
import { RLogoIcon, RoutesChannel } from "@/constants"
import { IconName } from "@/utils/subjectStyle"

const appVersion = Constants.expoConfig?.version

const FEATURES: { icon: IconName; title: string; text: string }[] = [
	{ icon: 'puzzle-outline', title: 'Word parts', text: 'Every term split into roots, prefixes and suffixes, each with its meaning.' },
	{ icon: 'sitemap', title: 'Explore by root', text: 'Tap a root to see all the other terms built from it.' },
	{ icon: 'volume-high', title: 'Pronunciation', text: 'Hear a term, or any single part of it, read aloud.' },
	{ icon: 'magnify', title: 'Smart search', text: 'Search every volume at once, even with small spelling mistakes.' },
	{ icon: 'bookmark-outline', title: 'Bookmarks & notes', text: 'Save terms to review later and add your own memory tips.' },
	{ icon: 'eye-outline', title: 'Comfort', text: 'Larger text, pinch-to-zoom on any screen and a dark mode.' },
	{ icon: 'widgets-outline', title: 'Home-screen widget', text: 'A term of the day and your last term, right on your home screen.' },
]

interface LinkProps {
	icon: IconName
	title: string
	onPress: () => void
}

const LinkRow: React.FC<LinkProps> = ({ icon, title, onPress }) => {
	const theme = useThemeColors()
	return (
	<S.TouchableOpacity
		onPress={onPress}
		activeOpacity={0.85}
		className="flex-row items-center px-4 py-4 border-b border-slate-100 dark:border-slate-800"
		accessibilityRole="button"
		accessibilityLabel={title}
	>
		<MaterialCommunityIcons name={icon} size={22} color={theme.icon} />
		<S.Text className="flex-1 ml-3 text-base font-pmedium text-blue-950 dark:text-slate-100">{title}</S.Text>
		<MaterialCommunityIcons name="chevron-right" size={22} color={theme.iconMuted} />
	</S.TouchableOpacity>
	)
}

// What the app is, what it does, and where to find more.
export default function AboutScreen() {
	const router = useRouter()
	const insets = useSafeAreaInsets()
	const { isDark } = usePreferences()
	const shadow = { shadowColor: '#1e3a8a', shadowOpacity: 0.07, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2 }

	return (
		<RequireAuth>
			<S.View className="flex-1 bg-slate-50 dark:bg-slate-950">
				<GradientHeader title="About the app" subtitle="Roots and Morphology" icon="information-outline" />
				<S.ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 20, paddingBottom: insets.bottom + 30 }}>
					{/* App card */}
					<FadeInItem index={0}>
						<S.View className="items-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6" style={shadow}>
							<S.View className="h-24 w-24 rounded-3xl items-center justify-center bg-blue-50 dark:bg-slate-800">
								<S.Image source={RLogoIcon} className="w-16 h-16" resizeMode="contain" accessibilityLabel="Roots and Morphology logo" />
							</S.View>
							<S.Text className="mt-4 text-2xl font-pbold text-blue-950 dark:text-slate-100 text-center">Roots & Morphology</S.Text>
							<S.Text className="text-sm font-pregular text-slate-500 dark:text-slate-400">Learn Smarter. Grow Faster.</S.Text>
							{!!appVersion && (
								<S.View className="mt-3 px-3 py-1 rounded-full bg-blue-50 dark:bg-slate-800">
									<S.Text className="text-xs font-psemibold text-blue-700 dark:text-blue-300">Version {appVersion}</S.Text>
								</S.View>
							)}
							<S.Text className="mt-4 text-sm font-pregular leading-5 text-slate-600 dark:text-slate-300 text-center">
								Roots and Morphology helps students learn medical and anatomy terms by understanding how they are built.
								Instead of memorising each word, you learn the roots, prefixes and suffixes behind it, and can then work out
								the meaning of new terms on your own.
							</S.Text>
						</S.View>
					</FadeInItem>

					{/* Features */}
					<S.Text className="mt-6 mb-2 ml-1 text-sm uppercase tracking-wider font-pbold text-blue-700 dark:text-blue-300" accessibilityRole="header">
						What you can do
					</S.Text>
					{FEATURES.map((feature, i) => (
						<FadeInItem key={feature.title} index={i + 1}>
							<S.View className="flex-row items-center mb-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800" style={shadow}>
								<S.View className="h-11 w-11 rounded-xl items-center justify-center bg-blue-50 dark:bg-slate-800">
									<MaterialCommunityIcons name={feature.icon} size={22} color={isDark ? '#93c5fd' : '#1d4ed8'} />
								</S.View>
								<S.View className="flex-1 ml-3">
									<S.Text className="text-base font-psemibold text-blue-950 dark:text-slate-100">{feature.title}</S.Text>
									<S.Text className="text-sm font-pregular text-slate-500 dark:text-slate-400">{feature.text}</S.Text>
								</S.View>
							</S.View>
						</FadeInItem>
					))}

					{/* More */}
					<S.Text className="mt-6 mb-2 ml-1 text-sm uppercase tracking-wider font-pbold text-blue-700 dark:text-blue-300" accessibilityRole="header">
						More
					</S.Text>
					<S.View className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden" style={shadow}>
						<LinkRow icon="account-outline" title="About the author" onPress={() => router.push('/?showOnboarding=true')} />
						<LinkRow icon="help-circle-outline" title="Help & FAQ" onPress={() => router.push(RoutesChannel.FAQ)} />
						<LinkRow icon="file-document-outline" title="Terms and Conditions" onPress={() => router.push(RoutesChannel.TERMS_AND_CONDITIONS)} />
					</S.View>

					<S.Text className="mt-8 text-center text-sm font-pregular text-slate-400 dark:text-slate-500">
						© {new Date().getFullYear()} Roots and Morphology. All rights reserved.
					</S.Text>
				</S.ScrollView>
			</S.View>
		</RequireAuth>
	)
}
