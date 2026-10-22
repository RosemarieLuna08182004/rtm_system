import { Roles } from "../components"
import { Id, Logs } from "../utils"

export interface UserTable extends Id, Logs {
    AccountType?: Roles
    GoogleId?: string | null
    Name: string
    Email: string
    Password?: string
    ProfilePhoto?: string | null
    AccessToken?: string | null
    UserId?:number
    Coins?:number
    IsBundle?:boolean
}

export type UserTables = UserTable[]
