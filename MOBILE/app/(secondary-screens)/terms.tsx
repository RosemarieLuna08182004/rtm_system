import React, { useCallback, useMemo, useState } from "react"
import { Alert, Keyboard, RefreshControl } from "react-native"
import { useRouter } from "expo-router"
import { useRoute, useFocusEffect } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { FlashList } from "@shopify/flash-list"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as S from '@/styles'
import { FadeInItem, StateView } from "@/components"
import { BookmarkButton } from "@/components/FormInputs"
import { RequireAuth, usePreferences, useStudy } from "@/context"
import { useAuth, useDebounce, useGetAllTerms, useGetVolume } from "@/hooks"
import { RoutesChannel } from "@/constants"
import { TermStatus } from "@/types"
import { searchItems } from "@/utils/fuzzySearch"
import { subjectStyle } from "@/utils/subjectStyle"

interface TermRow {
	TermId: number
	Term: string
	Status: string
	UserTermsId: number
}

// Terms of one volume (every volume uses this screen).
export default function TermScreen() {
	const router = useRouter()
	const insets = useSafeAreaInsets()
	const { isDark } = usePreferences()
	const { auth } = useAuth()
	const { recent, viewedSet } = useStudy()
	const UserId = useMemo(() => auth?.user?.Id ?? 0, [auth])
	const route: any = useRoute()
	const ChapterId = Number(route.params?.ChapterId ?? 0)
	const { records: volume, refetch: refetchVolume, error: volumeError } = useGetVolume(ChapterId, UserId)
	const { records, refetch: refetchTerms, loading, error: termsError } = useGetAllTerms(ChapterId, UserId)
	const [query, setQuery] = useState('')
	const [descending, setDescending] = useState(false)
	const debounced = useDebounce(query, 150)

	const title = String(volume?.Title ?? '').trim()
	const style = subjectStyle(title)
	const loadError = termsError ?? volumeError

	// Bookmarks can change on other screens, so refresh when coming back here.
	const refetch = useCallback(() => {
		refetchVolume()
		refetchTerms()
	}, [refetchVolume, refetchTerms])
	useFocusEffect(useCallback(() => { refetch() }, [refetch]))

	const terms = useMemo<TermRow[]>(() => {
		const rows = (records as any[]).map((r) => ({
			TermId: Number(r.TermId ?? r.Id),
			Term: String(r.Term ?? '').trim(),
			Status: String(r.Status ?? ''),
			UserTermsId: Number(r.UserTermsId ?? 0),
		})).filter((r) => r.TermId && r.Term)
		return descending ? [...rows].reverse() : rows   // already A→Z from the hook
	}, [records, descending])

	const visible = useMemo(
		() => (debounced.trim() ? searchItems(terms, debounced, (t) => t.Term, 500).map((r) => r.item) : terms),
		[terms, debounced],
	)

	// The term you last opened in this volume is highlighted.
	const lastViewedId = useMemo(() => recent.find((r) => r.ChapterId === ChapterId)?.TermId, [recent, ChapterId])

	const openTerm = (term: TermRow) => {
		if (term.Status === TermStatus.lock) {
			Alert.alert('Locked', `“${term.Term}” isn’t unlocked yet.`)
			return
		}
		router.push({ pathname: RoutesChannel.TERM_LINE, params: { ChapterId, TermId: term.TermId, Term: term.Term, Volume: title } })
	}

	const muted = isDark ? '#64748b' : '#94a3b8'
	const accent = isDark ? '#93c5fd' : '#2563eb'

	const listHeader = (
		<S.View className="pt-6 pb-3">
			<S.View className="flex-row items-center">
				<MaterialCommunityIcons name="book-open-page-variant" size={22} color={accent} />
				<S.Text className="ml-3 text-lg font-pbold tracking-wider text-blue-950 dark:text-slate-100" accessibilityRole="header">
					TERMS <S.Text className="font-pregular text-slate-400 dark:text-slate-500">({terms.length})</S.Text>
				</S.Text>
			</S.View>
			<S.View className="flex-row items-center mt-4">
				<S.View
					className="flex-1 flex-row items-center h-14 px-4 rounded-full bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-700"
					style={{ shadowColor: '#1e3a8a', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 }}
				>
					<MaterialCommunityIcons name="magnify" size={22} color={accent} />
					<S.TextInput
						value={query}
						onChangeText={setQuery}
						placeholder="Search..."
						placeholderTextColor={muted}
						autoCorrect={false}
						autoCapitalize="none"
						returnKeyType="search"
						className="flex-1 ml-3 h-full text-base font-pregular text-slate-800 dark:text-slate-100"
						accessibilityLabel={`Search terms in ${title}`}
					/>
					{!!query && (
						<S.TouchableOpacity onPress={() => setQuery('')} className="p-1" accessibilityRole="button" accessibilityLabel="Clear search">
							<MaterialCommunityIcons name="close-circle" size={20} color={muted} />
						</S.TouchableOpacity>
					)}
				</S.View>
				<S.TouchableOpacity
					onPress={() => setDescending((d) => !d)}
					className="ml-3 h-14 w-14 rounded-full items-center justify-center bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-700"
					accessibilityRole="button"
					accessibilityLabel={descending ? 'Sort A to Z' : 'Sort Z to A'}
				>
					<MaterialCommunityIcons name={descending ? 'sort-alphabetical-descending' : 'filter-variant'} size={22} color={accent} />
				</S.TouchableOpacity>
			</S.View>
		</S.View>
	)

	return (
		<RequireAuth>
			<S.View className="flex-1 bg-slate-50 dark:bg-slate-950">
				{/* Gradient header with the volume's icon */}
				<S.LinearGradient
					colors={['#1e3a8a', '#1d4ed8', '#3b82f6']}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={{ paddingTop: insets.top + 14, paddingBottom: 26, paddingHorizontal: 18, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: 'hidden' }}
				>
					<S.View className="absolute -right-6 -bottom-8 opacity-15" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
						<MaterialCommunityIcons name={style.icon} size={124} color="#ffffff" />
					</S.View>
					<S.View className="flex-row items-center">
						<S.TouchableOpacity
							onPress={() => router.back()}
							className="h-12 w-12 rounded-full items-center justify-center bg-white/15 border border-white/20"
							accessibilityRole="button"
							accessibilityLabel="Go back"
						>
							<MaterialCommunityIcons name="arrow-left" size={24} color="#ffffff" />
						</S.TouchableOpacity>
						<S.View className="flex-1 ml-4 pr-16">
							<S.Text className="text-white text-2xl font-pbold" numberOfLines={2} accessibilityRole="header">{title || 'Terms'}</S.Text>
							<S.Text className="text-blue-100 text-sm font-pregular mt-0.5">Learn  •  Explore  •  Master</S.Text>
						</S.View>
					</S.View>
				</S.LinearGradient>

				{loading && terms.length === 0 ? (
					<StateView Kind="loading" Title="Loading terms..." />
				) : loadError && terms.length === 0 ? (
					<StateView Kind="error" Title="Could not load terms" Message={loadError} OnRetry={refetch} />
				) : (
					<FlashList
						data={visible}
						keyExtractor={(t) => String(t.TermId)}
						ListHeaderComponent={listHeader}
						keyboardShouldPersistTaps="handled"
						onScrollBeginDrag={Keyboard.dismiss}
						contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: insets.bottom + 30 }}
						refreshControl={<RefreshControl refreshing={loading && terms.length > 0} onRefresh={refetch} />}
						ListEmptyComponent={
							debounced
								? <StateView ClassName="py-12" Kind="empty" Title={`No terms match “${debounced}”`} Message="Try a shorter part of the word." ActionLabel="Clear search" OnAction={() => setQuery('')} />
								: <StateView ClassName="py-12" Kind="empty" Icon="book-open-blank-variant" Title="No terms here yet" Message="Terms added to this volume will show up here." />
						}
						extraData={lastViewedId}
						renderItem={({ item, index }) => {
							const highlighted = item.TermId === lastViewedId
							const locked = item.Status === TermStatus.lock
							return (
								<FadeInItem index={index}>
								<S.TouchableOpacity
									onPress={() => openTerm(item)}
									activeOpacity={0.9}
									className="mb-3"
									accessibilityRole="button"
									accessibilityLabel={`${item.Term}${highlighted ? ', last viewed' : ''}${viewedSet.has(item.TermId) ? ', viewed' : ''}${locked ? ', locked' : ''}`}
								>
									<S.LinearGradient
										colors={highlighted ? ['#1e3a8a', '#1d4ed8'] : ['#3b82f6', '#60a5fa']}
										start={{ x: 0, y: 0 }}
										end={{ x: 1, y: 0 }}
										style={{
											borderRadius: 18,
											paddingVertical: 10,
											paddingRight: 12,
											paddingLeft: highlighted ? 8 : 12,
											flexDirection: 'row',
											alignItems: 'center',
											borderLeftWidth: highlighted ? 5 : 0,
											borderLeftColor: '#22d3ee',
											shadowColor: '#1d4ed8',
											shadowOpacity: 0.18,
											shadowRadius: 8,
											shadowOffset: { width: 0, height: 3 },
											elevation: 3,
										}}
									>
										<S.View className="h-12 w-12 rounded-xl items-center justify-center bg-blue-900/40">
											<MaterialCommunityIcons name={locked ? 'lock-outline' : style.icon} size={26} color="#ffffff" />
										</S.View>
										<S.Text className="flex-1 ml-4 text-white text-base font-psemibold" numberOfLines={2}>
											{item.Term}
										</S.Text>
										<MaterialCommunityIcons name="chevron-right" size={24} color="#ffffff" style={{ marginRight: 8 }} />
										<BookmarkButton
											Variant="tile"
											Status={item.Status}
											TermId={item.TermId}
											UserTermsId={item.UserTermsId}
											NoLoading
										/>
									</S.LinearGradient>
								</S.TouchableOpacity>
								</FadeInItem>
							)
						}}
					/>
				)}
			</S.View>
		</RequireAuth>
	)
}
