export enum SalesQuery {
  q001 = `SELECT * FROM sales`,
  q002 = `SELECT * FROM sales WHERE Id = ?`,
  q003 = `SELECT Id FROM sales WHERE SalesNumber = ?`,
  q006 = `SELECT Id FROM sales WHERE Id = ?`,
  q009 = `DELETE FROM sales`,
  q010 = `DELETE FROM sales WHERE Id = ?`,
  q011 = `SELECT sales.Id, sales.SalesNumber, sales.SalesDate, sales.TransactionId, sales.UserId, user.Name, sales.MerchantName, sales.MerchantId, sales.ProductName, sales.ProductPrice, sales.Currency, sales.TotalAmount, sales.PaymentMethod, sales.PaymentToken, sales.ProductType, sales.ProductId, sales.BillingAddress, sales.Status, sales.DateCreated, sales.DateUpdated FROM sales LEFT JOIN user ON user.Id = sales.UserId WHERE sales.Id = ?`,
  q012 = `SELECT sales.Id, sales.SalesNumber, sales.SalesDate, sales.TransactionId, sales.UserId, user.Name, sales.MerchantName, sales.MerchantId, sales.ProductName, sales.ProductPrice, sales.Currency, sales.TotalAmount, sales.PaymentMethod, sales.PaymentToken, sales.ProductType, sales.ProductId, sales.BillingAddress, sales.Status, sales.DateCreated, sales.DateUpdated FROM sales LEFT JOIN user ON user.Id = sales.UserId`,
  q013 = "SELECT 'Category' AS `Type`, COUNT(DISTINCT `Id`) AS `Count` FROM `category` UNION ALL SELECT 'Chapter' AS `Type`, COUNT(DISTINCT `Id`) AS `Count` FROM `chapter` UNION ALL SELECT 'Product' AS `Type`, COUNT(DISTINCT `Id`) AS `Count` FROM `product` UNION ALL SELECT 'Sales' AS `Type`, COUNT(DISTINCT `Id`) AS `Count` FROM `sales` UNION ALL SELECT 'Term' AS `Type`, COUNT(DISTINCT `Id`) AS `Count` FROM `term` UNION ALL SELECT 'TermLine' AS `Type`, COUNT(DISTINCT `Id`) AS `Count` FROM `termline` UNION ALL SELECT 'User' AS `Type`, COUNT(DISTINCT `Id`) AS `Count` FROM `user`",
}
