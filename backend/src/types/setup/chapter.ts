import { Id, Logs } from "../";

export interface ChapterTable extends Id, Logs {
  Title: string;
  Coins: number
}


export const ChapterInitial: ChapterTable = {
  Title: "",
  Coins: 0
}