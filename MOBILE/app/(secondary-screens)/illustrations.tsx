import React, { useState } from "react"
import { RefreshControl, useWindowDimensions } from "react-native"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as S from '@/styles'
import { FadeInItem, StateView } from "@/components"
import { GradientHeader } from "@/components/Containers/GradientHeader"
import ImageZoomViewer from "@/components/ImageZoomViewer"
import { RequireAuth } from "@/context"
import { useApiQuery } from "@/hooks/api/useApiQuery"
import { RoutesChannel } from "@/constants"
import { IllustratedTerm, studyApi } from "@/services/api"
import { dayKey } from "@/utils/termOfTheDay"

const NONE: IllustratedTerm[] = []
const SHADOW = { shadowColor: '#1d4ed8', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 4 }

// Today's illustrations as a grid. Tap a picture to enlarge it, or its name to open the term.
export default function IllustrationsScreen() {
	const router = useRouter()
	const insets = useSafeAreaInsets()
	const { width } = useWindowDimensions()
	const tile = Math.floor((width - 18 * 2 - 14) / 2)
	const [broken, setBroken] = useState<Set<number>>(new Set())
	const { data, loading, error, refetch } = useApiQuery(
		(signal) => studyApi.getIllustrations(20, dayKey(), signal),
		[],
		{ enabled: true, initialData: NONE },
	)
	const items = data.filter((i) => !broken.has(i.TermId))

	const open = (item: IllustratedTerm) =>
		router.push({ pathname: RoutesChannel.TERM_LINE, params: { TermId: item.TermId, ChapterId: item.ChapterId, Term: item.Term, Volume: item.ChapterTitle } })

	return (
		<RequireAuth>
			<S.View className="flex-1 bg-slate-50 dark:bg-slate-950">
				<GradientHeader title="Illustrations" subtitle="A new selection every day" icon="image-multiple-outline" />
				{loading && data.length === 0 ? (
					<StateView Kind="loading" Title="Loading illustrations…" />
				) : error && data.length === 0 ? (
					<StateView Kind="error" Title="Could not load illustrations" Message={error} OnRetry={() => refetch(true)} />
				) : items.length === 0 ? (
					<StateView Kind="empty" Icon="image-off-outline" Title="No illustrations yet" Message="Illustrations from your unlocked volumes will appear here." />
				) : (
					<S.ScrollView
						contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 20, paddingBottom: insets.bottom + 30, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}
						refreshControl={<RefreshControl refreshing={loading && data.length > 0} onRefresh={() => refetch(true)} />}
					>
						{items.map((item, index) => (
							<FadeInItem key={item.TermId} index={index} style={{ width: tile, marginBottom: 18 }}>
								<S.LinearGradient colors={['#1e3a8a', '#2563eb', '#38bdf8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 20, padding: 3, ...SHADOW }}>
									<ImageZoomViewer images={[{ uri: item.Illustration }]} imageIndex={0}>
										<S.View className="rounded-[17px] bg-white p-1.5">
											<S.Image
												source={{ uri: item.Illustration }}
												style={{ width: '100%', height: tile - 12 }}
												resizeMode="contain"
												onError={() => setBroken((prev) => new Set(prev).add(item.TermId))}
												accessibilityLabel={`Illustration of ${item.Term}. Tap to enlarge`}
											/>
										</S.View>
									</ImageZoomViewer>
								</S.LinearGradient>
								<S.TouchableOpacity onPress={() => open(item)} className="flex-row items-center mt-2 px-1" accessibilityRole="button" accessibilityLabel={`Open ${item.Term}`}>
									<S.View className="flex-1">
										<S.Text className="text-sm font-psemibold text-blue-950 dark:text-slate-100" numberOfLines={1}>{item.Term}</S.Text>
										<S.Text className="text-[11px] font-pregular text-slate-500 dark:text-slate-400" numberOfLines={1}>{item.ChapterTitle}</S.Text>
									</S.View>
									<MaterialCommunityIcons name="chevron-right" size={20} color="#2563eb" />
								</S.TouchableOpacity>
							</FadeInItem>
						))}
					</S.ScrollView>
				)}
			</S.View>
		</RequireAuth>
	)
}
