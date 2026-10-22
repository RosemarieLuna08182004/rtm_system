import { Id, Logs } from "../";

export interface CategoryTable extends Id, Logs {
  Category: string;
  Description: string;
}

export const CategoryInitial: CategoryTable = {
  Category: "",
  Description: ""
}