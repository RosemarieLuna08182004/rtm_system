-- Admin notifications (new sign-ups, possible duplicate terms after an import or edit),
-- used by the web admin's Notifications page. Columns match
-- backend/src/shared/query/setup/notificationQuery.ts and notificationModels.
-- Safe to run more than once: nothing changes if the table already exists.

CREATE TABLE IF NOT EXISTS `notification` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL DEFAULT 0,               -- the user the event is about (0 if none)
  `Description` varchar(255) NOT NULL,
  `LinkedComponent` varchar(100) NOT NULL DEFAULT '', -- web admin route to open, e.g. /a/user/d/43
  `Status` tinyint NOT NULL DEFAULT 1,           -- 1 unread, 0 read
  `DateCreated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `DateUpdated` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `idx_notification_status` (`Status`),
  KEY `idx_notification_user` (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Check
SELECT COUNT(*) AS notifications FROM `notification`;
