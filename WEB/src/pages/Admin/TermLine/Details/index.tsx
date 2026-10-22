import { ButtonType, RouteChannel, SFC } from "../../../../types";
import { CustomButton, PageBreadCrumbs, SubTermForm } from "../../../../components";
import { useNavigate } from "react-router-dom";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useToggle } from "../../../../hooks";
import * as S from '../../../../styles/Styles'

export const AdminTermLineDetailsPage : SFC = ({ClassName}) => {
    const navigate = useNavigate()
    const [isEdit, toggleEdit ] = useToggle(false);
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
                        <CustomButton  icon={isEdit?  <LockIcon className="md:text-white text-primary" /> : <LockOpenIcon className="md:text-white text-primary" />} onClick={toggleEdit} text={isEdit? 'Lock' : 'Unlock'} type={ButtonType.button}/>
                        <CustomButton  icon={<ArrowBackIcon className="md:text-white text-primary" />} onClick={()=>navigate(RouteChannel.TERM_LINE)} text={'Back'} type={ButtonType.button} />
                    </S.Actions >
                </S.Actions>
            </S.PageTopBar>
            <S.Content className="flex mb-2 flex-col bg-white w-full h-fit rounded-md text-zinc-800 flex items-center px-3 py-2">
                <SubTermForm Title={"Sub Term Details"} IsEdit={!isEdit} IsDetails={true}/>
            </S.Content> 
        </S.Container> 
        </>
    )
}