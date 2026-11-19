import { Roles } from "../components"
import { Id, Logs } from "../utils"

export interface UserTable extends Id, Logs {
    AccountType?: Roles
    GoogleId?: string | null
    Name: string
    Email: string
    /** Two-letter code (PH, US, ...); null for accounts made before it was asked */
    Country?: string | null
    Password?: string
    ProfilePhoto?: string | null
    AccessToken?: string | null
    UserId?:number
    IsBundle?:boolean
}

export type UserTables = UserTable[]
