-- Phase 3: Google sign-in removed.
-- Run manually against the production database AFTER taking a backup.
-- Not executed automatically.

-- 1) See which accounts were created through Google sign-in.
--    They have no usable password, so they cannot sign in until an administrator
--    sets a password for them (web admin) or Forgot Password is available.
SELECT `Id`, `Name`, `Email`, `DateCreated`
FROM `user`
WHERE `GoogleId` IS NOT NULL;

-- 2) Remove stored Google access tokens; the server no longer uses them.
UPDATE `user`
SET `AccessToken` = NULL
WHERE `AccessToken` IS NOT NULL;
