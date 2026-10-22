type DbFields = {
  [key: string]: Array<any>;
};

export const DBFields: DbFields = {
  t001f: ["Category", "Description", "CreatedBy", "DateCreated"],
  t002f: ["Title", "CreatedBy", "DateCreated"],
  t003f: ["Name", "Coins", "Price", "CreatedBy", "DateCreated"],//
  t004f: ["SalesNumber", "SalesDate", "TransactionId", "UserId", "MerchantName", "MerchantId", "ProductName", "ProductPrice", "Currency", "TotalAmount", "PaymentMethod", "PaymentToken", "ProductType", "ProductId", "BillingAddress", "Status", "DateCreated", "DateUpdated"],
  t005f: ["ChapterId","Term","Focus","Definition","VoiceOver","CreatedBy","DateCreated","UpdatedBy","DateUpdated"],
  t006f: ["TermId","CategoryId","Term","Description","CreatedBy","DateCreated","UpdatedBy","DateUpdated"],
  t007f: ["AccountType","GoogleId","Name","Email","Password","ProfilePhoto","DateCreated","DateUpdated"],
  t008f: ["UserId", "Coins", "DateCreated", "DateUpdated"],
  t009f: ["UserId","ChapterId","TermId","Status","DateCreated","DateUpdated"],
};
