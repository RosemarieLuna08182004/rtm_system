import React, { useMemo } from "react"
import { Dimensions, StatusBar } from 'react-native'
import * as S from '@/styles'
import { SecondaryHeader, TermLineList } from "@/components"
import { RequireAuth } from "@/context"
import { useAuth, useGetTerm, useGetVolume } from "@/hooks"
import { useRoute } from "@react-navigation/native"

export default function TermDetailScreen() {
	/*REDUX
	//const dispatch = useDispatch<AppDispatch>()
	//const axios = useAxiosPrivate()
	const {term} = useSelector(getTerms)
	const {chapter} = useSelector(getChapters)
	
	const chapterId = useMemo(()=>Number(term?.ChapterId??0),[term])
	const fetchData = useCallback(async () => {
		if (!chapterId) return;
		dispatch(useGetChapter({ UserId, chapterId, axios }));
	}, [dispatch, axios, chapterId, UserId]);
	useEffect(() => {
		fetchData();
	}, [fetchData]);
	*/

	const route = useRoute()
	const {auth} = useAuth();
	const {ChapterId, TermId } : any = route.params
	const UserId = useMemo(()=>Number(auth?.user?.Id??0),[auth]) 
	const {records: term, refetch:refetchTerm, } = useGetTerm(TermId, UserId)
	const {records: chapter, refetch:refetchChapter, } = useGetVolume(ChapterId, UserId)

	const Title = useMemo(()=>chapter?.Title??'NA',[chapter])
	const Subtitle = useMemo(()=>term?.Term??'NA',[term])
	const Status = useMemo(()=>term?.Status??"Unbookmark",[term])
	const termId = useMemo(()=>term?.TermId??0,[term])
	const UserTermsId = useMemo(()=>term?.UserTermsId??0,[term])
	const fetchData = () => {
		refetchTerm();
		refetchChapter();
	}
	return (
		<RequireAuth>
			<S.SafeAreaView className="bg-blue-700">
				<StatusBar 
					barStyle="light-content" 
					backgroundColor="#1d4ed8" 
					translucent={false}
				/>
				<SecondaryHeader
					title={Title}
					subtitle={Subtitle}
					termStatus={Status}
					chapterId={ChapterId}
					termId={termId}
					isTermLine={true}
					userTermsId={UserTermsId}
				/>
				<S.View className="h-screen bg-slate-100 justify-start px-3">
					<S.GestureHandlerRootView>
						<TermLineList Refetch={fetchData}/>
					</S.GestureHandlerRootView>
				</S.View>
			</S.SafeAreaView>
		</RequireAuth>
	)
}
