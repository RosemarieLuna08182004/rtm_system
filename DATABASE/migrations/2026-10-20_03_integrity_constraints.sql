-- Phase 5 integrity: constraints. Run only after 01 returns no rows.
-- Each statement fails (and changes nothing) if existing data still violates it.

-- One account per email (the column's collation is case-insensitive) and per GoogleId.
-- MySQL unique keys allow many NULLs, so accounts without a GoogleId are fine.
ALTER TABLE `user`
  ADD UNIQUE KEY `uq_user_email` (`Email`),
  ADD UNIQUE KEY `uq_user_googleid` (`GoogleId`);

-- One bookmark row per user/term and one unlock row per user/chapter.
-- Bookmark rows have ChapterId NULL and unlock rows have TermId NULL, so the two
-- keys do not interfere.
ALTER TABLE `userterms`
  ADD UNIQUE KEY `uq_userterms_user_term` (`UserId`, `TermId`),
  ADD UNIQUE KEY `uq_userterms_user_chapter` (`UserId`, `ChapterId`);

-- Every term belongs to an existing chapter and has a name.
-- RESTRICT matches the app: a chapter that still has terms cannot be removed.
ALTER TABLE `term`
  MODIFY `Term` varchar(255) NOT NULL,
  ADD KEY `idx_term_chapter` (`ChapterId`),
  ADD CONSTRAINT `fk_term_chapter` FOREIGN KEY (`ChapterId`) REFERENCES `chapter` (`Id`) ON DELETE RESTRICT;
