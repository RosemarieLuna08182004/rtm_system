import { DBTable, notificationHC, RouteChannel, SFC } from "../../../types";
import * as S from '../../../styles/Styles'
import { PageBreadCrumbs, EnhancedTable, Skeleton } from "../../../components";
import { useNavigate } from "react-router-dom";
import { Suspense } from "react";

export const AdminNotificationPage : SFC = ({ClassName}) => {
    const navigate = useNavigate()
    const links = [{ Text: 'Dashboard', OnClick: () => navigate(RouteChannel.DASHBOARD) }]
    
    return (
        <>
        <S.Container className={ClassName}>
            <S.PageTopBar className="breadcrumbs w-full  bg-white mb-2 rounded-md text-zinc-800 flex flex-col md:flex-row items-center justify-between p-2 md:h-[50px]">
                    <PageBreadCrumbs Links={links} Active={"Notifications"} />
                    <S.Actions className="flex justify-end w-full md:w-4/6">
                    </S.Actions >
            </S.PageTopBar>
            <S.Content className="flex mb-2 flex-col bg-white w-full h-fit rounded-md text-zinc-800 flex items-center px-3 py-2">
                <Suspense fallback={<Skeleton />}>
                    <EnhancedTable Title="Notifications" Rows={[]} HeadCells={notificationHC} OnRecordDelete={()=>{}} RemoveTable={DBTable.NOTIFICATION} ClassName="md:max-h-[calc(100vh-200px)]"/>
                </Suspense>
            </S.Content> 
        </S.Container> 
        </>
    )
}