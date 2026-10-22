import React, { useMemo } from "react"
import { useRouter } from "expo-router"
import { useRoute } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as S from '@/styles'
import { TermLineList } from "@/components"
import { BookmarkButton } from "@/components/FormInputs"
import { RequireAuth } from "@/context"
import { useAuth, useGetTerm, useGetVolume } from "@/hooks"
import { subjectStyle } from "@/utils/subjectStyle"

// One term: gradient header (volume, term, bookmark) and its section cards.
export default function TermDetailScreen() {
	const router = useRouter()
	const insets = useSafeAreaInsets()
	const route = useRoute()
	const { auth } = useAuth()
	const { ChapterId, TermId, Term: termParam, Volume: volumeParam }: any = route.params
	const UserId = useMemo(() => Number(auth?.user?.Id ?? 0), [auth])
	const { records: term, refetch: refetchTerm } = useGetTerm(TermId, UserId)
	const { records: chapter, refetch: refetchChapter } = useGetVolume(ChapterId, UserId)

	// Use the names passed from the previous screen until the term finishes loading.
	const volumeTitle = String(chapter?.Title ?? volumeParam ?? '').trim()
	const termName = String(term?.Term ?? termParam ?? '').trim()
	const style = subjectStyle(volumeTitle)

	const fetchData = () => {
		refetchTerm()
		refetchChapter()
	}

	return (
		<RequireAuth>
			<S.View className="flex-1 bg-slate-50 dark:bg-slate-950">
				<S.LinearGradient
					colors={['#1e3a8a', '#1d4ed8', '#3b82f6']}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={{ paddingTop: insets.top + 14, paddingBottom: 26, paddingHorizontal: 18, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: 'hidden' }}
				>
					<S.View className="absolute right-12 -bottom-8 opacity-15" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
						<MaterialCommunityIcons name={style.icon} size={110} color="#ffffff" />
					</S.View>
					<S.View className="flex-row items-center">
						<S.TouchableOpacity
							// Opened from the widget there may be nothing to go back to.
							onPress={() => (router.canGoBack() ? router.back() : router.replace("/home"))}
							className="h-12 w-12 rounded-full items-center justify-center bg-white/15 border border-white/20"
							accessibilityRole="button"
							accessibilityLabel="Go back"
						>
							<MaterialCommunityIcons name="arrow-left" size={24} color="#ffffff" />
						</S.TouchableOpacity>
						<S.View className="flex-1 ml-4 mr-2">
							<S.Text className="text-blue-100 text-sm font-pmedium" numberOfLines={1}>{volumeTitle || ' '}</S.Text>
							<S.Text className="text-white text-2xl font-pbold" numberOfLines={2} accessibilityRole="header">{termName || ' '}</S.Text>
						</S.View>
						{!!term && (
							<BookmarkButton
								Variant="header"
								Status={term.Status ?? 'Unbookmark'}
								TermId={term.TermId ?? 0}
								UserTermsId={term.UserTermsId ?? 0}
							/>
						)}
					</S.View>
				</S.LinearGradient>

				<S.GestureHandlerRootView style={{ flex: 1 }}>
					<TermLineList Refetch={fetchData} />
				</S.GestureHandlerRootView>
			</S.View>
		</RequireAuth>
	)
}
