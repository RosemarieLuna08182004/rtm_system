import React, { useMemo, useCallback, useEffect, useState } from "react"
import { SafeAreaView } from 'react-native-safe-area-context'
import * as S from '@/styles'
import { ActivityIndicator, SecondaryHeader } from "@/components"
import { RequireAuth, useBookmarkContext } from "@/context"
import { ListsContainer } from "@/components/Containers/ListsContainer"
import { useAuth, useGetAllTerms, useGetVolume } from "@/hooks"
import { useRoute, useFocusEffect } from "@react-navigation/native"
import { TermTable } from "@/types/tables"

export default function TermScreen() {
	const { auth } = useAuth()
	const UserId = useMemo(() => auth?.user?.Id ?? 0, [auth])
	const route: any = useRoute()
	const ChapterId = route.params?.ChapterId ?? 0
	const { records: volume, refetch: refetchVolume, loading: loadingVolume } = useGetVolume(ChapterId, UserId)
	const { records: terms, refetch: refetchTerm, loading: loadingTerm } = useGetAllTerms(ChapterId, UserId)
	const { bookmarkState } = useBookmarkContext()

	const refetch = useCallback(() => {
		refetchVolume()
		refetchTerm()
	}, [refetchVolume, refetchTerm])

	useFocusEffect(
		useCallback(() => {
			refetch()
		}, [refetch])
	)

	// Ensure localTerms is always synced with fetched terms
	const [localTerms, setLocalTerms] = useState<TermTable[]>([])

	useEffect(() => {
		// Only update localTerms after data is fully loaded and not empty
		if (!loadingTerm && terms && terms.length > 0) {
			setLocalTerms(terms)
		}
	}, [terms, loadingTerm])

	const isStillLoading = loadingTerm || loadingVolume
	
	return (
		<RequireAuth>
			<SafeAreaView className="flex-1 bg-blue-700" edges={['top']}>
				<SecondaryHeader title={volume?.Title ?? 'NA'} />
				<SafeAreaView 
					className="flex-1 bg-slate-100" 
					edges={['left', 'right', 'bottom']}
				>
					{isStillLoading ? (
						<S.View className="flex-1 items-center justify-center">
							<ActivityIndicator />
						</S.View>
					) : (
						<ListsContainer
							ClassName="px-3 flex-1 w-full bg-slate-100"
							Data={localTerms}
							Title="Terms"
							FetchData={refetch}
							RefreshStatus={isStillLoading}
						/>
					)}
				</SafeAreaView>
			</SafeAreaView>
		</RequireAuth>
	)
}
