import { GenericFunction, RouteChannel, SFC } from "../../../types";
import * as S from '../../../styles'
import { Menu } from "../../Menu";
import { mdiCogOutline , mdiBookOutline  ,mdiViewDashboardOutline,  mdiFormSelect, mdiTextShort, mdiCardTextOutline, mdiSaleOutline , mdiTagOutline, mdiAccountGroupOutline, mdiLogout } from "@mdi/js";
import { useLocation, useNavigate } from "react-router-dom";
import { useSignOut } from "../../../hooks";
import { twMerge } from "tailwind-merge";

interface SideNavProps {
    Toggle: GenericFunction
}

export const SideNav : SFC<SideNavProps> = ({ClassName, Toggle}) => {
    const navigate = useNavigate();
    const {reSignOut} = useSignOut()
    const { pathname } = useLocation();
    // Highlight the section you are in ("/a/term" must not also light up "/a/termline").
    const is = (route: string) => route === RouteChannel.DASHBOARD
        ? pathname === route || pathname === route + '/'
        : pathname === route || pathname.startsWith(route + '/');

    return (
        <>
            <S.Container className={twMerge("", ClassName)}>
                <S.Divider className="mb-2 flex justify-center items-center h-12">
                    <S.Image src={'/image/R-white.png'} className=" w-[60px] " />
                </S.Divider>
                <S.Divider className="mb-2" >
                    <Menu icon={ mdiViewDashboardOutline } label="Dashboard" onClick={() => {Toggle();navigate(RouteChannel.DASHBOARD)}} active={is(RouteChannel.DASHBOARD)} />
                    <Menu icon={ mdiBookOutline } label="Volume" onClick={() => {Toggle();navigate(RouteChannel.CHAPTER)}} active={is(RouteChannel.CHAPTER)} />
                    <Menu icon={ mdiTextShort } label="Term" onClick={() => {Toggle();navigate(RouteChannel.TERM)}} active={is(RouteChannel.TERM)} />
                    <Menu icon={ mdiCardTextOutline } label="Sub Term" onClick={() => {Toggle();navigate(RouteChannel.TERM_LINE)}} active={is(RouteChannel.TERM_LINE)} />
                    <Menu icon={ mdiFormSelect } label="Category" onClick={() => {Toggle();navigate(RouteChannel.CATEGORY)}} active={is(RouteChannel.CATEGORY)} />
                    <Menu icon={ mdiTagOutline } label="Product" onClick={() => {Toggle();navigate(RouteChannel.PRODUCT)}} active={is(RouteChannel.PRODUCT)} />
                    <Menu icon={ mdiAccountGroupOutline } label="Users" onClick={() => {Toggle();navigate(RouteChannel.USER)}} active={is(RouteChannel.USER)} />
                    <Menu icon={ mdiSaleOutline } label="Sales" onClick={() => {Toggle();navigate(RouteChannel.SALES)}} active={is(RouteChannel.SALES)} />
                    <hr className="border-secondary"/>
                </S.Divider>
                <S.Divider className="bottom-0 relative border-top">
                    <Menu icon={ mdiCogOutline } label="Settings" onClick={() => {Toggle();navigate(RouteChannel.SETTINGS)}} active={is(RouteChannel.SETTINGS)} />
                    <Menu icon={ mdiLogout  } label="Logout" onClick={reSignOut} />
                </S.Divider>
            </S.Container>
        </>
    )
}