import { Logs } from "./generic"

export interface TermTable extends Logs {
    Id?:string
    ChapterId: number
    Term:string
    Focus:string
    Definition: string
    VoiceOver?:string
    Illustration?:string
    Status?: string
    UserTermsId?:number
    TermId?:number
    TermLine?: any[]
}
export type TermTables = TermTable[]

export interface TermLineTable extends TermTable{
    Id?:string
    TermId:number
    Description?:string
    CategoryId:number
    Category?:string
    SubTerm?:string
    IsBorderLeft:boolean
    
}
export type TermLineTables = TermLineTable[]
