import { Id, Logs } from "../utils"

export interface CategoryTable extends Id, Logs {
    Category:string
    Description: string
}

export type CategoryTables = CategoryTable[]
