import { Id, Logs } from "../utils"

export interface ChapterTable extends Id, Logs {
    Title:string
}

export type ChapterTables = ChapterTable[]
