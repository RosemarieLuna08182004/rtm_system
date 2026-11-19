import React, { useCallback, useMemo, useState, useEffect } from "react"
import * as S from '@/styles'
import { Header, ActivityIndicator } from "@/components"
import { RequireAuth } from "@/context"
import { useAuth, useToggle, useGetAllVolumes } from "@/hooks"
import { ListsContainer } from "@/components/Containers/ListsContainer"
import { responsiveDimension } from "@/utils"
import { UpdatesModal } from "@/components/Modals/UpdatesModal"
import { getItem, setItem } from "@/utils/asyncStorage"

export default function Home() {
    const {auth} = useAuth()
    const UserId = useMemo(() => auth?.user?.Id ?? 0, [auth])
    const [isHeader, toggleHeader] = useToggle(false)
    const {records: volumes, refetch, loading} = useGetAllVolumes(UserId)
    const [showUpdatesModal, setShowUpdatesModal] = useState(false)
    const [isInitialLoad, setIsInitialLoad] = useState(true)

    const sortedVolumes = useMemo(() => {
        if (!volumes?.length) return []
        return [...volumes].sort((a: any, b: any) => {
            const aTitle = a.Title || a.Term || ""
            const bTitle = b.Title || b.Term || ""
            return aTitle.localeCompare(bTitle, "en", { sensitivity: "base" })
        })
    }, [volumes])

    const toggleHeaderState = useCallback(() => {
        toggleHeader()
    }, [toggleHeader])

    // Track when initial load is complete
    useEffect(() => {
        if (!loading && volumes !== undefined) {
            setIsInitialLoad(false)
        }
    }, [loading, volumes])

    // Remove auto-popup functionality - now controlled by header bell
    // useEffect(() => {
    //     const checkUpdatesModal = async () => {
    //         try {
    //             const hasSeenUpdates = await getItem('hasSeenUpdatesModal_v1.0')
    //             if (!hasSeenUpdates) {
    //                 setShowUpdatesModal(true)
    //             }
    //         } catch (error) {
    //             console.log('Error checking updates modal status:', error)
    //         }
    //     }
        
    //     if (auth?.user) {
    //         checkUpdatesModal()
    //     }
    // }, [auth?.user])

    const handleCloseUpdatesModal = async () => {
        setShowUpdatesModal(false)
        try {
            await setItem('hasSeenUpdatesModal_v1.0', 'true')
        } catch (error) {
            console.log('Error saving updates modal status:', error)
        }
    }

    return (
        <RequireAuth>
            <S.View className="flex-1 bg-blue-700 pt-12">
                <Header 
                    ClassName="z-90" 
                    ToggleFetch={isHeader} 
                    title="Home" 
                />
                {isInitialLoad && loading ? (
                    <S.View className="flex-1 bg-slate-100 items-center justify-center">
                        <ActivityIndicator />
                        <S.Text className="text-gray-700 text-lg mt-4 font-pmedium">Loading volumes...</S.Text>
                    </S.View>
                ) : (
                    <S.View className="flex-1 bg-slate-100">
                        <S.ScrollView
                            contentContainerStyle={{
                                paddingHorizontal: responsiveDimension(10),
                            }}
                        >
                            <ListsContainer
                                Title="Volumes"
                                Data={sortedVolumes}
                                FetchData={() => {
                                    refetch()
                                    toggleHeaderState()
                                }}
                                RefreshStatus={loading}
                            />
                        </S.ScrollView>
                    </S.View>
                )}
                
                {/* Updates Modal */}
                <UpdatesModal 
                    visible={showUpdatesModal}
                    onClose={handleCloseUpdatesModal}
                />
            </S.View>
        </RequireAuth>
    )
}
