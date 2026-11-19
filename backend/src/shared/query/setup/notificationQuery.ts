export enum NotificationQuery {
    q001 = "SELECT `notification`.`Id`, `notification`.`UserId`, `notification`.`Description`, `notification`.`LinkedComponent`, `notification`.`Status`, `notification`.`DateCreated`, `notification`.`DateUpdated` FROM `notification` WHERE `notification`.`Id` = ?", // get
    q002 = "SELECT `notification`.`Id`, `notification`.`UserId`, `notification`.`Description`, `notification`.`LinkedComponent`, `notification`.`Status`, `notification`.`DateCreated`, `notification`.`DateUpdated` FROM `notification` ORDER BY `notification`.`DateCreated` DESC, `notification`.`Id` DESC", // get-all, newest first
    q003 = "SELECT `notification`.`Id`, `notification`.`UserId`, `notification`.`Description`, `notification`.`LinkedComponent`, `notification`.`Status`, `notification`.`DateCreated`, `notification`.`DateUpdated` FROM `notification` WHERE `notification`.`UserId` = ? ORDER BY `notification`.`DateCreated` DESC, `notification`.`Id` DESC", // get-by-user
    q004 = "SELECT `notification`.`Id` FROM `notification` WHERE `notification`.`Status` = ?", // ids by status
    // Duplicate alerts
    q005 = "SELECT `Id`, `Term` FROM `term` WHERE `ChapterId` = ?", // terms in a volume
    q006 = "SELECT `Title` FROM `chapter` WHERE `Id` = ?", // volume name
    q007 = "SELECT `Id`, `Term`, `Description` FROM `termline` WHERE `TermId` = ? AND `CategoryId` = ?", // sub terms of one kind under a term
    q008 = "SELECT (SELECT `Term` FROM `term` WHERE `Id` = ?) AS `TermName`, (SELECT `Category` FROM `category` WHERE `Id` = ?) AS `Category`", // names for a sub term message
    q009 = "SELECT (SELECT COALESCE(MAX(`Id`), 0) FROM `term`) AS `TermId`, (SELECT COALESCE(MAX(`Id`), 0) FROM `termline`) AS `LineId`", // newest ids, taken before an import
    q010 = "SELECT `Id`, `ChapterId`, `Term` FROM `term`", // all terms, for the import check
    q011 = "SELECT `Id`, `TermId`, `CategoryId`, `Term`, `Description` FROM `termline`", // all sub terms, for the import check
    q012 = "SELECT `ChapterId`, `Term` FROM `term` WHERE `Id` = ?", // a term before it is edited
    q013 = "SELECT `TermId`, `CategoryId`, `Term`, `Description` FROM `termline` WHERE `Id` = ?", // a sub term before it is edited
}
