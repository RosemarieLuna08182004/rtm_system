import { Logs } from "./generic";

export interface UserTable extends Logs{
    Id?:string
    AccountType:string
    GoogleId?:string | null
    Name:string
    Email:string
    /** Two-letter code (PH, US, ...); missing for older accounts */
    Country?:string | null
    Password?:string | null
    ProfilePhoto?:string | null
    AccessToken?:string | null
}

export type UserTables = UserTable[]
