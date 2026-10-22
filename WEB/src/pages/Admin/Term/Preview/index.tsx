import { ButtonType, RouteChannel, SFC } from "../../../../types";
import { CustomButton, PageBreadCrumbs, Skeleton, TermCard } from "../../../../components";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as S from '../../../../styles/Styles'
import { useGetTerm } from "../../../../hooks";
import { Suspense } from "react";

export const AdminTermPreviewPage : SFC = ({ClassName}) => {
    const navigate = useNavigate()
    const { Id } = useParams<{ Id?: string }>();
    const {records, refetch} = useGetTerm(parseInt(`${Id||0}`,10))

    const links = [
        { Text: 'Dashboard', OnClick: () => navigate(RouteChannel.DASHBOARD) },
        { Text: 'Term', OnClick: () => navigate(RouteChannel.TERM) },
        { Text: 'Term Details', OnClick: () => navigate(RouteChannel.TERM_DETAILS) }
    ]

    return (
        <>
        <S.Container className={ClassName}>
            <S.PageTopBar className="breadcrumbs w-full  bg-white mb-2 rounded-md text-zinc-800 flex flex-col md:flex-row items-center justify-between p-2 md:h-[50px]">
                <S.Actions className="flex justify-between w-full items-center">
                    <PageBreadCrumbs Links={links} Active={records.Term??"NA"} />
                    <CustomButton  icon={<ArrowBackIcon className="md:text-white text-primary" />} onClick={()=>navigate(`${RouteChannel.TERM_DETAILS.slice(0,10)}${Id}`)} text={'Back'} type={ButtonType.button} />
                </S.Actions >
            </S.PageTopBar>
            <S.Content className="flex mb-2 flex-col w-full  rounded-md text-zinc-800 flex items-center py-1 overflow-auto ">
                <Suspense fallback={<Skeleton />}>
                    <TermCard Illustration={records.Illustration??""} VoiceOver={records.VoiceOver??""} Refetch={refetch} ChapterTitle={records.ChapterTitle ?? ''} TermId={Number(Id || 0)} TermTitle={records.Term ?? ""} Definition={records.Definition ?? ""} Focus={records.Focus??""} />
                </Suspense>
            </S.Content> 
        </S.Container> 
        </>
    )
}