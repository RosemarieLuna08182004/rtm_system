import { ButtonType, RouteChannel, SFC } from "../../../../types";
import * as S from '../../../../styles'
import { CustomButton, PageBreadCrumbs } from "../../../../components";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { SheetImport } from "./SheetImport";
import { SqlImport } from "./SqlImport";

export const AdminTermImportPage : SFC = ({ClassName}) => {
    const navigate = useNavigate()
    const [tab, setTab] = useState<'sheet' | 'sql'>('sheet')

    const links = [
        { Text: 'Dashboard', OnClick: () => navigate(RouteChannel.DASHBOARD) },
        { Text: 'Settings', OnClick: () => navigate(RouteChannel.SETTINGS) },
    ]

    return (
        <>
            <S.Container className={ClassName}>
                <S.PageTopBar className="breadcrumbs w-full  bg-white mb-2 rounded-md text-zinc-800 flex flex-col md:flex-row items-center justify-between p-2 md:h-[50px]">
                    <S.Actions className="flex justify-between w-full items-center">
                        <PageBreadCrumbs Links={links} Active="Import"/>
                        <CustomButton  icon={<ArrowBackIcon className="md:text-white text-primary" />} onClick={()=>navigate(RouteChannel.SETTINGS)} text='Back' type={ButtonType.button} />
                    </S.Actions >
                </S.PageTopBar>
                <S.Content className="flex mb-2 flex-col bg-white w-full h-fit rounded-md text-zinc-800 items-center px-3 py-2">
                    <Tabs value={tab} onChange={(_, value) => setTab(value)} className="w-full mb-3 border-b border-zinc-200" aria-label="Import type">
                        <Tab value="sheet" label="Excel / CSV" />
                        <Tab value="sql" label="SQL script" />
                    </Tabs>
                    {tab === 'sheet' ? <SheetImport /> : <SqlImport />}
                </S.Content>
            </S.Container>
        </>
    )
}
