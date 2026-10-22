import { Id, Logs } from "../";

export interface TermTable extends Id, Logs {
  ChapterId: number;
  Term: string | null;
  Focus: string | null;
  Definition?: string | null;
  VoiceOver?: string | null;
  Illustration?:string | null
}

export const TermInitial: TermTable = {
  ChapterId: 0,
  Term: null,
  Focus: null,
  Definition: null,
  VoiceOver: null,
  Illustration:null,
}