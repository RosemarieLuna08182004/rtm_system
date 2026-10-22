import React, { useMemo } from "react"
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlashList } from "@shopify/flash-list"
import { useLocalSearchParams } from "expo-router"
import * as S from '@/styles'
import { SecondaryHeader, StateView } from "@/components"
import { TermResultRow } from "@/components/Term/TermResultRow"
import { RequireAuth, useStudy } from "@/context"
import { useApiQuery } from "@/hooks/api/useApiQuery"
import { RootTerm, studyApi } from "@/services/api"

const EMPTY: RootTerm[] = []

// Every term that uses a root, opened by tapping a word-part chip.
export default function RootScreen() {
	const { root = '', meaning = '', from = '' } = useLocalSearchParams<{ root: string; meaning?: string; from?: string }>()
	const { viewedSet } = useStudy()
	const { data: terms, loading, error, refetch } = useApiQuery(
		(signal) => studyApi.getByRoot(String(root), signal),
		[root],
		{ enabled: !!root, initialData: EMPTY },
	)

	const unlockedCount = useMemo(() => terms.filter((t) => t.Status === 'Unlock').length, [terms])

	const header = (
		<S.View className="px-4 pt-5 pb-3">
			<S.View className="rounded-2xl bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-700 p-4">
				<S.Text className="text-3xl font-pbold text-blue-800 dark:text-blue-200">{root}</S.Text>
				{!!meaning && <S.Text className="text-base font-pregular text-slate-700 dark:text-slate-200 mt-1">“{meaning}”</S.Text>}
				<S.Text className="text-sm font-pregular text-slate-500 dark:text-slate-400 mt-2">
					{loading ? 'Finding terms…' : `${terms.length} term${terms.length === 1 ? '' : 's'} use this root${terms.length !== unlockedCount ? ` · ${unlockedCount} unlocked` : ''}`}
				</S.Text>
			</S.View>
			{!!from && !loading && terms.length > 1 && (
				<S.Text className="text-xs font-pregular text-slate-400 dark:text-slate-500 mt-3 ml-1">Includes “{from}”, the term you came from.</S.Text>
			)}
		</S.View>
	)

	return (
		<RequireAuth>
			<SafeAreaView className="flex-1 bg-blue-700" edges={['top']}>
				<SecondaryHeader title={`Root: ${root}`} subtitle={meaning || undefined} />
				<SafeAreaView className="flex-1 bg-slate-100 dark:bg-slate-950" edges={['left', 'right', 'bottom']}>
					{error && terms.length === 0 ? (
						<StateView Kind="error" Title="Could not load related terms" Message={error} OnRetry={() => refetch()} />
					) : (
						<FlashList
							data={terms}
							keyExtractor={(item) => String(item.TermId)}
							ListHeaderComponent={header}
							ListEmptyComponent={loading ? <StateView Kind="loading" Title="Finding terms…" /> : <StateView Kind="empty" Title="No other terms found" />}
							renderItem={({ item }) => (
								<TermResultRow
									termId={item.TermId}
									chapterId={item.ChapterId}
									term={item.Term}
									chapterTitle={item.ChapterTitle}
									locked={item.Status !== 'Unlock'}
									viewed={viewedSet.has(item.TermId)}
								/>
							)}
							contentContainerStyle={{ paddingBottom: 30 }}
						/>
					)}
				</SafeAreaView>
			</SafeAreaView>
		</RequireAuth>
	)
}
