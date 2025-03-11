-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: football_player_reviews
-- ------------------------------------------------------
-- Server version	8.0.41

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
-- Table structure for table `match_message`
--

DROP TABLE IF EXISTS `match_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `match_message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `match_id` int NOT NULL,
  `reviewer_id` int NOT NULL,
  `player_id` int NOT NULL,
  `message` text NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `match_message`
--

LOCK TABLES `match_message` WRITE;
/*!40000 ALTER TABLE `match_message` DISABLE KEYS */;
INSERT INTO `match_message` VALUES (1,12,31,33,'Nice goal','2025-03-07 23:26:55','2025-03-07 23:26:55'),(2,12,31,33,'how are you','2025-03-07 23:27:00','2025-03-07 23:27:00'),(3,12,31,33,'dasgdaj','2025-03-07 23:27:03','2025-03-07 23:27:03'),(4,12,31,33,'dadasdjakg','2025-03-07 23:27:05','2025-03-07 23:27:05'),(5,12,31,33,'ajgdasjgdasjgd','2025-03-07 23:27:17','2025-03-07 23:27:17'),(6,12,31,33,'bsjdasjgdf','2025-03-07 23:27:18','2025-03-07 23:27:18'),(7,12,31,33,'fjsdbfasgfgsjdfg','2025-03-07 23:27:20','2025-03-07 23:27:20'),(8,12,31,33,'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.','2025-03-07 23:27:26','2025-03-07 23:27:26'),(9,12,31,33,'sdfsdjfsdjf','2025-03-07 23:27:37','2025-03-07 23:27:37'),(10,12,31,33,'dfgdfg','2025-03-07 23:28:27','2025-03-07 23:28:27'),(11,12,31,33,'fgdfg','2025-03-07 23:28:29','2025-03-07 23:28:29'),(12,12,31,33,'gdfg','2025-03-07 23:28:32','2025-03-07 23:28:32'),(13,12,31,33,'gdfgd','2025-03-07 23:28:36','2025-03-07 23:28:36'),(14,12,31,33,'dfg','2025-03-07 23:28:38','2025-03-07 23:28:38');
/*!40000 ALTER TABLE `match_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `match_players`
--

DROP TABLE IF EXISTS `match_players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `match_players` (
  `match_players_id` int NOT NULL AUTO_INCREMENT,
  `match_id` int DEFAULT NULL,
  `player_id` int DEFAULT NULL,
  `player_name` varchar(255) NOT NULL,
  `created_by` int DEFAULT NULL,
  PRIMARY KEY (`match_players_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `match_players`
--

LOCK TABLES `match_players` WRITE;
/*!40000 ALTER TABLE `match_players` DISABLE KEYS */;
INSERT INTO `match_players` VALUES (9,7,34,'Prajwal',31),(10,8,34,'Prajwal',31),(11,9,34,'Prajwal',31),(12,10,34,'Prajwal',31),(13,11,35,'Sriraj',31),(14,11,32,'Ranganath',31),(15,12,35,'Sriraj',31),(16,12,33,'Kiran',31),(17,13,32,'Ranganath',31),(18,13,34,'Prajwal',31),(19,14,32,'Ranganath',31);
/*!40000 ALTER TABLE `match_players` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `match_review`
--

DROP TABLE IF EXISTS `match_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `match_review` (
  `match_review_id` int NOT NULL AUTO_INCREMENT,
  `match_id` int NOT NULL,
  `player_id` int NOT NULL,
  `reviewer_id` int NOT NULL,
  `goals` int DEFAULT '0',
  `passes` int DEFAULT '0',
  `free_kicks` int DEFAULT '0',
  `green_cards` int DEFAULT '0',
  `yellow_cards` int DEFAULT '0',
  `red_cards` int DEFAULT '0',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`match_review_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `match_review`
--

LOCK TABLES `match_review` WRITE;
/*!40000 ALTER TABLE `match_review` DISABLE KEYS */;
INSERT INTO `match_review` VALUES (1,12,33,31,4,3,2,2,3,1,'2025-03-07 23:16:45','2025-03-07 23:29:18');
/*!40000 ALTER TABLE `match_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `matches`
--

DROP TABLE IF EXISTS `matches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `matches` (
  `match_id` int NOT NULL AUTO_INCREMENT,
  `match_name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `start_date` datetime NOT NULL,
  `duration` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `status` enum('Scheduled','Ongoing','Completed') DEFAULT 'Scheduled',
  `added_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`match_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matches`
--

LOCK TABLES `matches` WRITE;
/*!40000 ALTER TABLE `matches` DISABLE KEYS */;
INSERT INTO `matches` VALUES (7,'Match1','Location1','2025-03-04 11:18:00',2,31,'Scheduled','2025-03-04 05:46:31'),(8,'Match2','Location2','2025-03-05 11:16:00',2,31,'Scheduled','2025-03-04 05:46:48'),(9,'Match3','Location3','2025-03-05 01:17:00',2,31,'Scheduled','2025-03-04 05:47:18'),(10,'Match4','Location4','2025-03-04 17:07:00',4,31,'Scheduled','2025-03-04 11:37:47'),(11,'test Match','Banaglore','2025-03-06 16:46:00',7,31,'Scheduled','2025-03-05 11:17:06'),(12,'Match Live','jayanagar','2025-03-07 20:30:00',3,31,'Scheduled','2025-03-05 11:18:48'),(13,'A1 VS B1','E-city','2025-03-07 23:43:00',2,31,'Scheduled','2025-03-07 18:13:45'),(14,'A2 VS B2','E-city','2025-03-08 01:45:00',2,31,'Scheduled','2025-03-07 18:15:51');
/*!40000 ALTER TABLE `matches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_details`
--

DROP TABLE IF EXISTS `otp_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_details` (
  `contact` varchar(255) NOT NULL,
  `otp` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `otp_id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`otp_id`),
  UNIQUE KEY `contact` (`contact`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_details`
--

LOCK TABLES `otp_details` WRITE;
/*!40000 ALTER TABLE `otp_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `otp_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `contact_phone` varchar(15) NOT NULL,
  `contact_email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `position` varchar(50) DEFAULT NULL,
  `user_type` enum('Player','Reviewer','Admin') NOT NULL,
  `age` int DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `organization_club` varchar(255) DEFAULT NULL,
  `expertise_level` enum('Beginner','Intermediate','Expert') DEFAULT NULL,
  `registration_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime DEFAULT NULL,
  `session_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `contact_email` (`contact_email`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','8796545678','admin@gmail.com','$2a$10$BSoX7XFCcXWNLI21926kfO6FGHXymBHlweC/O5Ci.QnXmAkGfB/WK','',NULL,'Admin',NULL,NULL,NULL,NULL,'2025-01-27 17:13:38',NULL,NULL),(31,'Ravi','9972669830','ravi@gmail.com','$2a$10$0mRrujz2cgI5jCMZR6Rp5eLEO52AlBmwD6h9q2wMs2JowZnVZh/5O','/uploads/1740404308722-712477886.jpg',NULL,'Reviewer',35,'Male','XYZ','Expert','2025-02-24 13:38:28',NULL,'9970e041-f452-4eab-a6f9-868759fd9e92'),(32,'Ranganath','8277305852','ranga@gmail.com','$2a$10$/FThHDJqMWgNeTEbMgonEuRKUnDk6uJzj9Hs8kUFLT5aiG69APMgK','/uploads/1740404358515-936482403.jpg','Center','Player',34,'Male',NULL,NULL,'2025-02-24 13:39:18',NULL,NULL),(33,'Kiran','9876543456','kiran@gmail.com','$2a$10$xiGd3fXrwG1mfg8QtLDPQ.5nyl4Oky8yRarE41eSSiHAAFwgygH7.',NULL,'Left','Player',19,'Male',NULL,NULL,'2025-02-24 13:39:51',NULL,NULL),(34,'Prajwal','6789756436','praju@gmail.com','$2a$10$o2M7zi/lZg7/FH3BdLdrlufqUuypaZabyBjiHxXAM015ZcQcQKCdu',NULL,'Side','Player',20,'Male',NULL,NULL,'2025-02-24 13:40:36',NULL,NULL),(35,'Sriraj','878987654','sri@gmail.om','$2a$10$zypWplKnLpWv.p24tDWnBemS2.u3eWUEidU0wYYFPuB9eGsZKp29y','/uploads/1741172931942-655685959.jpg','Center','Player',34,'Male',NULL,NULL,'2025-03-05 11:08:52',NULL,NULL),(37,'Kiran test','878789098','kiran123@GMAIL.COM','$2a$10$/.UNW07OuHPmgjAWtilHsuf04ManIqJuUI.hY2CfVWic9jdL5e39e',NULL,NULL,'Reviewer',30,'Male','Test','Intermediate','2025-03-05 11:20:26',NULL,'');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-07 23:59:23
