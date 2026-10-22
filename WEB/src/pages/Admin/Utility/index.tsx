import { ButtonType, RouteChannel, SFC } from "../../../types";
import * as S from '../../../styles';
import { twMerge } from "tailwind-merge";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CustomButton, PageBreadCrumbs, SubTermDataTranslator, TermDataTranslator } from "../../../components";
import { useNavigate } from "react-router-dom";

export const UtilityPage: SFC = ({ ClassName }) => {
    const navigate = useNavigate();
    const links = [
        { Text: 'Dashboard', OnClick: () => navigate(RouteChannel.DASHBOARD) },
        { Text: 'Settings', OnClick: () => navigate(RouteChannel.SETTINGS) },
    ];

    return (
        <>
            <S.Container className={twMerge("", ClassName)}>
                <S.PageTopBar className="breadcrumbs w-full bg-white mb-2 rounded-md text-zinc-800 flex flex-col md:flex-row items-center justify-between p-2 md:h-[50px]">
                    <S.Actions className="flex justify-between w-full items-center">
                        <PageBreadCrumbs Links={links} Active="Utility" />
                        <CustomButton  icon={<ArrowBackIcon className="md:text-white text-primary" />} onClick={()=>navigate(RouteChannel.SETTINGS)} text='Back' type={ButtonType.button} />
                    </S.Actions>
                </S.PageTopBar>
                <S.Content className="flex mb-2 flex-col bg-white w-full h-fit rounded-md text-zinc-800 items-center px-3 py-2">
                    <TermDataTranslator />
                </S.Content>
                <S.Content className="flex mb-2 flex-col bg-white w-full h-fit rounded-md text-zinc-800 items-center px-3 py-2">
                    <SubTermDataTranslator />
                </S.Content>
            </S.Container>
        </>
    );
};
