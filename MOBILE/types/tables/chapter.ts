import { Logs } from "./generic"

export interface ChapterTable extends Logs {
    Id?:string
    Title:string
    Status?:string
}
export type ChapterTables = ChapterTable[]
