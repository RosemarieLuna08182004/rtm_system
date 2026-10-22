import { Id, Logs } from "../utils"

export interface ChapterTable extends Id, Logs {
    Title:string
    Coins:number
}

export type ChapterTables = ChapterTable[]
