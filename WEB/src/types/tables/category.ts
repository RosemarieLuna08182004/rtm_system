import { Id, Logs } from "../utils"

export interface CategoryTable extends Id, Logs {
    Category:string
    Description: string
    /** How many sub terms use this category (only on the single-category response) */
    SubTermCount?: number
}

export type CategoryTables = CategoryTable[]
