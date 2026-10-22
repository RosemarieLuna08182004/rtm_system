import { Logs } from "./generic"

export interface UserTermsTable extends Logs {
    Id?:string
    UserId:number
    ChapterId?:number
    TermId:string
    Status:number
}
export type UserTermsTables = UserTermsTable[]
