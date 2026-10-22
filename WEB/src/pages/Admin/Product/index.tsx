import { ButtonType, DBTable, productHC, RouteChannel, SFC } from "../../../types";
import * as S from '../../../styles/Styles'
import { CustomButton, PageBreadCrumbs, EnhancedTable, Skeleton } from "../../../components";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import { useGetAllProduct } from "../../../hooks";
import { Suspense } from "react";

export const AdminProductPage : SFC = ({ClassName}) => {
    const navigate = useNavigate()
    const links = [{ Text: 'Dashboard', OnClick: () => navigate(RouteChannel.DASHBOARD) }]
    const { records, refetch, loading } = useGetAllProduct()
    return (
        <>
        <S.Container className={ClassName}>
            <S.PageTopBar className="breadcrumbs w-full  bg-white mb-2 rounded-md text-zinc-800 flex flex-col md:flex-row items-center justify-between p-2 md:h-[50px]">
                <S.Actions className="flex justify-between w-full">
                    <PageBreadCrumbs Links={links} Active="Product"/>
                    <CustomButton  icon={<AddIcon className="md:text-white text-primary" />} onClick={()=>navigate(RouteChannel.NEW_PRODUCT)} text={'New'} type={ButtonType.button} />
                </S.Actions >
            </S.PageTopBar>
            <S.Content className="flex mb-2 flex-col bg-white w-full h-fit rounded-md text-zinc-800 flex items-center px-3 py-2">
                <Suspense fallback={<Skeleton />}>
                    <EnhancedTable IsLoading={loading} Title="Products" Rows={records} HeadCells={productHC} OnRecordDelete={()=>refetch()} RemoveTable={DBTable.PRODUCT} ClassName="md:max-h-[calc(100vh-200px)]"/>
                </Suspense>
            </S.Content> 
        </S.Container> 
        </>
    )
}