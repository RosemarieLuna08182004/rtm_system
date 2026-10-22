-- Phase 5 integrity: automatic data fixes. CHANGES DATA — take a backup first.
-- Requires MySQL 8 (window functions). Fixes checks 3, 4, 5 and 7 from
-- 01_integrity_checks.sql. Checks 1, 2 and 6 must be fixed by hand beforehand.

START TRANSACTION;

-- Check 3: store emails trimmed and lower-case (the app now sends them this way).
UPDATE `user`
SET `Email` = LOWER(TRIM(`Email`))
WHERE BINARY `Email` <> BINARY LOWER(TRIM(`Email`));

-- Check 4: keep one bookmark row per user and term — the bookmarked one if any,
-- otherwise the oldest.
DELETE `ut` FROM `userterms` AS `ut`
JOIN (
  SELECT `Id`,
         ROW_NUMBER() OVER (PARTITION BY `UserId`, `TermId` ORDER BY `Status` DESC, `Id` ASC) AS `rn`
  FROM `userterms`
  WHERE `TermId` IS NOT NULL
) AS `dup` ON `dup`.`Id` = `ut`.`Id`
WHERE `dup`.`rn` > 1;

-- Check 5: keep one unlock row per user and chapter (the oldest). Duplicates add nothing.
DELETE `ut` FROM `userterms` AS `ut`
JOIN (
  SELECT `Id`,
         ROW_NUMBER() OVER (PARTITION BY `UserId`, `ChapterId` ORDER BY `Id` ASC) AS `rn`
  FROM `userterms`
  WHERE `ChapterId` IS NOT NULL
) AS `dup` ON `dup`.`Id` = `ut`.`Id`
WHERE `dup`.`rn` > 1;

-- Check 7: give unnamed terms a visible placeholder so an encoder can rename them.
UPDATE `term`
SET `Term` = CONCAT('Untitled term #', `Id`)
WHERE `Term` IS NULL OR TRIM(`Term`) = '';

COMMIT;
