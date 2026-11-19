import { Id, Logs } from "../";

export interface ProductTable extends Id, Logs {
  Name: string;
  Price: number;
}

export const ProductInitial: ProductTable = {
  Name: "",
  Price: 0
}