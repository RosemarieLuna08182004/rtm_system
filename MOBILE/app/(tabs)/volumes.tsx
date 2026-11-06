import React, { useMemo, useState } from "react"
import { Alert, RefreshControl } from "react-native"
import { useRouter } from "expo-router"
import { FlashList } from "@shopify/flash-list"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as S from '@/styles'
import { FadeInItem, Header, StateView } from "@/components"
import { RequireAuth, usePreferences } from "@/context"
import { useAuth, useGetAllVolumes } from "@/hooks"
import { RoutesChannel } from "@/constants"
import { subjectStyle } from "@/utils/subjectStyle"

interface VolumeRow {
	ChapterId: number
	Title: string
	locked: boolean
	colorIndex: number
}

// All volumes, each with its own icon. Terms are searched inside each volume.
export default function Volumes() {
	const router = useRouter()
	const { isDark } = usePreferences()
	const { auth } = useAuth()
	const UserId = useMemo(() => auth?.user?.Id ?? 0, [auth])
	const { records, refetch, loading, error } = useGetAllVolumes(UserId)
	const [descending, setDescending] = useState(false)

	// One row per volume, A→Z (or Z→A), colour slot fixed by alphabetical position.
	const volumes = useMemo<VolumeRow[]>(() => {
		const seen = new Set<number>()
		const rows = (records as any[])
			.map((r) => ({ ChapterId: Number(r.ChapterId ?? r.Id), Title: String(r.Title ?? '').trim(), locked: r.Status !== 'Unlock' }))
			.filter((r) => r.ChapterId && !seen.has(r.ChapterId) && seen.add(r.ChapterId))
			.sort((a, b) => a.Title.localeCompare(b.Title, 'en', { sensitivity: 'base' }))
			.map((r, index) => ({ ...r, colorIndex: index }))
		return descending ? rows.reverse() : rows
	}, [records, descending])

	const openVolume = (volume: VolumeRow) => {
		if (volume.locked) {
			Alert.alert('Volume locked', `${volume.Title} isn’t unlocked yet.`)
			return
		}
		router.push({ pathname: RoutesChannel.TERM, params: { ChapterId: volume.ChapterId } })
	}

	const muted = isDark ? '#64748b' : '#94a3b8'

	const listHeader = (
		<S.View className="pt-6 pb-4 flex-row items-center">
			<S.Text className="flex-1 text-lg font-pbold tracking-wider text-blue-950 dark:text-slate-100" accessibilityRole="header">
				VOLUMES <S.Text className="font-pregular text-slate-400 dark:text-slate-500">({volumes.length})</S.Text>
			</S.Text>
			<S.TouchableOpacity
				onPress={() => setDescending((d) => !d)}
				className="h-11 w-11 rounded-full items-center justify-center bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-700"
				accessibilityRole="button"
				accessibilityLabel={descending ? 'Sort A to Z' : 'Sort Z to A'}
			>
				<MaterialCommunityIcons name={descending ? 'sort-alphabetical-descending' : 'sort-alphabetical-ascending'} size={22} color={muted} />
			</S.TouchableOpacity>
		</S.View>
	)

	return (
		<RequireAuth>
			<S.View className="flex-1 bg-blue-700 pt-12">
				<Header ClassName="z-90" title="Volumes" />
				<S.View className="flex-1 bg-slate-50 dark:bg-slate-950">
					{loading && volumes.length === 0 ? (
						<StateView Kind="loading" Title="Loading volumes..." />
					) : error && volumes.length === 0 ? (
						<StateView Kind="error" Title="Could not load volumes" Message={error} OnRetry={() => refetch()} />
					) : (
						<FlashList
							data={volumes}
							keyExtractor={(v) => String(v.ChapterId)}
							ListHeaderComponent={listHeader}
							keyboardShouldPersistTaps="handled"
							contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 30 }}
							refreshControl={<RefreshControl refreshing={loading && volumes.length > 0} onRefresh={() => refetch()} />}
							ListEmptyComponent={
								<StateView ClassName="py-12" Kind="empty" Icon="bookshelf" Title="No volumes yet" Message="Volumes will appear here once they’re available." OnAction={() => refetch()} ActionLabel="Refresh" />
							}
							renderItem={({ item, index }) => {
								const style = subjectStyle(item.Title, item.colorIndex)
								return (
									<FadeInItem index={index}>
									<S.TouchableOpacity
										onPress={() => openVolume(item)}
										activeOpacity={0.85}
										className="flex-row items-center mb-3 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
										style={{ shadowColor: '#1e3a8a', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 }}
										accessibilityRole="button"
										accessibilityLabel={`${item.Title}${item.locked ? ', locked' : ''}`}
									>
										<S.View className={`h-12 w-12 rounded-full items-center justify-center ${style.tile}`}>
											<MaterialCommunityIcons name={style.icon} size={24} color={style.iconColor} />
										</S.View>
										<S.Text
											className={`flex-1 ml-4 text-base font-psemibold ${item.locked ? 'text-slate-400 dark:text-slate-500' : 'text-blue-950 dark:text-slate-100'}`}
											numberOfLines={2}
										>
											{item.Title}
										</S.Text>
										<MaterialCommunityIcons name={item.locked ? 'lock-outline' : 'chevron-right'} size={24} color={muted} />
									</S.TouchableOpacity>
									</FadeInItem>
								)
							}}
						/>
					)}
				</S.View>
			</S.View>
		</RequireAuth>
	)
}
