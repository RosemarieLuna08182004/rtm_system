import { ButtonType, HeaderProps, RouteChannel, SFC } from "../../../types";
import { cn } from "../../../utils";
import { mdiMenu } from "@mdi/js";
import { Icon } from "../../Icon";
import { CircleButton } from "../../FormInputs";
import { Avatar, TextField } from "@mui/material";
import { colors } from "../../../styles";
import { AddNewDropDown } from "../../DropDown";
import { useAuth } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import * as S from '../../../styles'

export const Header:SFC<HeaderProps> = ({ClassName, Toggle}) => {
    const {auth} = useAuth()
    const navigate = useNavigate()

    return (
        <>
        <S.Container className={cn("",ClassName)}>
            <S.Content className="w-full ">
                <S.Divider className="md:hidden flex flex-row gap-2 items-center w-full">
                    <S.Span onClick={Toggle} className="cursor-pointer flex items-center justify-center rounded-full w-[40px] h-[40px]" style={{background:colors.palette.neutral['100']}}>
                        <Icon icon={mdiMenu}  ClassName="text-primary "/>
                    </S.Span >
                    <CircleButton OnClick={() => { } } IsNotification={false} Icon={<SearchIcon className="text-primary" />} Type={ButtonType.button} />
                </S.Divider>
                <S.Divider className="hidden md:block">
                    <TextField sx={{ width: { xs: '100%', sm: '100%', md: '500px' }, "& .MuiOutlinedInput-root": { borderRadius: "40px", background:'white', border:`1px solid ${colors.primary}`}, }} label="" id="Search" size="small" name="filter" placeholder={'Search'}/>
                </S.Divider>
            </S.Content>
            <S.Content className="flex flex-row gap-2">
                <AddNewDropDown />
                <CircleButton OnClick={() => navigate(RouteChannel.NOTIFICATIONS)} IsNotification={false} Icon={<NotificationsIcon className="text-primary"/>} Type={ButtonType.button}/>
                <Avatar src={auth?.user?.ProfilePhoto ?? ''} sx={{background:S.colors.primary}} onClick={() => navigate(`${RouteChannel.PROFIFLE.slice(0,RouteChannel.PROFIFLE.length-3)}${auth?.user?.Id??0}`)} className="uppercase flex justify-center items-center cursor-pointer bg-primary text-primary"><S.Span className="text-white font-semibold">{auth?.user?.ProfilePhoto?'':auth.user.Name.charAt(0)}</S.Span></Avatar>
            </S.Content>
        </S.Container>
        </>
    )
}