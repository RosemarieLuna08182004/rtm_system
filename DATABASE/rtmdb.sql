-- MySQL dump 10.13  Distrib 8.0.39, for Win64 (x86_64)
--
-- Host: localhost    Database: rtmdb
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Category` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `CreatedBy_User_Category_FK1_idx` (`CreatedBy`),
  KEY `UpdatedBy_User_Category_idx` (`UpdatedBy`),
  CONSTRAINT `CreatedBy_User_Category_FK1` FOREIGN KEY (`CreatedBy`) REFERENCES `user` (`Id`),
  CONSTRAINT `UpdatedBy_User_Category` FOREIGN KEY (`UpdatedBy`) REFERENCES `user` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Chapter`
--

DROP TABLE IF EXISTS `Chapter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Chapter` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Chapter`
--

LOCK TABLES `Chapter` WRITE;
/*!40000 ALTER TABLE `Chapter` DISABLE KEYS */;
/*!40000 ALTER TABLE `Chapter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Product`
--

DROP TABLE IF EXISTS `Product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Product` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Price` decimal(18,5) NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `CreatedBy_User_Product_FK1_idx` (`CreatedBy`),
  KEY `UpdatedBy_User_Product_FK2_idx` (`UpdatedBy`),
  CONSTRAINT `CreatedBy_User_Product_FK1` FOREIGN KEY (`CreatedBy`) REFERENCES `user` (`Id`),
  CONSTRAINT `UpdatedBy_User_Product_FK2` FOREIGN KEY (`UpdatedBy`) REFERENCES `user` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Product`
--

LOCK TABLES `Product` WRITE;
/*!40000 ALTER TABLE `Product` DISABLE KEYS */;
/*!40000 ALTER TABLE `Product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `Sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Sales` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `SalesNumber` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `SalesDate` datetime NOT NULL,
  `TransactionId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `UserId` int NOT NULL,
  `MerchantName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `MerchantId` int NOT NULL,
  `ProductName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `ProductPrice` decimal(18,5) NOT NULL,
  `Currency` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `TotalAmount` decimal(18,5) NOT NULL,
  `PaymentMethod` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `PaymentToken` text NOT NULL,
  `ProductType` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `ProductId` int NOT NULL,
  `BillingAddress` text DEFAULT NULL,
  `Status` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `UserId_User_Sales_FK1_idx` (`UserId`),
  KEY `ProductId_Product_Sales_FK3_idx` (`ProductId`),
  CONSTRAINT `ProductId_Product_Sales_FK3` FOREIGN KEY (`ProductId`) REFERENCES `product` (`Id`),
  CONSTRAINT `UserId_User_Sales_FK1` FOREIGN KEY (`UserId`) REFERENCES `user` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sales`
--

LOCK TABLES `Sales` WRITE;
/*!40000 ALTER TABLE `Sales` DISABLE KEYS */;
/*!40000 ALTER TABLE `Sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Term`
--

DROP TABLE IF EXISTS `Term`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Term` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ChapterId` int NOT NULL,
  `Term` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Focus` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `Definition` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `CreatedBy_User_Term_FK1_idx` (`CreatedBy`),
  KEY `UpdatedBy_User_Term_FK2_idx` (`UpdatedBy`),
  CONSTRAINT `CreatedBy_User_Term_FK1` FOREIGN KEY (`CreatedBy`) REFERENCES `user` (`Id`),
  CONSTRAINT `UpdatedBy_User_Term_FK2` FOREIGN KEY (`UpdatedBy`) REFERENCES `user` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Term`
--

LOCK TABLES `Term` WRITE;
/*!40000 ALTER TABLE `Term` DISABLE KEYS */;
/*!40000 ALTER TABLE `Term` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Dumping data for table `Term`
--
--
-- Table structure for table `TermLine`
--

DROP TABLE IF EXISTS `TermLine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TermLine` (
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
-- Dumping data for table `TermLine`
--

LOCK TABLES `TermLine` WRITE;
/*!40000 ALTER TABLE `TermLine` DISABLE KEYS */;
/*!40000 ALTER TABLE `TermLine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `GoogleId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Country` char(2) DEFAULT NULL,
  `Password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `ProfilePhoto` text DEFAULT NULL,
  `AccessToken` text DEFAULT NULL,
  `DateCreated` datetime NOT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserLine`
--

DROP TABLE IF EXISTS `UserLine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserLine` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `UserId_User_FK1_idx` (`UserId`),
  CONSTRAINT `UserId_User_UserLine_FK1` FOREIGN KEY (`UserId`) REFERENCES `user` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserLine`
--

LOCK TABLES `UserLine` WRITE;
/*!40000 ALTER TABLE `userline` DISABLE KEYS */;
/*!40000 ALTER TABLE `userline` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserTerm`
--

DROP TABLE IF EXISTS `UserTerms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserTerms` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `ChapterId` int DEFAULT NULL,
  `TermId` int DEFAULT NULL,
  `Status` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `UserId_User_FK1_idx` (`UserId`),
  KEY `ChapterId_Chapter_FK2_idx` (`ChapterId`),
  KEY `TermId_Term_FK3_idx` (`TermId`),
  CONSTRAINT `ChapterId_Chapter_FK2` FOREIGN KEY (`ChapterId`) REFERENCES `chapter` (`Id`),
  CONSTRAINT `TermId_Term_FK3` FOREIGN KEY (`TermId`) REFERENCES `term` (`Id`),
  CONSTRAINT `UserId_User_FK1` FOREIGN KEY (`UserId`) REFERENCES `user` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserTerm`
--

LOCK TABLES `UserTerm` WRITE;
/*!40000 ALTER TABLE `UserTerm` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserTerm` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-18 20:16:15
