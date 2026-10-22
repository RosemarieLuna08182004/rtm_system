
import { Id, Status, Logs } from "../utils"

export interface UserTerm extends Id, Logs {
    UserId: number
    ChapterId?: number | null
    TermId?:number | null
    Status?: Status
}

export type UserTerms = UserTerm[]