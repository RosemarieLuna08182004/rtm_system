import { GenericFunction } from "../utils"
import { TermStatus } from "./status"

export enum ButtonType {
    button = 'button',
    submit = 'submit',
}

export enum ButtonColor {
    default = 'default',
    disabled = 'disabled',
    primary = 'primary',
    secondary = 'secondary'
}

export interface TouchableButtonProps {
    OnPress: GenericFunction
    Text: string
    BgStyle?: string
    TextStyle?: string
    IsLoading?:boolean
    Icon?:any
    Disabled?:boolean
}

export interface TermButtonProps {
    Text: string
    Status: TermStatus
    IsChapter?: boolean
    OnPress?: GenericFunction
    Disabled?: boolean
    OnRefresh?: GenericFunction
    OnUnbookmark?: GenericFunction
    data?: {TermId: number, UserTermsId: number}
    HighlightQuery?: string
}

export interface NavigationButtonProps {
    icon: any;
    title: string;
    tintColor?:any
    onPress: () => void;
    iconColor?: string;
    textColor?: string;
}

export interface BookmarkButtonProps {
    Status: TermStatus | string
    Disabled?: boolean
    UserTermsId?: number
    TermId?: number
    OnPress?: GenericFunction
    OnUnbookmark?: GenericFunction
    IsChapter?: boolean
    NoLoading?: boolean
    // "tile": white-on-blue rounded square (Terms screen rows); "header": plain white icon (term header)
    Variant?: 'default' | 'tile' | 'header'
}