import { Id, Logs } from "../utils"

export interface ProductTable extends Id, Logs {
    Name:string
    Price: number
}

export type ProductTables = ProductTable[]
