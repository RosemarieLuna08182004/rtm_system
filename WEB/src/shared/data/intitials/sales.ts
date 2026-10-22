import { Currency, SalesTable } from "../../../types";

export const salesInitial : SalesTable = {
    SalesNumber: "",
    SalesDate: new Date(),
    TransactionId: "",
    UserId: 0,
    MerchantName: "",
    MerchantId: 0,
    ProductName: "",
    ProductPrice: 0,
    Currency: Currency.AED,
    TotalAmount: 0,
    PaymentMethod: "",
    PaymentToken: "",
    ProductType: "",
    ProductId: 0,
    Status: 0
}