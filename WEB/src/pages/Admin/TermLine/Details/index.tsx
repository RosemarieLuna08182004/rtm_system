import { ButtonType, RouteChannel, SFC } from "../../../../types";
import { CustomButton, PageBreadCrumbs, SubTermForm, SubTermPreview } from "../../../../components";
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from "react";
import * as S from '../../../../styles/Styles'

export const AdminTermLineDetailsPage : SFC = ({ClassName}) => {
    const navigate = useNavigate()
    // Opens as a preview; Edit shows the form. Save or Cancel returns to the preview.
    const [isEdit, setIsEdit] = useState(false);
    const { Id } = useParams<{ Id?: string }>()
    const links = [
        { Text: 'Dashboard', OnClick: () => navigate(RouteChannel.DASHBOARD) },
        { Text: 'Sub Term', OnClick: () => navigate(RouteChannel.TERM_LINE) }
    ]

    return (
        <>
        <S.Container className={ClassName}>
            <S.PageTopBar className="breadcrumbs w-full bg-white mb-2 rounded-md text-zinc-800 flex flex-col md:flex-row items-center justify-between p-2 md:h-[50px]">
                <S.Actions className="flex justify-between w-full items-center">
                    <PageBreadCrumbs Links={links} Active="Sub Term Details"/>
                    <S.Actions className="flex justify-end gap-2">
                        {isEdit
                            ? <CustomButton icon={<CloseIcon className="md:text-white text-primary" />} onClick={() => setIsEdit(false)} text='Cancel' type={ButtonType.button}/>
                            : <CustomButton icon={<EditIcon className="md:text-white text-primary" />} onClick={() => setIsEdit(true)} text='Edit' type={ButtonType.button}/>}
                        <CustomButton  icon={<ArrowBackIcon className="md:text-white text-primary" />} onClick={()=>navigate(RouteChannel.TERM_LINE)} text={'Back'} type={ButtonType.button} />
                    </S.Actions >
                </S.Actions>
            </S.PageTopBar>
            {isEdit ? (
                <S.Content className="flex mb-2 flex-col bg-white w-full h-fit rounded-md text-zinc-800 flex items-center px-3 py-2">
                    <SubTermForm Title={"Edit Sub Term"} Description="One piece of a term's content: its category, position and text." IsDetails={true} OnSaved={() => setIsEdit(false)}/>
                </S.Content>
            ) : (
                <S.Content className="flex mb-2 flex-col w-full rounded-md text-zinc-800 items-center py-1">
                    <SubTermPreview Id={Number(Id || 0)} />
                </S.Content>
            )}
        </S.Container>
        </>
    )
}
