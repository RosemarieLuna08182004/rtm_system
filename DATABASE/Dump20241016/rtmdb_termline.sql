CREATE DATABASE  IF NOT EXISTS `rtmdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `rtmdb`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: rtmdb
-- ------------------------------------------------------
-- Server version	8.0.39

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

--
-- Table structure for table `termline`
--

DROP TABLE IF EXISTS `termline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `termline` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TermId` int NOT NULL,
  `CategoryId` int NOT NULL,
  `Term` varchar(255) NOT NULL,
  `Description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `TermId_Term_FK1_idx` (`TermId`),
  KEY `CategoryId_Category_FK2_idx` (`CategoryId`),
  KEY `CreatedBy_User_TermLine_FK3_idx` (`CreatedBy`),
  KEY `UpdatedBy_User_TermLineFK4_idx` (`UpdatedBy`),
  CONSTRAINT `CategoryId_Category_FK2` FOREIGN KEY (`CategoryId`) REFERENCES `category` (`Id`),
  CONSTRAINT `CreatedBy_User_TermLine_FK3` FOREIGN KEY (`CreatedBy`) REFERENCES `user` (`Id`),
  CONSTRAINT `TermId_Term_FK1` FOREIGN KEY (`TermId`) REFERENCES `term` (`Id`),
  CONSTRAINT `UpdatedBy_User_TermLineFK4` FOREIGN KEY (`UpdatedBy`) REFERENCES `user` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `termline`
--

LOCK TABLES `termline` WRITE;
/*!40000 ALTER TABLE `termline` DISABLE KEYS */;
/*!40000 ALTER TABLE `termline` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-16 15:36:33
