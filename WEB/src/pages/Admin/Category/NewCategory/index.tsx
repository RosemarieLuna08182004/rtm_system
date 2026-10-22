import { ButtonType, RouteChannel, SFC } from "../../../../types";
import * as S from '../../../../styles/Styles'
import { CategoryForm, CustomButton, PageBreadCrumbs } from "../../../../components";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const AdminNewCategoryPage : SFC = ({ClassName}) => {
    const navigate = useNavigate()
    const links = [
        { Text: 'Dashboard', OnClick: () => navigate(RouteChannel.DASHBOARD) },
        { Text: 'Category', OnClick: () => navigate(RouteChannel.CATEGORY) }
    ]

    return (
        <>
        <S.Container className={ClassName}>
            <S.PageTopBar className="breadcrumbs w-full  bg-white mb-2 rounded-md text-zinc-800 flex flex-col md:flex-row items-center justify-between p-2 md:h-[50px]">
                <S.Actions className="flex justify-between w-full items-center">
                    <PageBreadCrumbs Links={links} Active="New Category"/>
                    <CustomButton  icon={<ArrowBackIcon className="text-primary md:text-white" />} onClick={()=>navigate(RouteChannel.CATEGORY)} text={'Back'} type={ButtonType.button} />
                </S.Actions >
            </S.PageTopBar>
            <S.Content className="flex mb-2 flex-col bg-white w-full h-fit rounded-md text-zinc-800 flex items-center px-3 py-2">
                <CategoryForm Title="New Category" IsEdit={false}/>
            </S.Content> 
        </S.Container> 
        </>
    )
}