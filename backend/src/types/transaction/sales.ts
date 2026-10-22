import { Id, Logs, Currency } from "..";

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

export const SalesInitial: SalesTable = {
  SalesNumber: "",
  SalesDate: new Date(),
  TransactionId: "",
  UserId: 0,
  MerchantName: "",
  MerchantId: 0,
  ProductName: "",
  ProductPrice: 0,
  Currency: Currency.PHP,
  TotalAmount: 0,
  PaymentMethod: "",
  PaymentToken: "",
  ProductType: "",
  ProductId: 0,
  Status: 0
}