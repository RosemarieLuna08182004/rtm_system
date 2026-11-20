import { useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { MenuProps, MenuSectionProps, RouteChannel } from "../../types";
import * as S from './Styles'

export const Menu = ({icon, label, onClick, to}: MenuProps) => {
    const { pathname } = useLocation();

    // Dashboard is '/a', which prefixes every other admin route, so it only matches exactly.
    const active = !!to && (pathname === to || (to !== RouteChannel.DASHBOARD && pathname.startsWith(`${to}/`)));

    return (
        <button
            type="button"
            aria-current={active ? 'page' : undefined}
            onClick={onClick}
            className={twMerge(
                "menu flex w-full items-center gap-4 rounded-xl px-3 py-2.5 text-left text-[15px] font-medium text-white",
                "cursor-pointer transition-colors duration-200 hover:bg-white/10",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                active && "bg-white/15 hover:bg-white/20"
            )}
        >
            <S.Icon path={icon} size={'22px'} />
            <span>{label}</span>
        </button>
    )
}

export const MenuSection = ({label}: MenuSectionProps) => {
    return (
        <div className="flex items-center gap-3 px-3 pt-6 pb-2" role="presentation">
            <span className="text-xs font-medium uppercase tracking-wider text-blue-200/80">{label}</span>
            <span className="h-px flex-1 bg-white/15" />
        </div>
    )
}