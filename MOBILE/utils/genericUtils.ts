import { colors } from "@/styles";
import { ButtonColor } from "@/types";

export const renderColor = (Color:ButtonColor) => {
    let bgColor = ''
    let txtColor = ''
    switch (Color) {
        case ButtonColor.disabled:
            bgColor = 'bg-slate-200'
            txtColor = 'text-slate-800'
            break;
        case ButtonColor.primary:
            bgColor = `bg-blue-600`
            txtColor = 'text-white'
            break;
        case ButtonColor.secondary:
            bgColor = `bg-${colors.secondary}`
            txtColor = 'text-slate-800'
            break;
        default:
            bgColor = `bg-white`
            txtColor = `text-sky-blue-200`
            break;
    }
    return {bg:bgColor, color:txtColor};
}