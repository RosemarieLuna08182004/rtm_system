import { Id, Logs } from "../";

export interface TermLineTable extends Id, Logs {
  TermId: number;
  CategoryId: number;
  Term: string | null;
  Description: string | null;
  Position:number
  IsBorderLeft:boolean
  Illustration: string | null,
}

export const TermLineInitial: TermLineTable = {
  TermId: 0,
  CategoryId: 0,
  Term: null,
  Description: null,
  Position: 0,
  IsBorderLeft:false,
  Illustration:null,
}