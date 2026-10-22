import React, { useEffect, useMemo } from "react"
import { Alert, RefreshControl } from "react-native"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as S from '@/styles'
import { FadeInItem, StateView } from "@/components"
import { pickForDay } from "@/utils/termOfTheDay"
import { syncWidget } from "@/widgets/sync"
import { RequireAuth, usePreferences, useStudy, useThemeColors } from "@/context"
import { useAuth, useTermIndex } from "@/hooks"
import { RLogoWhiteIcon, RoutesChannel } from "@/constants"
import { IndexChapter, IndexTerm, NewTerm, studyApi, termApi } from "@/services/api"
import { TermLineTables } from "@/types"
import { useApiQuery } from "@/hooks/api/useApiQuery"
import { parseWordBreakdown } from "@/utils/morphology"
import { IconName, subjectStyle } from "@/utils/subjectStyle"

// Same term for everyone on a given day, different each day.
const termOfTheDay = (terms: IndexTerm[], unlockedChapters: Set<number>): IndexTerm | undefined =>
	pickForDay(terms.filter((t) => unlockedChapters.has(t.ChapterId)))

const DAY_MS = 24 * 60 * 60 * 1000
const NEW_FOR_DAYS = 30
const NO_NEW_TERMS: NewTerm[] = []
const NO_SUBTERMS: TermLineTables = []

// "today", "yesterday", "5 days ago", or a date for older terms.
const addedLabel = (date: string): string => {
	const time = new Date(date).getTime()
	if (!Number.isFinite(time)) return ''
	const days = Math.floor((Date.now() - time) / DAY_MS)
	if (days <= 0) return 'Added today'
	if (days === 1) return 'Added yesterday'
	if (days < 14) return `Added ${days} days ago`
	return `Added ${new Date(time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
}
const isRecent = (date: string) => Date.now() - new Date(date).getTime() <= NEW_FOR_DAYS * DAY_MS

const SectionTitle: React.FC<{ title: string; action?: string; onAction?: () => void }> = ({ title, action, onAction }) => {
	const theme = useThemeColors()
	return (
	<S.View className="flex-row items-center justify-between mb-3 mt-7">
		<S.Text className="text-xs uppercase tracking-wider font-pbold text-slate-600 dark:text-slate-400" accessibilityRole="header">{title}</S.Text>
		{!!action && (
			<S.TouchableOpacity onPress={onAction} className="flex-row items-center" accessibilityRole="button" accessibilityLabel={action}>
				<S.Text className="text-sm font-psemibold text-blue-700 dark:text-blue-300 mr-1">{action}</S.Text>
				<MaterialCommunityIcons name="arrow-right" size={16} color={theme.icon} />
			</S.TouchableOpacity>
		)}
	</S.View>
	)
}

// Rounded icon square used in the lists.
const IconTile: React.FC<{ icon: IconName; color: string; tile: string; size?: number }> = ({ icon, color, tile, size = 22 }) => (
	<S.View className={`h-11 w-11 rounded-xl items-center justify-center ${tile}`}>
		<MaterialCommunityIcons name={icon} size={size} color={color} />
	</S.View>
)

export default function Home() {
	const router = useRouter()
	const insets = useSafeAreaInsets()
	const { isDark } = usePreferences()
	const { auth } = useAuth()
	const { chapters, terms, chapterById, loading, error, refetch } = useTermIndex()
	const { recent, viewedSet } = useStudy()
	const userId: number = auth?.user?.Id ?? 0

	const { data: newTerms, refetch: refetchNewTerms } = useApiQuery(
		(signal) => studyApi.getNewTerms(6, signal),
		[userId],
		{ enabled: !!userId, initialData: NO_NEW_TERMS },
	)

	const firstName = String(auth?.user?.Name ?? '').trim().split(/\s+/)[0]
	const unlocked = useMemo(() => new Set(chapters.filter((c) => c.Status === 'Unlock').map((c) => c.ChapterId)), [chapters])
	const daily = useMemo(() => termOfTheDay(terms, unlocked), [terms, unlocked])
	const continueTerm = recent[0]
	const moreRecent = recent.slice(1, 6)

	// Word-part count for "Today's focus" (one small request for that term's entries).
	const { data: dailySubterms } = useApiQuery(
		(signal) => termApi.getSubTerms(daily?.TermId ?? 0, signal),
		[daily?.TermId],
		{ enabled: !!daily, initialData: NO_SUBTERMS },
	)
	const dailyBreakdown = useMemo(() => parseWordBreakdown(dailySubterms as any[]), [dailySubterms])
	const dailyPartCount = dailyBreakdown.parts.length

	// Keep the home-screen widget up to date: today's term and its parts, progress, recent terms.
	useEffect(() => {
		if (terms.length) syncWidget({ chapters, terms, unlocked, viewedSet, recent, daily, dailyBreakdown })
	}, [terms, chapters, unlocked, viewedSet, recent, daily, dailyBreakdown])

	// Viewed terms per subject.
	const viewedByChapter = useMemo(() => {
		const counts = new Map<number, number>()
		for (const t of terms) if (viewedSet.has(t.TermId)) counts.set(t.ChapterId, (counts.get(t.ChapterId) ?? 0) + 1)
		return counts
	}, [terms, viewedSet])
	const totalViewed = useMemo(() => [...viewedByChapter.values()].reduce((a, b) => a + b, 0), [viewedByChapter])
	const sortedChapters = useMemo(() => [...chapters].sort((a, b) => a.Title.localeCompare(b.Title, 'en', { sensitivity: 'base' })), [chapters])
	const styleFor = (chapterId: number) => {
		const index = sortedChapters.findIndex((c) => c.ChapterId === chapterId)
		return subjectStyle(chapterById.get(chapterId)?.Title ?? '', Math.max(index, 0))
	}

	const openTerm = (TermId: number, ChapterId: number, locked = false, name = '') => {
		if (locked) {
			Alert.alert('Subject locked', `“${name}” is in a subject that isn’t unlocked yet.`)
			return
		}
		// Names go along so the term screen header fills in before the term loads.
		router.push({ pathname: RoutesChannel.TERM_LINE, params: { TermId, ChapterId, Term: name, Volume: chapterById.get(ChapterId)?.Title ?? '' } })
	}

	const openSubject = (chapter: IndexChapter) => {
		if (chapter.Status !== 'Unlock') {
			Alert.alert('Subject locked', `${chapter.Title} isn’t unlocked yet.`)
			return
		}
		router.push({ pathname: RoutesChannel.TERM, params: { ChapterId: chapter.ChapterId } })
	}

	const mutedIcon = isDark ? '#64748b' : '#94a3b8'

	return (
		<RequireAuth>
			<S.View className="flex-1 bg-slate-50 dark:bg-slate-950">
				{/* Gradient header */}
				<S.LinearGradient
					colors={['#1e3a8a', '#1d4ed8', '#3b82f6']}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={{ paddingTop: insets.top + 12, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
				>
					<S.View className="flex-row items-center">
						<S.Image source={RLogoWhiteIcon} className="w-[44px] h-[44px]" resizeMode="contain" />
						<S.View className="flex-1 ml-3 mr-2" style={{ minWidth: 0 }}>
							<S.Text className="text-white text-xl font-pbold" numberOfLines={1}>Roots & Morphology</S.Text>
							<S.Text className="text-blue-100 text-xs font-pregular" numberOfLines={1}>Learn Smarter. Grow Faster.</S.Text>
						</S.View>
						<S.TouchableOpacity
							onPress={() => router.push('/?showOnboarding=true')}
							className="flex-row items-center bg-white/20 border border-white/30 rounded-full px-3 py-2"
							style={{ flexShrink: 0 }}
							accessibilityRole="button"
							accessibilityLabel="About the Author"
						>
							<MaterialCommunityIcons name="account" size={16} color="#ffffff" />
							<S.Text className="text-white text-xs font-psemibold ml-1">Author</S.Text>
						</S.TouchableOpacity>
					</S.View>
				</S.LinearGradient>

				<S.ScrollView
					className="flex-1"
					contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 40 }}
					refreshControl={<RefreshControl refreshing={loading && terms.length > 0} onRefresh={() => { refetch(); refetchNewTerms(true) }} />}
				>
					{/* Greeting */}
					<S.Text className="mt-6 text-2xl font-pbold text-slate-900 dark:text-slate-100">
						{firstName ? `Hi, ${firstName}! 👋` : 'Welcome! 👋'}
					</S.Text>
					<S.Text className="text-sm font-pregular text-slate-500 dark:text-slate-400">
						{totalViewed > 0 ? `You’ve explored ${totalViewed} term${totalViewed === 1 ? '' : 's'} so far.` : 'Let’s learn some anatomy terms today.'}
					</S.Text>

					{/* Search */}
					<S.TouchableOpacity
						onPress={() => router.push(RoutesChannel.SEARCH)}
						activeOpacity={0.85}
						className="mt-4 flex-row items-center h-14 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700"
						accessibilityRole="search"
						accessibilityLabel="Search a term"
					>
						<MaterialCommunityIcons name="magnify" size={22} color={mutedIcon} />
						<S.Text className="flex-1 ml-3 text-base font-pregular text-slate-400 dark:text-slate-500">Search a term…</S.Text>
						<MaterialCommunityIcons name="tune-variant" size={20} color={isDark ? '#93c5fd' : '#1d4ed8'} />
					</S.TouchableOpacity>

					{error && terms.length === 0 ? (
						<S.View className="mt-6 h-[300px]"><StateView Kind="error" Title="Could not load your dashboard" Message={error} OnRetry={() => refetch()} /></S.View>
					) : loading && terms.length === 0 ? (
						<S.View className="mt-6 h-[300px]"><StateView Kind="loading" Title="Loading…" /></S.View>
					) : (
						<>
							{/* Continue where you left off */}
							<SectionTitle title="Continue where you left off" />
							{continueTerm ? (
								<>
									<FadeInItem index={0}>
									<S.TouchableOpacity
										activeOpacity={0.9}
										onPress={() => openTerm(continueTerm.TermId, continueTerm.ChapterId, false, continueTerm.Term)}
										accessibilityRole="button"
										accessibilityLabel={`Continue with ${continueTerm.Term}`}
									>
										<S.LinearGradient
											colors={['#1d4ed8', '#2563eb', '#3b82f6']}
											start={{ x: 0, y: 0 }}
											end={{ x: 1, y: 1 }}
											style={{ borderRadius: 20, padding: 18, overflow: 'hidden' }}
										>
											<S.View className="absolute right-3 top-6 opacity-30">
												<MaterialCommunityIcons name="stethoscope" size={84} color="#ffffff" />
											</S.View>
											<S.View className="self-start bg-white/20 rounded-full px-3 py-1">
												<S.Text className="text-white text-[10px] font-pbold tracking-wider">LAST VIEWED</S.Text>
											</S.View>
											<S.Text className="text-white text-xl font-pbold mt-2 pr-20" numberOfLines={2}>{continueTerm.Term}</S.Text>
											<S.Text className="text-blue-100 text-sm font-pregular mt-0.5" numberOfLines={1}>
												{chapterById.get(continueTerm.ChapterId)?.Title ?? ''}
											</S.Text>
											<S.View className="self-start flex-row items-center bg-white rounded-full px-4 py-2 mt-4">
												<S.Text className="text-blue-700 text-sm font-pbold mr-1">Continue</S.Text>
												<MaterialCommunityIcons name="arrow-right" size={16} color="#1d4ed8" />
											</S.View>
										</S.LinearGradient>
									</S.TouchableOpacity>
									</FadeInItem>
									{moreRecent.length > 0 && (
										<S.ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3" contentContainerStyle={{ paddingRight: 8 }}>
											{moreRecent.map((r, index) => (
												<S.TouchableOpacity
													key={r.TermId}
													onPress={() => openTerm(r.TermId, r.ChapterId, false, r.Term)}
													className={`mr-2 px-5 py-2.5 rounded-full border ${index === 0
														? 'bg-blue-700 border-blue-700'
														: 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-700'}`}
													accessibilityRole="button"
													accessibilityLabel={`Open ${r.Term}`}
												>
													<S.Text className={`text-sm font-pmedium ${index === 0 ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`} numberOfLines={1}>{r.Term}</S.Text>
												</S.TouchableOpacity>
											))}
										</S.ScrollView>
									)}
								</>
							) : (
								<S.TouchableOpacity onPress={() => router.push(RoutesChannel.VOLUMES)} activeOpacity={0.9} accessibilityRole="button">
									<S.LinearGradient colors={['#1d4ed8', '#3b82f6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 20, padding: 18 }}>
										<S.Text className="text-white text-lg font-pbold">Open a subject to begin</S.Text>
										<S.Text className="text-blue-100 text-sm font-pregular mt-1">Your recently viewed terms will appear here.</S.Text>
									</S.LinearGradient>
								</S.TouchableOpacity>
							)}

							{/* Today's focus */}
							{daily && (
								<>
									<SectionTitle title="Today's focus" />
									<FadeInItem index={1}>
									<S.TouchableOpacity
										onPress={() => openTerm(daily.TermId, daily.ChapterId, false, daily.Term)}
										activeOpacity={0.85}
										className="flex-row items-center rounded-2xl p-4 bg-emerald-50 border border-emerald-200 dark:bg-slate-900 dark:border-emerald-900"
										accessibilityRole="button"
										accessibilityLabel={`Today's focus: ${daily.Term}`}
									>
										<S.View className="h-12 w-12 rounded-full bg-emerald-500 items-center justify-center">
											<MaterialCommunityIcons name="lightbulb-on-outline" size={24} color="#ffffff" />
										</S.View>
										<S.View className="flex-1 ml-4">
											<S.Text className="text-lg font-pbold text-slate-900 dark:text-slate-100" numberOfLines={1}>{daily.Term}</S.Text>
											<S.Text className="text-sm font-pregular text-slate-500 dark:text-slate-400" numberOfLines={1}>{chapterById.get(daily.ChapterId)?.Title ?? ''}</S.Text>
											<S.Text className="text-sm font-psemibold text-blue-700 dark:text-blue-300 mt-1">
												{dailyPartCount > 0 ? `See ${dailyPartCount} word part${dailyPartCount === 1 ? '' : 's'} →` : 'See its word parts →'}
											</S.Text>
										</S.View>
										<S.View className="h-9 w-9 rounded-full bg-emerald-100 dark:bg-emerald-950 items-center justify-center">
											<MaterialCommunityIcons name="chevron-right" size={22} color={isDark ? '#34d399' : '#059669'} />
										</S.View>
									</S.TouchableOpacity>
									</FadeInItem>
								</>
							)}

							{/* Recently added */}
							{newTerms.length > 0 && (
								<>
									<SectionTitle title="Recently added" />
									{newTerms.map((t, index) => {
										const style = styleFor(t.ChapterId)
										const locked = t.Status !== 'Unlock'
										return (
											<FadeInItem key={t.TermId} index={index + 2}>
											<S.TouchableOpacity
												onPress={() => openTerm(t.TermId, t.ChapterId, locked, t.Term)}
												activeOpacity={0.85}
												className="flex-row items-center mb-2.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
												accessibilityRole="button"
												accessibilityLabel={`${t.Term}, ${t.ChapterTitle}, ${addedLabel(t.DateCreated)}${locked ? ', locked' : ''}`}
											>
												<IconTile icon={style.icon} color={style.iconColor} tile={style.tile} />
												<S.View className="flex-1 ml-3">
													<S.View className="flex-row items-center">
														<S.Text className="flex-shrink text-base font-psemibold text-slate-900 dark:text-slate-100" numberOfLines={1}>{t.Term}</S.Text>
														{isRecent(t.DateCreated) && (
															<S.View className="ml-2 px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900">
																<S.Text className="text-[9px] font-pbold text-green-800 dark:text-green-200">NEW</S.Text>
															</S.View>
														)}
													</S.View>
													<S.Text className="text-xs font-pregular text-slate-500 dark:text-slate-400" numberOfLines={1}>
														{[t.ChapterTitle, addedLabel(t.DateCreated)].filter(Boolean).join(' · ')}
													</S.Text>
												</S.View>
												<MaterialCommunityIcons name={locked ? 'lock-outline' : 'chevron-right'} size={22} color={mutedIcon} />
											</S.TouchableOpacity>
											</FadeInItem>
										)
									})}
								</>
							)}

							{/* Your subjects */}
							<SectionTitle title="Your subjects" action="See all" onAction={() => router.push(RoutesChannel.VOLUMES)} />
							{sortedChapters.length === 0 && (
								<StateView ClassName="py-8 rounded-2xl" Kind="empty" Icon="bookshelf" Title="No subjects yet" Message="Subjects will appear here once they’re available. Pull down to refresh." />
							)}
							{sortedChapters.map((chapter, index) => {
								const style = subjectStyle(chapter.Title, index)
								const viewed = viewedByChapter.get(chapter.ChapterId) ?? 0
								const locked = chapter.Status !== 'Unlock'
								return (
									<FadeInItem key={chapter.ChapterId} index={index + 3}>
									<S.TouchableOpacity
										onPress={() => openSubject(chapter)}
										activeOpacity={0.85}
										className={`flex-row items-center mb-2.5 p-3 rounded-2xl border ${style.row}`}
										accessibilityRole="button"
										accessibilityLabel={`${chapter.Title}, ${locked ? 'locked' : `${viewed} of ${chapter.TermCount} terms viewed`}`}
									>
										<IconTile icon={style.icon} color={style.iconColor} tile={style.tile} />
										<S.View className="flex-1 ml-3">
											<S.Text className={`text-base font-psemibold ${locked ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`} numberOfLines={1}>
												{chapter.Title}
											</S.Text>
											<S.Text className="text-xs font-pregular text-slate-500 dark:text-slate-400">
												{locked ? 'Locked' : `${viewed} of ${chapter.TermCount} terms viewed`}
											</S.Text>
										</S.View>
										<MaterialCommunityIcons name={locked ? 'lock-outline' : 'chevron-right'} size={22} color={mutedIcon} />
									</S.TouchableOpacity>
									</FadeInItem>
								)
							})}
						</>
					)}
				</S.ScrollView>
			</S.View>
		</RequireAuth>
	)
}
