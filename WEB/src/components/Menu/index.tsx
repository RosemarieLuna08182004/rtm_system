import { MenuProps, SFC } from "../../types";
import UIcon from '@mdi/react'
import { twMerge } from "tailwind-merge";

// Sidebar item. The page you're on is solid blue; others are white and tint on hover.
export const Menu: SFC<MenuProps> = ({icon, label, onClick, active = false}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-current={active ? 'page' : undefined}
            className={twMerge(
                "group mb-2 w-full rounded-md cursor-pointer transition-all duration-200 ease-out",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                "active:scale-[0.98]",
                active
                    ? "bg-[#1030a4] text-white shadow-md ring-1 ring-white/40"
                    : "bg-white text-primary hover:bg-blue-50 hover:translate-x-0.5"
            )}
        >
            <div className="flex items-center p-2">
                <UIcon path={icon} size={'30px'} className={active ? 'text-white' : 'text-[#1B42CE]'} />
                <span className={twMerge("ml-2 font-psemibold text-lg", active ? "text-white" : "text-primary group-hover:text-[#1030a4]")}>{label}</span>
            </div>
        </button>
    )
}
