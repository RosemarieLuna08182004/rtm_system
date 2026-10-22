import { Logs } from "./generic"

export interface CategoryTable extends Logs {
    Id?:string
    Category:string
    Description:string
}
export type CategoryTables = CategoryTable[]
