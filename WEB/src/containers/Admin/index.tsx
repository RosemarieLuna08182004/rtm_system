import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { mdiMenu } from "@mdi/js";
import { RouteChannel, SFC } from "../../types";
import { PageFooter, SideNav, Header } from "../../components";
import { Icon } from "../../components/Icon";
import { useToggle } from "../../hooks";
import * as S from '../../styles/Styles';
import { twMerge } from "tailwind-merge";
import { LogoutConfirmProvider, SearchProvider, UnsavedChangesProvider } from "../../context";

/**
 * App shell. It is pinned to the viewport (fixed inset-0) so its size never depends on
 * the page content or on the centering flex rules the global <body> uses for the auth pages.
 * The sidebar and the content column scroll independently, so there is no page-level
 * horizontal scroll and the sidebar always spans the full height.
 */
export const AdminLayout: SFC = ({ ClassName }) => {
    const [isSidebarOpen, toggle] = useToggle(false);
    const { pathname } = useLocation();
    const mainRef = useRef<HTMLElement>(null);
    // The full top bar (greeting, search, quick add, notifications, account) is the
    // Dashboard's landing banner; other pages use the space for content.
    const isDashboard = pathname === RouteChannel.DASHBOARD;

    // Reset the content column's scroll position on every route change.
    // Without this, navigating away from a page scrolled partway down (e.g. an
    // expanded "Needs Attention" list) carries that same scroll offset into the
    // next page, which can momentarily render with blank space above its header.
    useEffect(() => {
        mainRef.current?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, [pathname]);

    return (
        <SearchProvider>
        <UnsavedChangesProvider>
        <LogoutConfirmProvider>
        <S.Container className={twMerge("fixed inset-0 bg-primary", ClassName)}>
            <S.Content className="flex flex-col md:flex-row w-full h-full bg-primary">
                <S.Nav className={`sidebar ${isSidebarOpen ? 'block' : 'hidden'} md:block md:w-2/12 md:shrink-0 w-full h-full px-3 py-5 bg-gradient-to-b from-[#1342b8] to-[#123984] overflow-y-auto overscroll-contain`}>
                    <SideNav Toggle={toggle} />
                </S.Nav>
                <S.Main ref={mainRef} className="content flex-1 min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain p-3 bg-slate-100 flex flex-col">
                    {isDashboard ? (
                        <Header ClassName="w-full mb-2" Toggle={toggle}/>
                    ) : (
                        // Phones still need a way to open the sidebar; hidden from tablet width up
                        <S.Divider className="md:hidden flex items-center mb-2">
                            <button
                                type="button"
                                onClick={toggle}
                                aria-label="Open menu"
                                className="flex items-center justify-center rounded-full w-[40px] h-[40px] bg-white border border-slate-200 shadow-sm cursor-pointer"
                            >
                                <Icon icon={mdiMenu} ClassName="text-primary" />
                            </button>
                        </S.Divider>
                    )}
                    <S.Content className="w-full bg-slate-100 flex-1">
                        <Outlet />
                    </S.Content>
                    <PageFooter />
                </S.Main>            </S.Content>
        </S.Container>
        </LogoutConfirmProvider>
        </UnsavedChangesProvider>
        </SearchProvider>
    );
};