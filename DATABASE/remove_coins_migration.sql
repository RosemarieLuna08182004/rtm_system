-- ------------------------------------------------------------------
-- Remove the coin system
--
-- Drops every `Coins` column that exists in the current database and
-- the unused `productline` table. Columns that don't exist are skipped,
-- so this is safe to run even if the live schema differs from rtmdb.sql.
--
-- BACK UP THE DATABASE BEFORE RUNNING:
--   mysqldump -u <user> -p rtmdb > rtmdb_before_coin_removal.sql
--
-- Run against the app database, e.g.:
--   mysql -u <user> -p rtmdb < remove_coins_migration.sql
-- ------------------------------------------------------------------

DROP PROCEDURE IF EXISTS `drop_coins_column`;

DELIMITER $$
CREATE PROCEDURE `drop_coins_column`(IN tbl VARCHAR(64))
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND LOWER(TABLE_NAME) = LOWER(tbl)
      AND COLUMN_NAME = 'Coins'
  ) THEN
    SET @sql = CONCAT('ALTER TABLE `', tbl, '` DROP COLUMN `Coins`');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END$$
DELIMITER ;

CALL `drop_coins_column`('chapter');
CALL `drop_coins_column`('term');
CALL `drop_coins_column`('product');
CALL `drop_coins_column`('userline');

DROP PROCEDURE IF EXISTS `drop_coins_column`;

-- Unused: no code references this table
DROP TABLE IF EXISTS `productline`;

-- Verify: should return no rows
SELECT TABLE_NAME, COLUMN_NAME
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE() AND COLUMN_NAME = 'Coins';
