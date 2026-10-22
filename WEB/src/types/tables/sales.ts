import { Currency, Id, Logs } from "../utils"

export interface SalesTable extends Id, Logs {
    SalesNumber: string;
    SalesDate: Date;
    TransactionId: string;
    UserId: number;
    MerchantName: string;
    MerchantId: number;
    ProductName: string;
    ProductPrice: number;
    Currency: Currency;
    TotalAmount: number;
    PaymentMethod: string;
    PaymentToken: string;
    ProductType: string;
    ProductId: number;
    BillingAddress?: string | null; // optional
    Status: number;
}

export type SalesTables = SalesTable[]
