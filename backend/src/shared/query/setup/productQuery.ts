export enum ProductQuery {
    q001 = `SELECT * FROM product`,
    q002 = `SELECT * FROM product WHERE Id = ?`,
    q003 = `SELECT Id FROM product WHERE Name = ?`,
    q004 = `SELECT * FROM product WHERE CreatedBy = ?`,
    q005 = `SELECT * FROM product WHERE UpdatedBy = ?`,
    q006 = `SELECT Id FROM product WHERE Id = ?`,
    q007 = "SELECT `Id` FROM `sales` WHERE `ProductId` = ? ",
    q008 = `DELETE FROM product`,
    q009 = `DELETE FROM product WHERE Id = ?`,
    q0010 = `SELECT product.Id, product.Name, product.Coins, product.Price, created.Name AS CreatedBy, product.DateCreated, updated.Name AS UpdatedBy, product.DateUpdated FROM product LEFT JOIN user AS created ON created.Id = product.CreatedBy LEFT JOIN user AS updated ON updated.Id = product.UpdatedBy WHERE product.Id = ?`,
    q0011 = `SELECT product.Id, product.Name, product.Coins, product.Price, created.Name AS CreatedBy, product.DateCreated, updated.Name AS UpdatedBy, product.DateUpdated FROM product LEFT JOIN user AS created ON created.Id = product.CreatedBy LEFT JOIN user AS updated ON updated.Id = product.UpdatedBy`,
};