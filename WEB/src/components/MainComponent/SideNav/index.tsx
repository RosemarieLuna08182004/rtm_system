import { GenericFunction, RouteChannel, SFC } from "../../../types";
import * as S from '../../../styles'
import { Menu, MenuSection } from "../../Menu";
import { mdiCogOutline , mdiBookOutline  ,mdiHome,  mdiFormSelect, mdiTextShort, mdiCardTextOutline, mdiAccountGroupOutline, mdiLogout } from "@mdi/js";
import { useNavigate } from "react-router-dom";
import { useConfirmLogout } from "../../../context";
import { twMerge } from "tailwind-merge";

interface SideNavProps {
    Toggle: GenericFunction
}

export const SideNav : SFC<SideNavProps> = ({ClassName, Toggle}) => {
    const navigate = useNavigate();
    const confirmLogout = useConfirmLogout() // asks "Log out?" first

    return (
        <>
            <S.Container className={twMerge("", ClassName)}>
                <S.Divider className="mb-4 flex justify-center items-center gap-0 h-12 px-0">
                    <S.Image src={'/image/R-white.png'} className="w-[80px] shrink-0" />
                    <S.Divider className="flex flex-col leading-tight">
                        <S.Span className="text-white font-bold text-lg tracking-wide">RTM</S.Span>
                        <S.Span className="text-blue-200 text-xs">Roots, Terms, Morphology</S.Span>
                    </S.Divider>
                </S.Divider>
                <nav aria-label="Main" className="flex flex-col gap-1">
                    <Menu icon={ mdiHome } label="Dashboard" to={RouteChannel.DASHBOARD} onClick={() => {Toggle();navigate(RouteChannel.DASHBOARD)}} />

                    <MenuSection label="Knowledge" />
                    <Menu icon={ mdiBookOutline } label="Volumes" to={RouteChannel.CHAPTER} onClick={() => {Toggle();navigate(RouteChannel.CHAPTER)}} />
                    <Menu icon={ mdiTextShort } label="Terms" to={RouteChannel.TERM} onClick={() => {Toggle();navigate(RouteChannel.TERM)}} />
                    <Menu icon={ mdiCardTextOutline } label="Sub Terms" to={RouteChannel.TERM_LINE} onClick={() => {Toggle();navigate(RouteChannel.TERM_LINE)}} />
                    <Menu icon={ mdiFormSelect } label="Categories" to={RouteChannel.CATEGORY} onClick={() => {Toggle();navigate(RouteChannel.CATEGORY)}} />

                    <MenuSection label="Management" />
                    <Menu icon={ mdiAccountGroupOutline } label="Users" to={RouteChannel.USER} onClick={() => {Toggle();navigate(RouteChannel.USER)}} />

                    <MenuSection label="System" />
                    <Menu icon={ mdiCogOutline } label="Settings" to={RouteChannel.SETTINGS} onClick={() => {Toggle();navigate(RouteChannel.SETTINGS)}} />
                    <Menu icon={ mdiLogout } label="Logout" onClick={confirmLogout} />
                </nav>
            </S.Container>
        </>
    )
}