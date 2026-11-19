import { ButtonType, RouteChannel, SFC } from "../../../../types";
import * as S from '../../../../styles/Styles'
import { ChapterForm, CustomButton, PageBreadCrumbs, VolumePreview } from "../../../../components";
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from "react";

export const AdminChapterDetailsPage : SFC = ({ClassName}) => {
    const navigate = useNavigate()
    // Opens as a preview (title and its terms); Edit shows the form to rename it.
    // Save or Cancel returns to the preview.
    const [isEdit, setIsEdit] = useState(false);
    const links = [
        { Text: 'Dashboard', OnClick: () => navigate(RouteChannel.DASHBOARD) },
        { Text: 'Volume', OnClick: () => navigate(RouteChannel.CHAPTER) }
    ]
    const { Id } = useParams<{ Id?: string }>()
    return (
        <>
        <S.Container className={ClassName}>
            <S.PageTopBar className="breadcrumbs w-full  bg-white mb-2 rounded-md text-zinc-800 flex flex-col md:flex-row items-center justify-between p-2 md:h-[50px]">
                <S.Actions className="flex justify-between w-full items-center">
                    <PageBreadCrumbs Links={links} Active="Volume Details"/>
                    <S.Actions className="flex justify-end gap-2">
                        {isEdit
                            ? <CustomButton icon={<CloseIcon className="md:text-white text-primary" />} onClick={() => setIsEdit(false)} text='Cancel' type={ButtonType.button}/>
                            : <CustomButton icon={<EditIcon className="md:text-white text-primary" />} onClick={() => setIsEdit(true)} text='Edit' type={ButtonType.button}/>}
                        <CustomButton  icon={<ArrowBackIcon className="md:text-white text-primary" />} onClick={()=>navigate(RouteChannel.CHAPTER)} text={'Back'} type={ButtonType.button} />
                    </S.Actions >
                </S.Actions>
            </S.PageTopBar>
            {isEdit ? (
                <S.Content className="flex mb-2 flex-col bg-white w-full h-fit rounded-md text-zinc-800 flex items-center px-3 py-2">
                    <ChapterForm Title="Edit Volume" Description="The name of this volume as learners see it." OnSaved={() => setIsEdit(false)}/>
                </S.Content>
            ) : (
                <S.Content className="flex mb-2 flex-col w-full rounded-md text-zinc-800 items-center">
                    <VolumePreview Id={Number(Id || 0)} />
                </S.Content>
            )}
        </S.Container>
        </>
    )
}
