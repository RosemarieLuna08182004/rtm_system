-- ------------------------------------------------------------------
-- Remove the voice-over feature
--
-- Drops the `VoiceOver` column from `term`. Before that, any value that
-- isn't empty is copied into `term_voiceover_backup`, so nothing is lost
-- (today that's 1 Google Drive link plus placeholder dots).
-- Safe to run more than once.
--
-- RUN THIS ONLY AFTER the updated backend is running: the old backend still
-- reads this column and would fail once it's gone.
--
-- Back up the database first, e.g.:
--   mysqldump -u <user> -p rtmdb > rtmdb_before_voiceover_removal.sql
-- ------------------------------------------------------------------

DROP PROCEDURE IF EXISTS `remove_voiceover`;

DELIMITER $$
CREATE PROCEDURE `remove_voiceover`()
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND LOWER(TABLE_NAME) = 'term' AND COLUMN_NAME = 'VoiceOver'
  ) THEN
    CREATE TABLE IF NOT EXISTS `term_voiceover_backup` (
      `TermId` int NOT NULL PRIMARY KEY,
      `VoiceOver` text,
      `BackedUpAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    INSERT IGNORE INTO `term_voiceover_backup` (`TermId`, `VoiceOver`)
      SELECT `Id`, `VoiceOver` FROM `term` WHERE `VoiceOver` IS NOT NULL AND TRIM(`VoiceOver`) <> '';
    ALTER TABLE `term` DROP COLUMN `VoiceOver`;
  END IF;
END$$
DELIMITER ;

CALL `remove_voiceover`();
DROP PROCEDURE IF EXISTS `remove_voiceover`;

-- Check: the first query should return no rows; the second shows what was saved
SELECT COLUMN_NAME FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE() AND LOWER(TABLE_NAME) = 'term' AND COLUMN_NAME = 'VoiceOver';
SELECT COUNT(*) AS saved_values FROM `term_voiceover_backup`;

-- When you're sure you won't need the old values, you can remove the backup:
--   DROP TABLE `term_voiceover_backup`;
