export enum FnQuery {
  q001 = "SELECT `user`.*, `userline`.`Id` AS `UserLineId`, CASE WHEN `userline`.`Coins` IS NULL THEN 0 ELSE `userline`.`Coins` END AS `Coins`, CASE WHEN `userline`.`IsBundle` IS NULL THEN 0 ELSE 1 END AS `IsBundle`  FROM `user` LEFT JOIN `userline` ON `userline`.`UserId` = `user`.`Id` WHERE `user`.`Email`= ?",
  q002 = "",
}
