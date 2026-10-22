export enum CategoryQuery {
    q001 = "SELECT `category`.`Id`, `category`.`Category`, `category`.`Description`, `created`.`Name` AS `CreatedBy`, `category`.`DateCreated`, `updated`.`Name` AS `UpdatedBy`, `category`.`DateUpdated` FROM `category` LEFT JOIN `user` AS `created` ON `created`.`Id` = `category`.`CreatedBy` LEFT JOIN `user` AS `updated` ON `updated`.`Id` = `category`.`UpdatedBy` WHERE `category`.`Id` = ?", //get
    q002 = "SELECT `category`.`Id`, `category`.`Category`, `category`.`Description`, `created`.`Name` AS `CreatedBy`, `category`.`DateCreated`, `updated`.`Name` AS `UpdatedBy`, `category`.`DateUpdated` FROM `category` LEFT JOIN `user` AS `created` ON `created`.`Id` = `category`.`CreatedBy` LEFT JOIN `user` AS `updated` ON `updated`.`Id` = `category`.`UpdatedBy`", //get-all
    q003 = "SELECT `Id` FROM `category` WHERE `Category` = ?",// check duplicate in addModel
    q004 = "SELECT `Id` FROM `termline` WHERE `CategoryId`= ? ", // check transactions in removeModel
    q005 = "SELECT `Id` FROM `category` WHERE `Id`= ? ", // check if record exists on getModel
    q006 = "'SELECT `Id` FROM `termline` WHERE `CategoryId`= ? '",
    q007 = "",
}