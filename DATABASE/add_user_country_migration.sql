-- ------------------------------------------------------------------
-- Add a country to user accounts
--
-- Adds `user`.`Country`: the two-letter code (PH, US, JP, ...) picked at
-- sign-up from the Google Play locations list. Existing accounts get NULL
-- ("Not set") until the user picks one in the app.
-- Safe to run more than once.
--
-- RUN THIS BEFORE starting the updated backend: new sign-ups save a country.
-- (The old backend ignores the column, so running it early is harmless.)
-- ------------------------------------------------------------------

DROP PROCEDURE IF EXISTS `add_user_country`;

DELIMITER $$
CREATE PROCEDURE `add_user_country`()
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND LOWER(TABLE_NAME) = 'user' AND COLUMN_NAME = 'Country'
  ) THEN
    ALTER TABLE `user` ADD COLUMN `Country` CHAR(2) NULL DEFAULT NULL AFTER `Email`;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE() AND LOWER(TABLE_NAME) = 'user' AND INDEX_NAME = 'Country_idx'
  ) THEN
    ALTER TABLE `user` ADD INDEX `Country_idx` (`Country`);
  END IF;
END$$
DELIMITER ;

CALL `add_user_country`();
DROP PROCEDURE IF EXISTS `add_user_country`;

-- Check: should list the new column, then show every account as "Not set" for now
SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE() AND LOWER(TABLE_NAME) = 'user' AND COLUMN_NAME = 'Country';
SELECT COALESCE(`Country`, 'Not set') AS country, COUNT(*) AS users FROM `user` GROUP BY `Country`;
