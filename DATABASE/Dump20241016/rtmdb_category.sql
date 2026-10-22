-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: mysql-roots-and-morphology-roots-and-morphology.i.aivencloud.com    Database: rtmdb
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--


--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Category` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `CreatedBy_User_Category_FK1_idx` (`CreatedBy`),
  KEY `UpdatedBy_User_Category_idx` (`UpdatedBy`),
  CONSTRAINT `CreatedBy_User_Category_FK1` FOREIGN KEY (`CreatedBy`) REFERENCES `user` (`Id`),
  CONSTRAINT `UpdatedBy_User_Category` FOREIGN KEY (`UpdatedBy`) REFERENCES `user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (4,'Synonym','a word or phrase that means exactly or nearly the same as another word or phrase in the same language, for example shut is a synonym of close.',16,'2024-10-16 08:41:36',16,'2024-10-16 09:27:01'),(6,'Antonym','a word opposite in meaning to another.',16,'2024-10-16 09:27:44',NULL,NULL),(7,'Relevant words in term','closely connected or appropriate to what is being done or considered.',16,'2024-10-16 09:28:35',16,'2024-11-27 06:50:50'),(8,'Root','a fundamental unit of a word.',16,'2024-10-16 09:29:24',NULL,NULL),(9,'Term Morphology','the study of the forms of things.',16,'2024-10-16 09:29:59',44,'2024-12-11 08:31:50'),(10,'Compound','a thing that is composed of two or more separate elements; a mixture.',16,'2024-10-16 09:30:38',NULL,NULL),(12,'Terms in Other System Using Same Root','other things',16,'2024-10-25 22:41:53',16,'2024-11-25 05:34:19'),(13,'Brief Definition','Term definition',16,'2024-11-27 06:53:46',16,'2024-11-27 06:57:12'),(14,'Opposite Term ','.',16,'2024-12-11 02:21:55',NULL,NULL),(15,'Word in Focus','The word in focus is the term or word that is subjected for elaboration.',44,'2024-12-11 08:03:56',16,'2025-01-19 15:34:32'),(16,'Other Terms Using Primary Root','.',44,'2024-12-12 01:34:47',NULL,NULL),(17,'Actual Term','The term that is used in the term.',44,'2024-12-12 02:21:16',16,'2025-01-19 15:34:58'),(18,'Illustration','a picture illustrating a book, newspaper, etc.',1,'2024-12-13 01:12:46',NULL,NULL);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-19 10:54:53
