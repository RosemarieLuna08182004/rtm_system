import { ButtonType, DBTable, RouteChannel, SFC, termLineHC } from "../../../types";
import * as S from '../../../styles/Styles'
import { CustomButton, PageBreadCrumbs, EnhancedTable, Skeleton, AttentionFilterBanner } from "../../../components";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import { useAttentionFilter, useGetAllTermLine } from "../../../hooks";
import { Suspense, useMemo } from "react";
import { useSearch } from "../../../context";

export const AdminTermLinePage : SFC = ({ClassName}) => {
    const navigate = useNavigate()
    const links = [{ Text: 'Dashboard', OnClick: () => navigate(RouteChannel.DASHBOARD) }]
    const { records, refetch, loading } = useGetAllTermLine()
    const { searchQuery } = useSearch()
    const { filter, applyFilter, clearFilter } = useAttentionFilter()

    const filteredRecords = useMemo(() => {
        const flagged = applyFilter(records);
        if (!searchQuery.trim()) return flagged;
        return flagged.filter((row) =>
            Object.values(row).some((val) =>
                val?.toString().toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [records, searchQuery, applyFilter]);

    return (
        <>
        <S.Container className={ClassName}>
            <S.PageTopBar className="breadcrumbs w-full  bg-white mb-2 rounded-md text-zinc-800 flex flex-col md:flex-row items-center justify-between p-2 md:h-[50px]">
                <S.Actions className="flex justify-between w-full items-center">
                    <PageBreadCrumbs Links={links} Active="Sub Terms"/>
                    <CustomButton  icon={<AddIcon className="md:text-white text-primary" />} onClick={()=>navigate(RouteChannel.NEW_TERM_LINE)} text={'New'} type={ButtonType.button} />
                </S.Actions >
            </S.PageTopBar>
            {filter && !loading && <AttentionFilterBanner Filter={filter} Shown={applyFilter(records).length} Noun="sub terms" OnClear={clearFilter} />}
            <S.Content className="flex mb-2 flex-col bg-white w-full h-fit rounded-md text-zinc-800 flex items-center px-3 py-2">
                <Suspense fallback={<Skeleton />}>
                    <EnhancedTable IsLoading={loading} Title="Sub Terms" Description="The content under each term: roots, morphology, brief definitions and more." Rows={filteredRecords} HeadCells={termLineHC} OnRecordDelete={()=>refetch()} RemoveTable={DBTable.TERM_LINE_ROUTE} ClassName="md:max-h-[calc(100vh-156px)]"/>
                </Suspense>
            </S.Content> 
        </S.Container> 
        </>
    )
}