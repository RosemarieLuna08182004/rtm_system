import { Id, Logs } from "../";

export interface ChapterTable extends Id, Logs {
  Title: string;
}


export const ChapterInitial: ChapterTable = {
  Title: "",
}