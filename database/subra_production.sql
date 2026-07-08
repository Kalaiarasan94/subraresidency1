-- Subra Residency - Production Database Export
-- Generated: 2026-07-07T17:31:04Z
-- Contains: full schema + all data EXCEPT rows in `users` table (kept empty by request)
-- Target DB name on Hostinger: u928398901_subra_db

SET FOREIGN_KEY_CHECKS=0;
SET NAMES utf8mb4;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `booking_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `booking_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) DEFAULT NULL,
  `guest_name` varchar(255) DEFAULT NULL,
  `guest_email` varchar(255) DEFAULT NULL,
  `guest_phone` varchar(50) DEFAULT NULL,
  `guests` varchar(50) DEFAULT NULL,
  `country` varchar(100) DEFAULT '',
  `address` text DEFAULT '',
  `additional_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `booking_details_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `booking_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `booking_rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `price_at_booking` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `booking_rooms_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `booking_rooms_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms_new` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` varchar(20) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `guest_name` varchar(100) DEFAULT NULL,
  `guest_email` varchar(100) DEFAULT NULL,
  `guest_phone` varchar(20) DEFAULT NULL,
  `check_in_date` date NOT NULL,
  `check_out_date` date NOT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','confirmed','checked-in','checked-out','completed','cancelled') DEFAULT 'pending',
  `payment_status` enum('pending','success','failed') DEFAULT 'pending',
  `source` enum('website','reception','other') DEFAULT 'website',
  `special_requests` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `booking_source` enum('Online','Walk-in','Manual') DEFAULT 'Online',
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_id` (`booking_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) DEFAULT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `status` enum('pending','success','failed') DEFAULT 'pending',
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `qr_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `qr_codes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) DEFAULT NULL,
  `qr_content` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `qr_codes_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `reception_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reception_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `receptionist_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `receptionist_notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  `message` text DEFAULT NULL,
  `data` text DEFAULT NULL,
  `is_read` tinyint(4) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `room_amenities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `room_amenities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `room_id` int(11) DEFAULT NULL,
  `amenity_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `room_amenities_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms_new` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `room_availability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `room_availability` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `room_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `status` enum('Available','Booked','Maintenance') NOT NULL DEFAULT 'Available',
  `note` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `room_date_unique` (`room_id`,`date`),
  CONSTRAINT `room_availability_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms_new` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `room_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `room_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `base_price_12h` decimal(10,2) DEFAULT NULL,
  `base_price_24h` decimal(10,2) DEFAULT NULL,
  `adults_count` int(11) DEFAULT 2,
  `children_count` int(11) DEFAULT 0,
  `room_size` varchar(20) DEFAULT NULL,
  `amenities` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `room_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `room_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `room_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `image_path` varchar(255) NOT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `room_id` (`room_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `room_images_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `room_images_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `room_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `room_images_new`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `room_images_new` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `room_id` int(11) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `room_images_new_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms_new` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `room_number` varchar(10) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `status` enum('available','booked','occupied','maintenance','checked-in','checked-out') DEFAULT 'available',
  `floor` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `room_number` (`room_number`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `room_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `rooms_new`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rooms_new` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `room_name` varchar(100) DEFAULT NULL,
  `room_number` varchar(50) NOT NULL,
  `room_code` varchar(50) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `floor_number` int(11) DEFAULT NULL,
  `base_price` decimal(10,2) DEFAULT NULL,
  `price_12_hours` decimal(10,2) DEFAULT NULL,
  `price_24_hours` decimal(10,2) DEFAULT NULL,
  `weekend_price` decimal(10,2) DEFAULT NULL,
  `festival_price` decimal(10,2) DEFAULT NULL,
  `extra_bed_price` decimal(10,2) DEFAULT NULL,
  `max_adults` int(11) DEFAULT NULL,
  `max_children` int(11) DEFAULT NULL,
  `max_guests` int(11) DEFAULT NULL,
  `room_size` varchar(50) DEFAULT NULL,
  `bed_type` varchar(50) DEFAULT NULL,
  `number_of_beds` int(11) DEFAULT NULL,
  `balcony` tinyint(1) DEFAULT 0,
  `air_conditioning` tinyint(1) DEFAULT 1,
  `smoking_allowed` tinyint(1) DEFAULT 0,
  `short_description` text DEFAULT NULL,
  `full_description` text DEFAULT NULL,
  `highlights` text DEFAULT NULL,
  `house_rules` text DEFAULT NULL,
  `status` enum('Available','Occupied','Maintenance','Inactive') DEFAULT 'Available',
  `show_on_website` tinyint(1) DEFAULT 1,
  `featured_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `room_number` (`room_number`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(50) DEFAULT NULL,
  `setting_value` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `temples`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `temples` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `distance` varchar(50) DEFAULT NULL,
  `mode_of_transport` varchar(100) DEFAULT NULL,
  `timings` varchar(255) DEFAULT NULL,
  `dress_code` varchar(255) DEFAULT NULL,
  `speciality` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `is_hidden_trail` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;


-- ============ DATA ============


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` (`id`, `username`, `password`, `full_name`, `email`, `created_at`) VALUES (1,'admin','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Subra Admin','admin@subraresidency.com','2026-06-19 13:04:56');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `booking_details` WRITE;
/*!40000 ALTER TABLE `booking_details` DISABLE KEYS */;
INSERT INTO `booking_details` (`id`, `booking_id`, `guest_name`, `guest_email`, `guest_phone`, `guests`, `country`, `address`, `additional_notes`, `created_at`) VALUES (1,3,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','7904242107','2 Guests','India','maduari','Nothing ','2026-06-26 09:37:40'),(2,4,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','1234567876543','2 Guests','India','1234567','','2026-06-26 09:49:56'),(3,5,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','76042421037','2 Guests','India','1234567','','2026-06-26 09:50:06'),(4,6,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','76042421037','2 Guests','India','zgdgjyrhg','','2026-06-26 09:50:16'),(5,7,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','9876543210','2 Guests','India','bk','','2026-06-26 11:35:24'),(6,8,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','8989897656','2 Guests','India','1233, Mdau','','2026-06-26 13:44:57'),(7,9,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','12345434444','2 Guests','India','qwwdef','','2026-06-26 13:54:12'),(8,10,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','123454321','2 Guests','India','123, Madu','','2026-06-26 14:04:58'),(9,11,'Kirtheeswaran G R M','bhalaramsembu@gmail.com','7878786565','2 Guests','India','123, madurai','','2026-06-26 14:08:19'),(10,12,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','234567654321','2 Guests','India','123 bfc','','2026-06-26 14:34:40'),(11,13,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','765432345','2 Guests','India','123, efdfgdrtfb ','','2026-06-26 14:35:44'),(12,14,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','098765432','2 Guests','India','123, mdu','','2026-06-26 14:44:49'),(13,15,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','78945613','2','India','Nithing','othj','2026-07-07 08:23:42'),(14,16,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','78945613','2','India','Nithing','othj','2026-07-07 08:30:43'),(15,17,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','123456789','2','India','123456','123456','2026-07-07 08:45:59'),(16,18,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','123456789','2','India','123456','123456','2026-07-07 09:00:12'),(18,20,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','9876543217','2 Guests','India','123Nuehdsn','sdbcilsdv','2026-07-07 10:11:22'),(19,21,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','7894561253','2 Guests','India','123234','sdf','2026-07-07 10:47:27'),(20,22,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','12345678909','2 Guests','India','1234','wert','2026-07-07 11:33:37'),(21,23,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','12345678909','2 Guests','India','1234567','234567','2026-07-07 11:47:25'),(22,24,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','789456123','2 Guests','','','','2026-07-07 12:13:31'),(23,25,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','9865046554','4 Guests','','','','2026-07-07 13:42:00'),(24,26,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','789456136','3 Guests','','','','2026-07-07 14:03:01');
/*!40000 ALTER TABLE `booking_details` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `booking_rooms` WRITE;
/*!40000 ALTER TABLE `booking_rooms` DISABLE KEYS */;
INSERT INTO `booking_rooms` (`id`, `booking_id`, `room_id`, `price_at_booking`) VALUES (1,1,1,3500.00),(2,3,1,3850.00),(3,17,1,6750.00),(4,18,5,6750.00),(6,20,1,5150.00),(7,21,1,4050.00),(8,22,2,6750.00),(9,23,3,6750.00),(10,24,1,2950.00),(11,25,2,6490.00),(12,26,2,12980.00);
/*!40000 ALTER TABLE `booking_rooms` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` (`id`, `booking_id`, `user_id`, `guest_name`, `guest_email`, `guest_phone`, `check_in_date`, `check_out_date`, `total_amount`, `status`, `payment_status`, `source`, `special_requests`, `created_at`, `booking_source`) VALUES (1,'HBK202606207A0C',NULL,'Test Guest','test@example.com','9999999999','2026-06-25','2026-06-28',3500.00,'confirmed','success','website',NULL,'2026-06-20 10:34:28','Online'),(2,'HBK202606254FC2',NULL,'Bhalaram krishnna','bhalaramsembu@gmail.com','7904242107','2026-06-25','2026-06-26',3850.00,'pending','pending','website',NULL,'2026-06-25 11:28:51','Online'),(3,'HBK202606268BF5',NULL,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','7904242107','2026-06-25','2026-06-26',3850.00,'confirmed','success','website',NULL,'2026-06-26 09:37:40','Online'),(4,'HBK202606264D81',NULL,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','1234567876543','2026-06-25','2026-06-26',3850.00,'pending','pending','website',NULL,'2026-06-26 09:49:56','Online'),(5,'HBK202606268B27',NULL,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','76042421037','2026-06-25','2026-06-26',3850.00,'pending','pending','website',NULL,'2026-06-26 09:50:06','Online'),(6,'HBK20260626A607',NULL,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','76042421037','2026-06-25','2026-06-26',3850.00,'pending','pending','website',NULL,'2026-06-26 09:50:16','Online'),(7,'HBK20260626802B',NULL,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','9876543210','2026-06-25','2026-06-26',3850.00,'confirmed','success','website',NULL,'2026-06-26 11:35:24','Online'),(8,'HBK202606260084',NULL,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','8989897656','2026-06-26','2026-06-27',3850.00,'confirmed','success','website',NULL,'2026-06-26 13:44:57','Online'),(9,'HBK20260626BF29',NULL,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','12345434444','2026-06-26','2026-06-27',3850.00,'confirmed','success','website',NULL,'2026-06-26 13:54:12','Online'),(10,'HBK20260626C444',NULL,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','123454321','2026-06-26','2026-06-27',5150.00,'confirmed','success','website',NULL,'2026-06-26 14:04:58','Online'),(11,'HBK202606262DF9',NULL,'Kirtheeswaran G R M','bhalaramsembu@gmail.com','7878786565','2026-06-26','2026-06-27',3850.00,'confirmed','success','website',NULL,'2026-06-26 14:08:19','Online'),(12,'HBK202606264CE0',NULL,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','234567654321','2026-06-26','2026-06-27',3850.00,'confirmed','success','website',NULL,'2026-06-26 14:34:40','Online'),(13,'HBK20260626A450',NULL,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','765432345','2026-06-26','2026-06-27',3850.00,'confirmed','success','website',NULL,'2026-06-26 14:35:44','Online'),(14,'HBK202606269604',NULL,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','098765432','2026-06-26','2026-06-27',3850.00,'cancelled','failed','website',NULL,'2026-06-26 14:44:49','Online'),(15,'HBK202607071E2D',NULL,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','78945613','2026-07-07','2026-07-09',6750.00,'pending','pending','website',NULL,'2026-07-07 08:23:42','Online'),(16,'HBK202607078F8C',NULL,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','78945613','2026-07-07','2026-07-09',6750.00,'pending','pending','website',NULL,'2026-07-07 08:30:43','Online'),(17,'HBK2026070730FE',NULL,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','123456789','2026-07-07','2026-07-09',6750.00,'pending','pending','website',NULL,'2026-07-07 08:45:59','Online'),(18,'HBK20260707BCBA',NULL,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','123456789','2026-07-07','2026-07-09',6750.00,'checked-in','success','website',NULL,'2026-07-07 09:00:12','Online'),(20,'HBK202607070BE2',NULL,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','9876543217','2026-07-07','2026-07-08',5150.00,'confirmed','success','website','sdbcilsdv','2026-07-07 10:11:22','Online'),(21,'HBK20260707B4FF',NULL,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','7894561253','2026-07-07','2026-07-08',4050.00,'confirmed','success','website','sdf','2026-07-07 10:47:27','Online'),(22,'HBK20260707E459',NULL,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','12345678909','2026-07-07','2026-07-09',6750.00,'confirmed','success','website','wert','2026-07-07 11:33:37','Online'),(23,'HBK202607071590',NULL,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','12345678909','2026-07-07','2026-07-09',6750.00,'checked-in','success','website','234567','2026-07-07 11:47:25','Online'),(24,'HBK202607076838',NULL,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','789456123','2026-07-08','2026-07-09',2950.00,'confirmed','success','reception','','2026-07-07 12:13:31','Walk-in'),(25,'HBK20260707BABE',NULL,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','9865046554','2026-07-15','2026-07-16',6490.00,'confirmed','success','reception','','2026-07-07 13:42:00','Walk-in'),(26,'HBK2026070787C9',NULL,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','789456136','2026-07-18','2026-07-20',12980.00,'confirmed','success','reception','','2026-07-07 14:03:01','Walk-in');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` (`id`, `booking_id`, `transaction_id`, `amount`, `payment_method`, `status`, `payment_date`) VALUES (2,3,'pay_T6DGW1S53SAqaM',3850.00,'razorpay','success','2026-06-26 09:38:12'),(3,7,'pay_T6FH2OSIRHJJgX',3850.00,'razorpay','success','2026-06-26 11:36:02'),(4,8,'pay_T6HTjFC9neDAdG',3850.00,'razorpay','success','2026-06-26 13:45:21'),(5,9,'pay_T6HdZdoSjCba3m',3850.00,'razorpay','success','2026-06-26 13:54:42'),(6,10,'pay_T6HpUVt09GMQTV',5150.00,'razorpay','success','2026-06-26 14:06:25'),(7,11,'pay_T6HsLuaixWa7lx',3850.00,'razorpay','success','2026-06-26 14:08:39'),(8,12,'pay_T6IKEoBlPwbHs8',3850.00,'razorpay','success','2026-06-26 14:35:03'),(9,13,'pay_T6ILKNngAY3Yf4',3850.00,'razorpay','success','2026-06-26 14:36:05'),(11,20,'pay_sim_VQYYQLNDU',5150.00,'razorpay','success','2026-07-07 10:11:37'),(12,21,'pay_sim_BH024CXB1',4050.00,'razorpay','success','2026-07-07 10:47:42'),(13,22,'pay_TAb7dXOUpiqj91',6750.00,'razorpay','success','2026-07-07 11:34:19'),(14,23,'pay_TAbLro2jVycg1X',6750.00,'razorpay','success','2026-07-07 11:47:48'),(15,18,'TXN_MANUAL_B8EF1132',6750.00,'Cash','success','2026-07-07 12:05:34'),(16,24,'TXN_OFFLINE_D6B58E6A',2950.00,'upi','success','2026-07-07 12:13:31'),(17,25,'TXN_OFFLINE_228814A6',6490.00,'upi','success','2026-07-07 13:42:00'),(18,26,'TXN_OFFLINE_7156BE25',12980.00,'cash','success','2026-07-07 14:03:01');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `qr_codes` WRITE;
/*!40000 ALTER TABLE `qr_codes` DISABLE KEYS */;
INSERT INTO `qr_codes` (`id`, `booking_id`, `qr_content`, `created_at`) VALUES (1,3,'HBK202606268BF5','2026-06-26 09:38:12'),(2,7,'HBK20260626802B','2026-06-26 11:36:02'),(3,8,'HBK202606260084','2026-06-26 13:45:21'),(4,9,'HBK20260626BF29','2026-06-26 13:54:42'),(5,10,'HBK20260626C444','2026-06-26 14:06:25'),(6,11,'HBK202606262DF9','2026-06-26 14:08:39'),(7,12,'HBK202606264CE0','2026-06-26 14:35:03'),(8,13,'HBK20260626A450','2026-06-26 14:36:05'),(9,14,'HBK202606269604','2026-06-26 14:45:20'),(10,20,'HBK202607070BE2','2026-07-07 10:11:37'),(11,21,'HBK20260707B4FF','2026-07-07 10:47:42'),(12,22,'HBK20260707E459','2026-07-07 11:34:19'),(13,23,'HBK202607071590','2026-07-07 11:47:48');
/*!40000 ALTER TABLE `qr_codes` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `reception_users` WRITE;
/*!40000 ALTER TABLE `reception_users` DISABLE KEYS */;
INSERT INTO `reception_users` (`id`, `username`, `password`, `full_name`, `email`, `created_at`) VALUES (1,'rec','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Subra Reception','rec@subraresidency.com','2026-06-19 13:04:56'),(2,'receptionist','$2y$10$Eiqt/dDMmw1KBpAXpgXV0O0GDXpHq576FvzfeLzHOY3WtLN/L1f3.','Receptionist Manager','receptionist@subra.com','2026-06-27 09:30:56');
/*!40000 ALTER TABLE `reception_users` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `receptionist_notifications` WRITE;
/*!40000 ALTER TABLE `receptionist_notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `receptionist_notifications` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `room_amenities` WRITE;
/*!40000 ALTER TABLE `room_amenities` DISABLE KEYS */;
INSERT INTO `room_amenities` (`id`, `room_id`, `amenity_name`) VALUES (1,1,'Mini Fridge'),(2,1,'Room Service'),(3,1,'City View'),(4,1,'Temple View'),(5,1,'Bathtub'),(6,1,'Workspace'),(7,2,'High-speed Wi-Fi'),(8,2,'Smart TV'),(9,2,'Mini Fridge'),(10,2,'Coffee Maker'),(11,2,'Digital Safe'),(12,2,'Rain Shower'),(13,2,'24/7 Room Service'),(20,4,'WiFi'),(21,4,'Workspace'),(22,4,'City View'),(23,4,'Room Service'),(24,4,'Mini Fridge'),(25,5,'WiFi'),(26,5,'Bathtub'),(27,5,'Temple View'),(28,5,'Room Service'),(29,5,'Smart TV'),(60,3,'High-Speed WiFi'),(61,3,'Smart TV'),(62,3,'Mini Fridge'),(63,3,'Room Service'),(64,3,'Workspace'),(65,3,'Temple View');
/*!40000 ALTER TABLE `room_amenities` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `room_availability` WRITE;
/*!40000 ALTER TABLE `room_availability` DISABLE KEYS */;
INSERT INTO `room_availability` (`id`, `room_id`, `date`, `status`, `note`, `updated_at`) VALUES (1,3,'2026-06-19','Booked',NULL,'2026-06-20 10:31:53'),(2,5,'2026-06-19','Maintenance',NULL,'2026-06-20 10:31:54'),(6,3,'2026-06-20','Booked',NULL,'2026-06-20 10:36:27'),(8,5,'2026-06-20','Booked',NULL,'2026-06-20 10:36:22'),(9,1,'2026-06-20','Booked',NULL,'2026-06-20 10:36:23'),(10,4,'2026-06-20','Booked',NULL,'2026-06-20 10:36:25'),(11,2,'2026-06-20','Booked',NULL,'2026-06-20 10:36:26'),(15,4,'2026-06-29','Booked',NULL,'2026-06-26 14:57:10'),(18,1,'2026-07-07','Booked','booking:HBK20260707B4FF','2026-07-07 10:47:42'),(19,2,'2026-07-07','Booked','booking:HBK20260707E459','2026-07-07 11:34:19'),(20,2,'2026-07-08','Booked','booking:HBK20260707E459','2026-07-07 11:34:19'),(21,4,'2026-07-07','Booked','booking:HBK202607071590','2026-07-07 11:47:48'),(22,4,'2026-07-08','Booked','booking:HBK202607071590','2026-07-07 11:47:48'),(23,3,'2026-07-07','Booked','booking:HBK202607071590','2026-07-07 11:54:51'),(24,3,'2026-07-08','Booked','booking:HBK202607071590','2026-07-07 11:54:51'),(25,5,'2026-07-07','Booked','booking:HBK20260707BCBA','2026-07-07 12:05:37'),(26,5,'2026-07-08','Booked','booking:HBK20260707BCBA','2026-07-07 12:05:37'),(27,1,'2026-07-08','Booked','booking:HBK202607076838','2026-07-07 12:13:31'),(28,2,'2026-07-15','Booked','booking:HBK20260707BABE','2026-07-07 13:42:00'),(29,2,'2026-07-18','Booked','booking:HBK2026070787C9','2026-07-07 14:03:01'),(30,2,'2026-07-19','Booked','booking:HBK2026070787C9','2026-07-07 14:03:01');
/*!40000 ALTER TABLE `room_availability` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `room_categories` WRITE;
/*!40000 ALTER TABLE `room_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `room_categories` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `room_images` WRITE;
/*!40000 ALTER TABLE `room_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `room_images` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `room_images_new` WRITE;
/*!40000 ALTER TABLE `room_images_new` DISABLE KEYS */;
INSERT INTO `room_images_new` (`id`, `room_id`, `image_path`, `sort_order`, `created_at`) VALUES (1,2,'/uploads/rooms/sample_1.jpg',0,'2026-06-20 08:38:17'),(2,2,'/uploads/rooms/sample_2.jpg',1,'2026-06-20 08:38:17'),(3,2,'/uploads/rooms/sample_3.jpg',2,'2026-06-20 08:38:17'),(4,2,'/uploads/rooms/sample_4.jpg',3,'2026-06-20 08:38:17'),(5,3,'/uploads/rooms/room_1.png',0,'2026-06-20 08:43:56'),(6,4,'/uploads/rooms/room_2.png',0,'2026-06-20 08:43:56'),(7,5,'/uploads/rooms/room_3.png',0,'2026-06-20 08:43:56'),(8,3,'/uploads/rooms/gallery_1783412853_8186.jpeg',10,'2026-07-07 08:27:33'),(9,3,'/uploads/rooms/gallery_1783412863_8833.png',20,'2026-07-07 08:27:43'),(10,3,'/uploads/rooms/gallery_1783413992_3604.png',30,'2026-07-07 08:46:32');
/*!40000 ALTER TABLE `room_images_new` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` (`id`, `room_number`, `category_id`, `status`, `floor`) VALUES (1,'100',NULL,'booked',1);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `rooms_new` WRITE;
/*!40000 ALTER TABLE `rooms_new` DISABLE KEYS */;
INSERT INTO `rooms_new` (`id`, `room_name`, `room_number`, `room_code`, `category_id`, `floor_number`, `base_price`, `price_12_hours`, `price_24_hours`, `weekend_price`, `festival_price`, `extra_bed_price`, `max_adults`, `max_children`, `max_guests`, `room_size`, `bed_type`, `number_of_beds`, `balcony`, `air_conditioning`, `smoking_allowed`, `short_description`, `full_description`, `highlights`, `house_rules`, `status`, `show_on_website`, `featured_image`, `created_at`, `updated_at`) VALUES (1,'TEST','100','100',1,NULL,2500.00,1500.00,NULL,3000.00,4000.00,NULL,2,1,3,'450','Queen Size',1,1,1,0,'','','','','Occupied',1,'/uploads/rooms/room_1781943964_5838.jpg','2026-06-20 08:26:04','2026-07-07 12:13:31'),(2,'Royal Emerald Suite','501','RE-501',1,5,5500.00,NULL,NULL,NULL,NULL,NULL,2,1,3,'450','King Size Master',1,1,1,0,'Experience ultimate luxury in our signature Royal Emerald Suite with panoramic temple views.','The Royal Emerald Suite at Subra Residency offers an unparalleled blend of traditional elegance and modern luxury. Designed for discerning travelers, this suite features a spacious master bedroom, a private balcony overlooking the historic Kumbakonam skyline, and premium amenities including a walk-in rain shower and a dedicated workstation. Enjoy the comfort of climate control and the serenity of our soundproofed sanctuary.','Private Balcony • Panoramic Views • Rain Shower • Premium Linens','No loud music after 10 PM. Check-out by 11 AM.','Occupied',1,'/uploads/rooms/sample_featured.jpg','2026-06-20 08:38:17','2026-07-07 13:42:00'),(3,'Super Delux','SH-501','',2,NULL,2700.00,NULL,NULL,3000.00,NULL,NULL,5,0,3,'550','King Size',1,1,0,0,'','Welcome to our signature Royal Heritage Suite. This room is a tribute to the architectural brilliance of Kumbakonam, blending centuries-old design with 21st-century comfort. Relax on a custom-made King bed surrounded by artisanal woodwork, or enjoy a private sunset on the balcony with a view of the grand gopurams.','Panoramic Temple View • Hand-Carved Teak Wood • Private Balcony • Rain Shower','No loud music. Check-out by 11 AM.','Available',1,'/uploads/rooms/room_1.png','2026-06-20 08:43:56','2026-07-07 12:12:14'),(4,'Executive Garden Room','SH-204','ExecutiveGardenRoom',1,3,3800.00,NULL,NULL,NULL,NULL,NULL,2,1,3,'450','King Size',1,1,1,0,'Premium executive room with twin beds and a serene view of our lush internal courtyards.','Perfect for business travelers and heritage seekers alike, the Executive Garden Room offers a tranquil escape from the bustling city. Featuring ergonomic workspaces, twin beds with premium linens, and floor-to-ceiling windows overlooking our botanical gardens.','Garden View • Twin Beds • Ergonomic Workspace • Soundproof Glazing','No loud music. Check-out by 11 AM.','Available',1,'/uploads/rooms/room_2.png','2026-06-20 08:43:56','2026-06-20 08:43:56'),(5,'Legacy Gold Suite','SH-305','LegacyGoldSuite',1,3,4500.00,NULL,NULL,NULL,NULL,NULL,2,1,3,'450','King Size',1,1,1,0,'A beautifully appointed suite with golden-hour balcony views and traditional South Indian charm.','The Legacy Gold Suite captures the essence of South Indian hospitality. With golden-hour views from your private balcony and pillars inspired by ancient temple architecture, this suite is designed for those who appreciate the finer details of heritage living.','Golden Hour Balcony • Pillar Architecture • Luxury Spa Bathtub • Premium Linens','No loud music. Check-out by 11 AM.','Occupied',1,'/uploads/rooms/room_3.png','2026-06-20 08:43:56','2026-07-07 12:05:37');
/*!40000 ALTER TABLE `rooms_new` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` (`id`, `setting_key`, `setting_value`, `updated_at`) VALUES (1,'site_name','Subra Residency','2026-06-27 08:43:45'),(2,'site_email','contact@subraresidency.com','2026-06-27 08:43:45'),(3,'site_phone','+91 9876543210','2026-06-27 08:43:45'),(4,'site_address','123 Temple Road, Kumbakonam, Tamil Nadu','2026-06-27 08:43:45'),(5,'site_description','A luxury stay near the heart of Kumbakonam.','2026-06-27 08:43:45'),(6,'social_facebook','https://facebook.com/subraresidency','2026-06-27 08:43:45'),(7,'social_instagram','https://instagram.com/subraresidency','2026-06-27 08:43:45'),(8,'social_twitter','https://twitter.com/subraresidency','2026-06-27 08:43:45'),(9,'seo_title','Subra Residency | Best Hotel in Kumbakonam','2026-06-27 08:43:45'),(10,'seo_keywords','hotel, kumbakonam, residency, luxury stay, temple city','2026-06-27 08:43:45'),(11,'seo_description','Experience the spiritual essence of Kumbakonam with a comfortable stay at Subra Residency.','2026-06-27 08:43:45'),(12,'check_in_time','12:00 PM','2026-06-27 08:43:45'),(13,'check_out_time','11:00 AM','2026-06-27 08:43:45'),(14,'tax_percentage','12','2026-06-27 08:43:45'),(15,'currency_symbol','₹','2026-06-27 08:43:45'),(16,'currency_code','INR','2026-06-27 08:43:45'),(17,'enable_online_booking','true','2026-06-27 08:43:45'),(18,'enable_notifications','true','2026-06-27 08:43:45');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `temples` WRITE;
/*!40000 ALTER TABLE `temples` DISABLE KEYS */;
/*!40000 ALTER TABLE `temples` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;


SET FOREIGN_KEY_CHECKS=1;
