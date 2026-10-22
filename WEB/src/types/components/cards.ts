import { GenericFunction } from "../utils"

export interface PostCardProps {
    userImage?:string
    userName: string
    userRole: string
    dateCreated: string
    texts?: string
    images?: string
}

export interface DashboardCardProps {
    Icons: string
    Text: string
    Title: string
    OnClick: GenericFunction
}

export interface TermCardProps {
    Refetch: () => void;
    ChapterTitle: string;
    TermId: number;
    TermTitle: string;
    Definition?: string;
    Focus?: string;
    Illustration?:string
    VoiceOver?:string
}

export interface SubTermCardProps {
   Id:number
   Category?:string
   Term:string
   Description?:TrustedHTML | string
   refetch: () => void,
   IsBorderLeft:boolean,
   Illustration?: string | null
}
