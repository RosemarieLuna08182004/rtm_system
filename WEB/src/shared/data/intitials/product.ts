import { ProductTable } from "../../../types";

export const productInitial : ProductTable = {
    Name: "",
    Coins: 0,
    Price: 0
}

export type Product = typeof productInitial