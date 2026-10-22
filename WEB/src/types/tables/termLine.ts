import { Id, Logs } from "../utils"

export interface TermLineTable extends Id, Logs {
    TermName?:string
    TermId: number;
    CategoryId: number;
    Category?: string
    Term: string | null;
    Description: string | null;
    Position:number;
    IsBorderLeft:boolean;
    Illustration: string | null ;
  }
  
export type TermLineTables = TermLineTable[]
