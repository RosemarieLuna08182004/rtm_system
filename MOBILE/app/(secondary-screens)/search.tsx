import React, { useMemo, useState } from "react"
import { Keyboard } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlashList } from "@shopify/flash-list"
import { useLocalSearchParams, useRouter } from "expo-router"
import * as S from '@/styles'
import { StateView } from "@/components"
import { TermResultRow } from "@/components/Term/TermResultRow"
import { RequireAuth, usePreferences, useStudy } from "@/context"
import { useDebounce, useTermIndex } from "@/hooks"
import { searchItems } from "@/utils/fuzzySearch"
import { LeftArrow } from "@/constants"

// Search every term in every volume, tolerant of small spelling mistakes.
export default function SearchScreen() {
	const router = useRouter()
	const { isDark } = usePreferences()
	const { terms, chapterById, loading, error, refetch } = useTermIndex()
	const { searches, addSearch, clearSearches, viewedSet } = useStudy()
	// Opened from a term ("Word in focus", "Relevant words") with a word to look up.
	const { q } = useLocalSearchParams<{ q?: string }>()
	const [query, setQuery] = useState(typeof q === 'string' ? q : '')
	const debounced = useDebounce(query, 200)

	const results = useMemo(() => searchItems(terms, debounced, (t) => t.Term), [terms, debounced])
	const onlyClose = results.length > 0 && results.every((r) => r.fuzzy)
	const searching = query.trim().length > 0

	const header = searching && results.length > 0 ? (
		<S.Text className="mx-5 mt-4 mb-2 text-xs uppercase tracking-wider font-pbold text-slate-500 dark:text-slate-400">
			{onlyClose ? `No exact match — close spellings to “${debounced}”` : `${results.length}${results.length === 60 ? '+' : ''} result${results.length === 1 ? '' : 's'}`}
		</S.Text>
	) : null

	return (
		<RequireAuth>
			<SafeAreaView className="flex-1 bg-blue-700" edges={['top']}>
				<S.View className="flex-row items-center px-3 py-3">
					<S.TouchableOpacity onPress={() => router.back()} className="p-2" accessibilityRole="button" accessibilityLabel="Go back">
						<S.Image source={LeftArrow} className="w-5 h-5" tintColor="#ffffff" />
					</S.TouchableOpacity>
					<S.View className="flex-1 flex-row items-center ml-2 rounded-xl bg-white dark:bg-slate-900 px-3">
						<S.Text className="text-base mr-2" accessibilityElementsHidden>🔎</S.Text>
						<S.TextInput
							value={query}
							onChangeText={setQuery}
							autoFocus={!q}
							placeholder="Search all terms"
							placeholderTextColor={isDark ? '#64748b' : '#9CA3AF'}
							returnKeyType="search"
							autoCorrect={false}
							autoCapitalize="none"
							onSubmitEditing={() => addSearch(query)}
							className="flex-1 h-12 text-base font-pregular text-slate-800 dark:text-slate-100"
							accessibilityLabel="Search all terms"
						/>
						{!!query && (
							<S.TouchableOpacity onPress={() => setQuery('')} className="p-2" accessibilityRole="button" accessibilityLabel="Clear search">
								<S.Text className="text-slate-400 text-lg">✕</S.Text>
							</S.TouchableOpacity>
						)}
					</S.View>
				</S.View>

				<SafeAreaView className="flex-1 bg-slate-100 dark:bg-slate-950" edges={['left', 'right', 'bottom']}>
					{error && terms.length === 0 ? (
						<StateView Kind="error" Title="Search isn't available" Message={error} OnRetry={() => refetch()} />
					) : loading && terms.length === 0 ? (
						<StateView Kind="loading" Title="Preparing search…" />
					) : !searching ? (
						<S.View className="px-5 pt-5">
							{searches.length > 0 ? (
								<>
									<S.View className="flex-row items-center justify-between mb-3">
										<S.Text className="text-xs uppercase tracking-wider font-pbold text-slate-500 dark:text-slate-400">Recent searches</S.Text>
										<S.TouchableOpacity onPress={clearSearches} accessibilityRole="button" accessibilityLabel="Clear recent searches">
											<S.Text className="text-sm font-psemibold text-blue-700 dark:text-blue-300">Clear</S.Text>
										</S.TouchableOpacity>
									</S.View>
									<S.View className="flex-row flex-wrap">
										{searches.map((s) => (
											<S.TouchableOpacity key={s} onPress={() => setQuery(s)} className="mr-2 mb-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700" accessibilityRole="button" accessibilityLabel={`Search for ${s}`}>
												<S.Text className="text-sm font-pmedium text-slate-700 dark:text-slate-200">{s}</S.Text>
											</S.TouchableOpacity>
										))}
									</S.View>
								</>
							) : (
								<S.Text className="text-base font-pregular text-slate-500 dark:text-slate-400 mt-6 text-center">
									Type part of a term, e.g. “renal” or “cardi”.{'\n'}Small spelling mistakes are OK.
								</S.Text>
							)}
						</S.View>
					) : results.length === 0 ? (
						<StateView Kind="empty" Title={`No terms match “${debounced}”`} Message="Try a shorter part of the word." />
					) : (
						<FlashList
							data={results}
							keyExtractor={(r) => String(r.item.TermId)}
							ListHeaderComponent={header}
							keyboardShouldPersistTaps="handled"
							onScrollBeginDrag={Keyboard.dismiss}
							renderItem={({ item: r }) => {
								const chapter = chapterById.get(r.item.ChapterId)
								return (
									<TermResultRow
										termId={r.item.TermId}
										chapterId={r.item.ChapterId}
										term={r.item.Term}
										chapterTitle={chapter?.Title}
										locked={chapter?.Status !== 'Unlock'}
										viewed={viewedSet.has(r.item.TermId)}
										onOpen={() => addSearch(query)}
									/>
								)
							}}
							contentContainerStyle={{ paddingBottom: 30 }}
						/>
					)}
				</SafeAreaView>
			</SafeAreaView>
		</RequireAuth>
	)
}
