import React, { useCallback, useEffect, useMemo, useRef } from "react"
import { RefreshControl } from "react-native"
import { useFocusEffect, useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as S from '@/styles'
import { FadeInItem, StateView } from "@/components"
import { BookmarkStrip } from "@/components/Home/BookmarkStrip"
import { IllustrationCarousel } from "@/components/Home/IllustrationCarousel"
import { dayKey, pickForDay } from "@/utils/termOfTheDay"
import { syncWidget } from "@/widgets/sync"
import { RequireAuth, useBookmarkContext, useStudy, useThemeColors } from "@/context"
import { useAuth, useGetMyBookmarks, useTermIndex } from "@/hooks"
import { useApiQuery } from "@/hooks/api/useApiQuery"
import { RLogoWhiteIcon, RoutesChannel } from "@/constants"
import { IllustratedTerm, IndexTerm, studyApi } from "@/services/api"

const NO_ILLUSTRATIONS: IllustratedTerm[] = []
const CARD_SHADOW = { shadowColor: '#1d4ed8', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 }

// Dr. Oliva's figures, as in About the app.
const GLANCE: { value: string; label: string }[] = [
	{ value: '3000+', label: 'anatomy terms' },
	{ value: '13', label: 'volumes' },
	{ value: '1400+', label: 'Greek & Latin roots' },
]

const Bold: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<S.Text className="font-pbold text-blue-950 dark:text-slate-100">{children}</S.Text>
)

const STEPS: React.ReactNode[] = [
	<>Open a <Bold>Volume</Bold> from the menu below.</>,
	<>Tap a term and <Bold>start with the illustration</Bold>. It explains the term.</>,
	<>Read the root, morphology and definition, then <Bold>bookmark</Bold> the important ones.</>,
]

// Same term for everyone on a given day, different each day.
const termOfTheDay = (terms: IndexTerm[], unlockedChapters: Set<number>): IndexTerm | undefined =>
	pickForDay(terms.filter((t) => unlockedChapters.has(t.ChapterId)))

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

export default function Home() {
	const router = useRouter()
	const insets = useSafeAreaInsets()
	const { auth } = useAuth()
	const { chapters, terms, chapterById, loading, error, refetch } = useTermIndex()
	const { recent, viewedSet } = useStudy()
	const userId: number = auth?.user?.Id ?? 0

	// Today's illustrations for the carousel (same selection all day).
	const { data: illustrations, refetch: refetchIllustrations } = useApiQuery(
		(signal) => studyApi.getIllustrations(8, dayKey(), signal),
		[userId],
		{ enabled: !!userId, initialData: NO_ILLUSTRATIONS },
	)

	// Bookmarks, reloaded when coming back after a bookmark changed elsewhere.
	const { groups, refetch: refetchBookmarks } = useGetMyBookmarks(userId)
	const { bookmarkVersion } = useBookmarkContext()
	const loadedVersion = useRef(bookmarkVersion)
	useFocusEffect(useCallback(() => {
		if (loadedVersion.current !== bookmarkVersion) {
			loadedVersion.current = bookmarkVersion
			refetchBookmarks(true)
		}
	}, [bookmarkVersion, refetchBookmarks]))
	const bookmarks = useMemo(() => groups.flatMap((g) => g.terms.map((t) => ({ ...t, ChapterTitle: g.Title }))).slice(0, 8), [groups])

	const firstName = String(auth?.user?.Name ?? '').trim().split(/\s+/)[0]
	const unlocked = useMemo(() => new Set(chapters.filter((c) => c.Status === 'Unlock').map((c) => c.ChapterId)), [chapters])
	const daily = useMemo(() => termOfTheDay(terms, unlocked), [terms, unlocked])
	const continueTerm = recent[0]

	// Keep the home-screen widget up to date: today's term, progress, recent terms.
	useEffect(() => {
		if (terms.length) syncWidget({ chapters, terms, unlocked, viewedSet, recent, daily })
	}, [terms, chapters, unlocked, viewedSet, recent, daily])

	const openTerm = (TermId: number, ChapterId: number, name = '') => {
		// Names go along so the term screen header fills in before the term loads.
		router.push({ pathname: RoutesChannel.TERM_LINE, params: { TermId, ChapterId, Term: name, Volume: chapterById.get(ChapterId)?.Title ?? '' } })
	}

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
							<S.Text className="text-blue-100 text-xs font-pregular" numberOfLines={2}>Take a small step back, a giant leap forward to mastery of Anatomy & Physiology</S.Text>
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
					refreshControl={<RefreshControl refreshing={loading && terms.length > 0} onRefresh={() => { refetch(); refetchIllustrations(true); refetchBookmarks(true) }} />}
				>
					{/* Greeting */}
					<S.Text className="mt-6 text-2xl font-pbold text-slate-900 dark:text-slate-100">
						{firstName ? `Hi, ${firstName}! 👋` : 'Welcome! 👋'}
					</S.Text>
					<S.Text className="text-sm font-pregular text-slate-500 dark:text-slate-400">
						Every term starts with its illustration.
					</S.Text>

					{error && terms.length === 0 ? (
						<S.View className="mt-6 h-[300px]"><StateView Kind="error" Title="Could not load your dashboard" Message={error} OnRetry={() => refetch()} /></S.View>
					) : loading && terms.length === 0 ? (
						<S.View className="mt-6 h-[300px]"><StateView Kind="loading" Title="Loading…" /></S.View>
					) : (
						<>
							{/* Continue where you left off */}
							<SectionTitle title="Continue where you left off" />
							{continueTerm ? (
								<FadeInItem index={0}>
								<S.TouchableOpacity
									activeOpacity={0.9}
									onPress={() => openTerm(continueTerm.TermId, continueTerm.ChapterId, continueTerm.Term)}
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
							) : (
								<S.TouchableOpacity onPress={() => router.push(RoutesChannel.VOLUMES)} activeOpacity={0.9} accessibilityRole="button">
									<S.LinearGradient colors={['#1d4ed8', '#3b82f6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 20, padding: 18 }}>
										<S.Text className="text-white text-lg font-pbold">Open a volume to begin</S.Text>
										<S.Text className="text-blue-100 text-sm font-pregular mt-1">Your recently viewed terms will appear here.</S.Text>
									</S.LinearGradient>
								</S.TouchableOpacity>
							)}

							{/* Illustrations. Proposal for Dr. Oliva: replaces the volumes list, which repeats the Volumes tab. */}
							{illustrations.length > 0 && (
								<>
									<SectionTitle title="Illustrations" action="See all" onAction={() => router.push(RoutesChannel.ILLUSTRATIONS)} />
									<IllustrationCarousel items={illustrations} onOpen={(t) => openTerm(t.TermId, t.ChapterId, t.Term)} />
								</>
							)}

							{/* At a glance */}
							<SectionTitle title="At a glance" />
							<FadeInItem index={2}>
								<S.View className="flex-row" style={{ gap: 10 }}>
									{GLANCE.map((g) => (
										<S.View key={g.label} className="flex-1 items-center rounded-2xl py-3.5 px-1 bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800" style={CARD_SHADOW}>
											<S.Text className="text-2xl font-pbold text-blue-800 dark:text-blue-300">{g.value}</S.Text>
											<S.Text className="text-[11px] font-pregular text-center text-slate-500 dark:text-slate-400">{g.label}</S.Text>
										</S.View>
									))}
								</S.View>
								<S.View className="mt-3 rounded-r-xl border-l-4 border-blue-700 dark:border-blue-400 bg-blue-50 dark:bg-slate-900 px-3 py-2.5">
									<S.Text className="text-sm font-pregular leading-5 text-slate-700 dark:text-slate-300">
										Linguistic foundation: metaphors, imageries, similes and literal translations of Greek & Latin roots in Anatomy Terms.
									</S.Text>
								</S.View>
							</FadeInItem>

							{/* How to study a term */}
							<SectionTitle title="How to study a term" />
							<FadeInItem index={3}>
								<S.View className="rounded-2xl px-4 py-1 bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800" style={CARD_SHADOW}>
									{STEPS.map((text, i) => (
										<S.View key={i} className={`flex-row items-center py-3 ${i > 0 ? 'border-t border-slate-100 dark:border-slate-800' : ''}`}>
											<S.LinearGradient colors={['#1e3a8a', '#3b82f6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height: 36, width: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
												<S.Text className="text-white text-sm font-pbold">{i + 1}</S.Text>
											</S.LinearGradient>
											<S.Text className="flex-1 ml-3 text-sm font-pregular leading-5 text-slate-700 dark:text-slate-300">{text}</S.Text>
										</S.View>
									))}
								</S.View>
							</FadeInItem>

							{/* Your bookmarks */}
							<SectionTitle title="Your bookmarks" action={bookmarks.length ? 'See all' : undefined} onAction={() => router.push(RoutesChannel.BOOKMARK)} />
							<FadeInItem index={4}>
								<BookmarkStrip terms={bookmarks} onOpen={(t) => openTerm(t.TermId, t.ChapterId, t.Term)} onBrowse={() => router.push(RoutesChannel.VOLUMES)} />
							</FadeInItem>
						</>
					)}
				</S.ScrollView>
			</S.View>
		</RequireAuth>
	)
}
