import { ButtonType, RouteChannel, SFC } from "../../../../types";
import * as S from '../../../../styles/Styles'
import { CustomButton, PageBreadCrumbs, ProductForm } from "../../../../components";
import { useNavigate } from "react-router-dom";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useToggle } from "../../../../hooks";

export const AdminProductDetailsPage : SFC = ({ClassName}) => {
    const navigate = useNavigate()
    const [isEdit, toggleEdit ] = useToggle(false);
    const links = [
        { Text: 'Dashboard', OnClick: () => navigate(RouteChannel.DASHBOARD) },
        { Text: 'Product', OnClick: () => navigate(RouteChannel.CHAPTER) }
    ]

    return (
        <>
        <S.Container className={ClassName}>
            <S.PageTopBar className="breadcrumbs w-full  bg-white mb-2 rounded-md text-zinc-800 flex flex-col md:flex-row items-center justify-between p-2 md:h-[50px]">
                <S.Actions className="flex justify-between w-full">
                    <PageBreadCrumbs Links={links} Active="Product Details"/>
                    <S.Actions className="flex justify-end gap-2">
                        <CustomButton  icon={isEdit?  <LockIcon className="md:text-white text-primary" /> : <LockOpenIcon className="md:text-white text-primary" />} onClick={toggleEdit} text={isEdit? 'Lock' : 'Unlock'} type={ButtonType.button}/>
                        <CustomButton  icon={<ArrowBackIcon className="md:text-white text-primary" />} onClick={()=>navigate(RouteChannel.PRODUCT)} text={'Back'} type={ButtonType.button} />
                    </S.Actions >
                </S.Actions>
            </S.PageTopBar>
            <S.Content className="flex mb-2 flex-col bg-white w-full h-fit rounded-md text-zinc-800 flex items-center px-3 py-2">
                <ProductForm Title="Product Details" IsEdit={!isEdit}/>
            </S.Content> 
        </S.Container> 
        </>
    )
}