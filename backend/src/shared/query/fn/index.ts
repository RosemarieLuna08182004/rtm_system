export enum FnQuery {
  q001 = "SELECT `user`.*, `userline`.`Id` AS `UserLineId`, CASE WHEN `userline`.`IsBundle` IS NULL THEN 0 ELSE 1 END AS `IsBundle`  FROM `user` LEFT JOIN `userline` ON `userline`.`UserId` = `user`.`Id` WHERE `user`.`Email`= ?",
  q002 = "",
}
