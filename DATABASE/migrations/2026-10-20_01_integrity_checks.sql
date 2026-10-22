-- Phase 5 integrity: READ-ONLY checks. Safe to run any time.
-- Every query should return no rows before 03_integrity_constraints.sql is applied.
-- [manual] = must be fixed by hand; [auto] = fixed by 02_integrity_fixes.sql.

-- 1 [manual] Accounts sharing the same email (ignoring case and spaces).
SELECT LOWER(TRIM(`Email`)) AS `Email`, COUNT(*) AS `Accounts`, GROUP_CONCAT(`Id` ORDER BY `Id`) AS `UserIds`
FROM `user`
GROUP BY LOWER(TRIM(`Email`))
HAVING COUNT(*) > 1;

-- 2 [manual] Accounts sharing the same GoogleId.
SELECT `GoogleId`, COUNT(*) AS `Accounts`, GROUP_CONCAT(`Id` ORDER BY `Id`) AS `UserIds`
FROM `user`
WHERE `GoogleId` IS NOT NULL
GROUP BY `GoogleId`
HAVING COUNT(*) > 1;

-- 3 [auto] Emails with capitals or surrounding spaces.
SELECT `Id`, `Email`
FROM `user`
WHERE BINARY `Email` <> BINARY LOWER(TRIM(`Email`));

-- 4 [auto] Duplicate bookmark rows (same user and term).
SELECT `UserId`, `TermId`, COUNT(*) AS `Rows`, GROUP_CONCAT(`Id` ORDER BY `Id`) AS `UserTermIds`
FROM `userterms`
WHERE `TermId` IS NOT NULL
GROUP BY `UserId`, `TermId`
HAVING COUNT(*) > 1;

-- 5 [auto] Duplicate chapter-unlock rows (same user and chapter).
SELECT `UserId`, `ChapterId`, COUNT(*) AS `Rows`, GROUP_CONCAT(`Id` ORDER BY `Id`) AS `UserTermIds`
FROM `userterms`
WHERE `ChapterId` IS NOT NULL
GROUP BY `UserId`, `ChapterId`
HAVING COUNT(*) > 1;

-- 6 [manual] Terms pointing at a chapter that does not exist.
SELECT `term`.`Id`, `term`.`Term`, `term`.`ChapterId`
FROM `term`
LEFT JOIN `chapter` ON `chapter`.`Id` = `term`.`ChapterId`
WHERE `chapter`.`Id` IS NULL;

-- 7 [auto] Terms without a name.
SELECT `Id`, `ChapterId`
FROM `term`
WHERE `Term` IS NULL OR TRIM(`Term`) = '';
