import { Id, Logs } from "../utils"

export interface ProductTable extends Id, Logs {
    Name:string
    Coins: number
    Price: number
}

export type ProductTables = ProductTable[]
