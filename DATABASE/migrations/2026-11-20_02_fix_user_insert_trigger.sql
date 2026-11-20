-- The live database creates a `userline` row for every new account with a trigger.
-- It used to set 200 coins; the coin system was removed (remove_coins_migration.sql dropped
-- `userline`.`Coins`), which made the trigger — and with it every sign-up — fail.
-- Run right after remove_coins_migration.sql. Safe to run more than once.

DROP TRIGGER IF EXISTS `trg_AfterInsertUser`;

CREATE TRIGGER `trg_AfterInsertUser` AFTER INSERT ON `user`
FOR EACH ROW
  INSERT INTO `userline` (`UserId`, `IsBundle`, `DateCreated`, `DateUpdated`)
  VALUES (NEW.`Id`, false, NOW(), NOW());
