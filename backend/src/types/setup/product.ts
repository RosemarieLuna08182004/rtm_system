import { Id, Logs } from "../";

export interface ProductTable extends Id, Logs {
  Name: string;
  Coins: number;
  Price: number;
}

export const ProductInitial: ProductTable = {
  Name: "",
  Coins: 0,
  Price: 0
}