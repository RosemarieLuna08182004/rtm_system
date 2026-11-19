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
-- Table structure for table `chapter`
--

DROP TABLE IF EXISTS `chapter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chapter` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `Id_idx` (`CreatedBy`),
  KEY `UpdatedBy_User_Chapter_idx` (`UpdatedBy`),
  CONSTRAINT `CreatedBy_User_Chapter_FK1` FOREIGN KEY (`CreatedBy`) REFERENCES `user` (`Id`),
  CONSTRAINT `UpdatedBy_User_Chapter_FK2` FOREIGN KEY (`UpdatedBy`) REFERENCES `user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chapter`
--

LOCK TABLES `chapter` WRITE;
/*!40000 ALTER TABLE `chapter` DISABLE KEYS */;
INSERT INTO `chapter` VALUES (1,'Cardiovascular System',16,'2024-10-16 10:11:51',16,'2024-10-16 10:17:43'),(2,'Digestive System',16,'2024-10-16 10:13:36',NULL,NULL),(4,'Immune System',16,'2024-10-16 10:20:11',NULL,NULL),(5,'Integumentary System',16,'2024-10-16 10:20:44',NULL,NULL),(6,'Joint System',16,'2024-10-16 10:20:53',NULL,NULL),(7,'Muscular System',16,'2024-10-16 10:21:05',NULL,NULL),(8,'Nervous System',16,'2024-10-16 10:21:14',16,'2024-10-16 10:21:20'),(9,'Plane System',16,'2024-10-16 10:21:30',NULL,NULL),(10,'Reproductive System',16,'2024-10-16 10:21:57',NULL,NULL),(11,'Respiratory System',16,'2024-10-16 10:22:17',16,'2024-10-16 10:22:23'),(12,'Skeletal System',16,'2024-10-16 10:22:34',NULL,NULL),(13,'Urinary System',16,'2024-10-16 10:22:42',NULL,NULL);
/*!40000 ALTER TABLE `chapter` ENABLE KEYS */;
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
