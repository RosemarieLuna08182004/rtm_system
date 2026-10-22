import { Id, Logs } from "../utils"

export interface TermTable extends Id, Logs {
    ChapterTitle?:string
    ChapterId: number;
    Term: string | null;
    Focus: string | null;
    Definition: string | null;
    VoiceOver: string | null;
    Illustration: string | null ;
}
  
export type TermTables = TermTable[]
