import { ButtonType, DBTable, RouteChannel, SFC, termHC } from "../../../../types";
import * as S from '../../../../styles/Styles'
import { ChapterForm, CustomButton, EnhancedTable, PageBreadCrumbs, Skeleton } from "../../../../components";
import { useNavigate, useParams } from "react-router-dom";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useGetAllTermByChapter, useToggle } from "../../../../hooks";
import { Suspense } from "react";

export const AdminChapterDetailsPage : SFC = ({ClassName}) => {
    const navigate = useNavigate()
    const [isEdit, toggleEdit ] = useToggle(false);
    const links = [
        { Text: 'Dashboard', OnClick: () => navigate(RouteChannel.DASHBOARD) },
        { Text: 'Volume', OnClick: () => navigate(RouteChannel.CHAPTER) }
    ]
    const { Id } = useParams<{ Id?: string }>()
    const { records, refetch, loading } = useGetAllTermByChapter(parseInt(`${Id||0}`,10))
    return (
        <>
        <S.Container className={ClassName}>
            <S.PageTopBar className="breadcrumbs w-full  bg-white mb-2 rounded-md text-zinc-800 flex flex-col md:flex-row items-center justify-between p-2 md:h-[50px]">
                <S.Actions className="flex justify-between w-full items-center">
                    <PageBreadCrumbs Links={links} Active="Volume Details"/>
                    <S.Actions className="flex justify-end gap-2">
                        <CustomButton  icon={isEdit?  <LockIcon className="md:text-white text-primary" /> : <LockOpenIcon className="md:text-white text-primary" />} onClick={toggleEdit} text={isEdit? 'Lock' : 'Unlock'} type={ButtonType.button}/>
                        <CustomButton  icon={<ArrowBackIcon className="md:text-white text-primary" />} onClick={()=>navigate(RouteChannel.CHAPTER)} text={'Back'} type={ButtonType.button} />
                    </S.Actions >
                </S.Actions>
            </S.PageTopBar>
            <S.Content className="flex mb-2 flex-col bg-white w-full h-fit rounded-md text-zinc-800 flex items-center px-3 py-2">
                <Suspense fallback={<Skeleton/>}>
                    <ChapterForm Title="Volume Details" IsEdit={!isEdit}/>
                </Suspense>
            </S.Content> 
            <S.Content className="flex mb-2 flex-col bg-white w-full h-fit rounded-md text-zinc-800 flex items-center px-3 py-2">
                <Suspense fallback={<Skeleton/>}>
                    <EnhancedTable IsLoading={loading} Title="Volume Terms" Rows={records} HeadCells={termHC} OnRecordDelete={()=>refetch()} IsRemove={false} RemoveTable={DBTable.TERM}/>
                </Suspense>
            </S.Content> 
        </S.Container> 
        </>
    )
}