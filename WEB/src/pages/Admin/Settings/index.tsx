import { RouteChannel, SFC } from "../../../types";
import * as S from '../../../styles/Styles'
import { DashboardCard, PageBreadCrumbs } from "../../../components";
import { useNavigate } from "react-router-dom";
import { mdiBookArrowLeftOutline, mdiDatabaseArrowLeftOutline, mdiDatabaseImportOutline, mdiFolderWrenchOutline } from "@mdi/js";

export const AdminSettingsPage : SFC = ({ClassName}) => {
    const navigate = useNavigate()
    const links = [
        { Text: 'Dashboard', OnClick: () => navigate(RouteChannel.DASHBOARD) },
    ]

    return (
        <>
            <S.Container className={ClassName}>
                <S.PageTopBar className="breadcrumbs w-full  bg-white mb-2 rounded-md text-zinc-800 flex flex-col md:flex-row items-center justify-between p-2 md:h-[50px]">
                        <PageBreadCrumbs Links={links} Active="Settings" />
                </S.PageTopBar>
                <S.Content className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    <DashboardCard Icons={mdiDatabaseArrowLeftOutline} Text="Privacy Policy " Title="Community Standards and legal policies" OnClick={()=> navigate(RouteChannel.DASHBOARD)} />
                    <DashboardCard Icons={mdiBookArrowLeftOutline} Text="Terms & Conditions" Title="Community Standards and legal policies" OnClick={()=> navigate(RouteChannel.DASHBOARD)} />
                    <DashboardCard Icons={mdiFolderWrenchOutline} Text="Utility" Title="Data Translator" OnClick={()=> navigate(RouteChannel.UTILITY)} />
                    <DashboardCard Icons={mdiDatabaseImportOutline} Text="Import Data" Title="Migrate old records" OnClick={()=> navigate(RouteChannel.TERM_IMPORT)} />
                </S.Content> 
            </S.Container> 
        </>
    )
}