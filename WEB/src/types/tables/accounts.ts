import { Roles } from "../components"
import { Dict } from "../utils"

export interface Id {
    Id?: string
}

export interface AccountTable extends Id {
    AccountType?: Roles
    Username: string
    Password?: string
    Email: string
    Firstname: string
    Middlename?: string
    Lastname: string
    Fullname?: string
    Gender: string
    ContactNumber: string
    Address: string
    Birthdate: Date | string
    Image?: string | null
    SchoolId?: number | null
    UserId?: number | null
    IdNumber?:number
    Course?:string
    Campus?:string
    DateGraduated?: Date| string
    CreatedBy?: number
    DateCreated?: Date | string
    UpdateBy?:number
    DateUpdated?: Date | string
}

export interface AdminTable extends Id {
    UserId: number
    SchoolId: number
    CreatedBy: number
    DateCreated: Date
    UpdatedBy?: number
    DateUpdated?: Date
}

export interface AlumniTable extends Id {
    UserId: number
    SchoolId: number
    Linkname?: string
    LinkUrl?: string
    Batch: string
    Industry: string
    Job: string
    CreatedBy: number
    DateCreated: Date
    UpdatedBy?: number
    DateUpdated?: Date
}

export interface HEITable extends Id {
    UserId: number
    SchoolId: number
    Position: string
    CreatedBy: number
    DateCreated: Date
    UpdatedBy?: number
    DateUpdated?: Date
}

export type AccountTables = Dict<AccountTable>
export type AdminTables = Dict<AdminTable>
export type AlumniTables = Dict<AlumniTable>
export type HEITables = Dict<HEITable>