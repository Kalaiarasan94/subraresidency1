-- MariaDB dump 10.19  Distrib 10.4.28-MariaDB, for osx10.10 (x86_64)
--
-- Host: localhost    Database: subra
-- ------------------------------------------------------
-- Server version	10.4.28-MariaDB

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

--
-- Table structure for table `admins`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'admin','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Subra Admin','admin@subraresidency.com','2026-06-19 13:04:56');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attractions`
--

DROP TABLE IF EXISTS `attractions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attractions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `distance` varchar(100) NOT NULL,
  `mode` varchar(100) NOT NULL,
  `timing` varchar(150) NOT NULL,
  `dress_code` varchar(150) NOT NULL,
  `special_for` text NOT NULL,
  `description` text NOT NULL,
  `guest_note` text NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attractions`
--

LOCK TABLES `attractions` WRITE;
/*!40000 ALTER TABLE `attractions` DISABLE KEYS */;
INSERT INTO `attractions` VALUES (1,'Mahamaham Tank','700m from residency','Walk / Auto','6:00 AM - 9:00 PM','Modest attire recommended','Mahamaham festival, holy bathing rituals, sacred tank visit and spiritual photography.','Mahamaham Tank is one of the most sacred landmarks of Kumbakonam and closely connected with the spiritual identity of the town. It is especially known for the Mahamaham festival, celebrated once in twelve years and visited by devotees from many places. The tank is associated with holy bathing rituals and temple traditions.','Since it is very close to Subra Residency, guests can visit by walk or auto.','/uploads/attractions/mahamaham.jpg',10,'2026-07-10 12:26:36','2026-07-10 12:44:53'),(2,'Kasi Viswanathar Temple','Approximately 700 meters','Walk / Auto','7:00 AM–12:00 PM and 4:00 PM–8:00 PM','Traditional / modest attire recommended','Shiva darshan, Mahamaham-area temple visit and peaceful spiritual atmosphere.','Kasi Viswanathar Temple is a revered Shiva temple located near Mahamaham Tank. It is an important temple for devotees seeking Lord Shiva\'s blessings and is closely connected with the sacred character of Kumbakonam. The temple is suitable for peaceful darshan and can be easily combined with a visit to Mahamaham Tank.','This is a convenient short visit from the hotel.','https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',20,'2026-07-10 12:26:36','2026-07-10 12:26:36'),(3,'Nageswaran Temple','Approximately 1.2 kilometers','Auto preferred','6:00 AM–12:00 PM and 4:00 PM–8:30 PM','Modest traditional attire recommended','Chola-era architecture, Shiva worship, peaceful darshan and heritage interest.','Nageswaran Temple is an ancient Shiva temple admired for its Chola-era architectural style and calm spiritual setting. It is one of the important temples within Kumbakonam town and is visited by devotees as well as heritage lovers. The temple\'s traditional structure, stone work and peaceful ambience make it a meaningful stop in the in-town spiritual trail.','Auto is preferred for a comfortable visit.','https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',30,'2026-07-10 12:26:36','2026-07-10 12:26:36'),(4,'Sarangapani Temple','Approximately 1.8 kilometers','Auto','6:00 AM–12:30 PM and 4:00 PM–9:00 PM','Traditional / modest attire recommended','Divya Desam worship, Lord Vishnu darshan, chariot-style sanctum and grand temple architecture.','Sarangapani Temple is one of the most important Vishnu temples in Kumbakonam and is associated with the Divya Desam tradition. The temple is known for its grand structure, deep Vaishnavite significance and impressive chariot-style sanctum. It is one of the must-visit temples for guests exploring the spiritual identity of Kumbakonam.','Suitable for both pilgrims and heritage travellers.','/uploads/attractions/sarangapani.jpg',40,'2026-07-10 12:26:36','2026-07-10 12:26:36'),(5,'Arulmigu Adi Kumbeswarar Temple','Approximately 2.3 kilometers','Auto / Cab','5:30 AM–12:00 PM and 4:00 PM–8:30 PM','Fully covered traditional / modest attire recommended','Major Shiva temple, Kumbakonam origin legend, Mahamaham connection and traditional worship.','Arulmigu Adi Kumbeswarar Temple is one of the most important Shiva temples in Kumbakonam. It is closely connected with the origin legend of Kumbakonam and the sacred Mahamaham tradition. The temple is one of the main spiritual landmarks of the town and is considered an essential visit for pilgrims coming to Kumbakonam.','Plan extra time during festival days, Pradosham and auspicious occasions.','/uploads/attractions/ramaswamy.jpg',50,'2026-07-10 12:26:36','2026-07-10 12:26:36'),(6,'Chakrapani Temple','Approximately 2.8 kilometers','Auto','6:00 AM–12:00 PM and 4:00 PM–8:30 PM','Traditional / modest attire recommended','Sudarshana Chakra worship, Vishnu temple tradition and peaceful darshan.','Chakrapani Temple is a historic Vishnu temple dedicated to Sudarshana Chakra. It is known for its unique iconography and peaceful temple atmosphere. The temple is an important Vaishnavite spiritual stop within Kumbakonam and can be included along with other nearby town temples.','Can be combined with Sarangapani Temple and other nearby temples.','https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',60,'2026-07-10 12:26:36','2026-07-10 12:26:36'),(7,'Airavatesvara Temple, Darasuram','Approximately 4.5 kilometers','Auto / Cab','6:00 AM–12:00 PM and 4:00 PM–8:00 PM','Modest attire recommended','Chola architecture, UNESCO-recognised heritage, sculptural beauty and stone carvings.','Airavatesvara Temple at Darasuram is one of the finest examples of Chola temple architecture near Kumbakonam. It is admired for its stone carvings, sculpted mandapams, detailed pillars and artistic beauty. The temple is especially suitable for guests who love heritage, sculpture, photography and South Indian temple architecture.','Cab or auto is recommended for a comfortable visit.','/uploads/attractions/airavatesvara.jpg',70,'2026-07-10 12:26:36','2026-07-10 12:26:36'),(8,'Arulmigu Sri Oppiliappan Temple','Approximately 6.2 kilometers','Cab / Auto','6:00 AM–1:00 PM and 4:00 PM–9:00 PM','Traditional / modest attire recommended','Divya Desam worship, salt-free prasadam, Lord Vishnu darshan and family prayers.','Arulmigu Sri Oppiliappan Temple is a sacred Divya Desam dedicated to Lord Vishnu. The temple is especially known for its prasadam prepared without salt and its strong Vaishnavite tradition. It is a major pilgrimage destination near Kumbakonam and is highly suitable for families and devotees.','Cab is recommended for families and senior citizens.','/uploads/attractions/uppiliappan.jpg',80,'2026-07-10 12:26:36','2026-07-10 12:26:36'),(9,'Sri Swarnapureeswarar Temple','Approximately 6.6 kilometers','Cab recommended','6:00 AM–12:00 PM and 4:30 PM–8:30 PM','Modest traditional attire recommended','Shiva worship, calm temple atmosphere, local spiritual tradition and peaceful darshan.','Sri Swarnapureeswarar Temple is a revered Shiva temple known for its peaceful ambience, spiritual significance and traditional local worship practices. It is a meaningful stop for guests who wish to explore a quieter temple away from the busier town centre.','Best visited by cab for a smoother travel experience.','https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',90,'2026-07-10 12:26:36','2026-07-10 12:26:36'),(10,'Swamimalai Murugan Temple','Approximately 7.9 kilometers','Cab recommended','6:00 AM–12:00 PM and 4:00 PM–8:30 PM','Traditional / modest attire recommended','Arupadai Veedu temple, Lord Murugan worship, Pranava mantra legend and family pilgrimage.','Swamimalai Murugan Temple is one of the six sacred abodes of Lord Murugan. The temple is celebrated for the legend of Lord Murugan teaching the meaning of the Pranava mantra. It is one of the most important Murugan temples near Kumbakonam and is a must-visit for Lord Murugan devotees.','Cab is recommended, especially for families and elderly guests.','https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',100,'2026-07-10 12:26:36','2026-07-10 12:26:36'),(11,'Thiruvidaimarudur Mahalinga Swamy Temple','Approximately 10 kilometers','Cab recommended','5:30 AM–12:30 PM and 4:00 PM–9:00 PM','Traditional / modest attire recommended','Major Shiva worship, grand temple corridors, powerful spiritual atmosphere and traditional darshan.','Thiruvidaimarudur Mahalinga Swamy Temple is a major Shiva sthalam known for its grand scale, majestic corridors and powerful spiritual atmosphere. It is one of the important Shiva temples near Kumbakonam. The temple\'s size, traditional ambience and sanctity make it a meaningful part of the extended temple trail.','Cab is preferred due to the distance from the property.','https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',110,'2026-07-10 12:26:36','2026-07-10 12:26:36');
/*!40000 ALTER TABLE `attractions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_details`
--

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
  `children` int(11) DEFAULT 0,
  `extra_guest_charge` decimal(10,2) DEFAULT 0.00,
  `extra_adults` int(11) DEFAULT 0,
  `extra_children` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `booking_details_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_details`
--

LOCK TABLES `booking_details` WRITE;
/*!40000 ALTER TABLE `booking_details` DISABLE KEYS */;
INSERT INTO `booking_details` VALUES (1,1,'Ambikkumar Sithamparappillai','ambi_sutha@yahoo.com','18476625560','3','USA','1414 W Lexington St.\nChicago','We may need to leave our bags at the hotel around 6:30–7:00 a.m. and come back later to check in.','2026-10-09 14:12:49',0,0.00,0,0),(2,2,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','9092631299','4 Guests','India','kamarajar Salai','test','2026-10-14 08:20:55',0,0.00,0,0);
/*!40000 ALTER TABLE `booking_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_rooms`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_rooms`
--

LOCK TABLES `booking_rooms` WRITE;
/*!40000 ALTER TABLE `booking_rooms` DISABLE KEYS */;
INSERT INTO `booking_rooms` VALUES (1,1,9,8850.00),(2,2,35,3349.00);
/*!40000 ALTER TABLE `booking_rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

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
  `booking_source` varchar(50) NOT NULL DEFAULT 'Online',
  `actual_amount` decimal(10,2) DEFAULT NULL,
  `platform_fee` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_id` (`booking_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'HBK20261009444E',NULL,'Ambikkumar Sithamparappillai','ambi_sutha@yahoo.com','18476625560','2026-10-22','2026-10-25',8850.00,'confirmed','success','website','We may need to leave our bags at the hotel around 6:30–7:00 a.m. and come back later to check in.','2026-10-09 14:12:49','Online',NULL,0.00),(2,'HBK202610144E42',NULL,'Kirtheeswaran G R M','kirtheeswarangrm@gmail.com','9092631299','2026-10-14','2026-10-15',3349.00,'confirmed','success','website','test','2026-10-14 08:20:55','Online',NULL,0.00);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

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
  `platform_fee` decimal(10,2) DEFAULT 0.00,
  `gross_amount` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,'pay_Tlq6f18YeI3dLH',8850.00,'razorpay','success','2026-10-09 14:17:16',0.00,NULL),(2,2,'pay_TniihN4gxb8ieH',3349.00,'razorpay','success','2026-10-14 08:21:23',0.00,NULL);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `qr_codes`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `qr_codes`
--

LOCK TABLES `qr_codes` WRITE;
/*!40000 ALTER TABLE `qr_codes` DISABLE KEYS */;
INSERT INTO `qr_codes` VALUES (1,1,'HBK20261009444E','2026-10-09 14:17:16'),(2,2,'HBK202610144E42','2026-10-14 08:21:23');
/*!40000 ALTER TABLE `qr_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reception_users`
--

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

--
-- Dumping data for table `reception_users`
--

LOCK TABLES `reception_users` WRITE;
/*!40000 ALTER TABLE `reception_users` DISABLE KEYS */;
INSERT INTO `reception_users` VALUES (1,'rec','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Subra Reception','rec@subraresidency.com','2026-06-19 13:04:56'),(2,'receptionist','$2y$10$qkGvNwh9XWX3jX/zb1WlW.C/ibdEaYB8r7z22wLSdSeHBvXMHjfyi','Receptionist Manager','receptionist@subra.com','2026-06-27 09:30:56');
/*!40000 ALTER TABLE `reception_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receptionist_notifications`
--

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

--
-- Dumping data for table `receptionist_notifications`
--

LOCK TABLES `receptionist_notifications` WRITE;
/*!40000 ALTER TABLE `receptionist_notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `receptionist_notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_amenities`
--

DROP TABLE IF EXISTS `room_amenities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `room_amenities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `room_id` int(11) DEFAULT NULL,
  `amenity_name` varchar(100) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `room_amenities_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms_new` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=194 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_amenities`
--

LOCK TABLES `room_amenities` WRITE;
/*!40000 ALTER TABLE `room_amenities` DISABLE KEYS */;
INSERT INTO `room_amenities` VALUES (178,NULL,'Mini Fridge',2),(179,NULL,'Room Service',2),(180,NULL,'City View',2),(181,NULL,'Temple View',2),(182,NULL,'Bathtub',2),(183,NULL,'Workspace',2),(184,NULL,'High-Speed WiFi',4),(185,NULL,'Smart TV',4),(186,NULL,'Mini Fridge',4),(187,NULL,'Room Service',4),(188,NULL,'Workspace',4),(189,NULL,'Temple View',4),(190,NULL,'WiFi',10),(191,NULL,'TV',10),(192,NULL,'Balcony',10),(193,NULL,'Rain Shower',10);
/*!40000 ALTER TABLE `room_amenities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_availability`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_availability`
--

LOCK TABLES `room_availability` WRITE;
/*!40000 ALTER TABLE `room_availability` DISABLE KEYS */;
INSERT INTO `room_availability` VALUES (1,9,'2026-10-22','Booked','booking:HBK20261009444E','2026-10-09 14:17:16'),(2,9,'2026-10-23','Booked','booking:HBK20261009444E','2026-10-09 14:17:16'),(3,9,'2026-10-24','Booked','booking:HBK20261009444E','2026-10-09 14:17:16'),(4,35,'2026-10-14','Booked','booking:HBK202610144E42','2026-10-14 08:21:23');
/*!40000 ALTER TABLE `room_availability` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_categories`
--

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
  `featured_image` varchar(255) DEFAULT NULL,
  `full_description` text DEFAULT NULL,
  `highlights` text DEFAULT NULL,
  `house_rules` text DEFAULT NULL,
  `bed_type` varchar(50) DEFAULT NULL,
  `number_of_beds` int(11) DEFAULT NULL,
  `balcony` tinyint(1) DEFAULT 0,
  `air_conditioning` tinyint(1) DEFAULT 1,
  `smoking_allowed` tinyint(1) DEFAULT 0,
  `max_guests` int(11) DEFAULT NULL,
  `show_on_website` tinyint(1) DEFAULT 1,
  `status` enum('Available','Maintenance','Inactive') DEFAULT 'Available',
  `maintenance_start` date DEFAULT NULL,
  `maintenance_end` date DEFAULT NULL,
  `sub_room_count` int(11) DEFAULT 5,
  `floor_number` varchar(50) DEFAULT '3',
  `category_tag` varchar(50) DEFAULT 'Premium',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_categories`
--

LOCK TABLES `room_categories` WRITE;
/*!40000 ALTER TABLE `room_categories` DISABLE KEYS */;
INSERT INTO `room_categories` VALUES (2,'TEST','',1500.00,2500.00,3,1,'450',NULL,'2026-07-08 10:32:05','/uploads/rooms/gallery_1783935600_3064.webp',NULL,'',NULL,'Queen Size',1,1,1,0,3,1,'Available',NULL,NULL,2,'3','Premium'),(4,'Super Delux','',NULL,2700.00,5,NULL,'550',NULL,'2026-07-08 10:32:05','/uploads/rooms/room_1.png','The Super Delux room offers spacious comfort with modern amenities and elegant traditional decor.','Panoramic Temple View • Hand-Carved Teak Wood • Private Balcony • Rain Shower','No loud music. Check-out by 11 AM.','King Size',1,1,0,0,3,1,'Available',NULL,NULL,2,'3','Premium'),(10,'Add Room Test','',NULL,1999.00,2,2,'550',NULL,'2026-07-13 09:43:24','/uploads/rooms/category_1783935804_2696.webp','The Royal Emerald Suite at Subra Residency offers an unparalleled blend of traditional elegance and modern luxury. Designed for discerning travelers, this suite features a spacious master bedroom, a private balcony overlooking the historic Kumbakonam skyline, and premium amenities including a walk-in rain shower and a dedicated workstation. Enjoy the comfort of climate control and the serenity of our soundproofed sanctuary.','',NULL,'Double Bed',1,0,1,0,NULL,1,'Available',NULL,NULL,2,'3','Premium');
/*!40000 ALTER TABLE `room_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_images`
--

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

--
-- Dumping data for table `room_images`
--

LOCK TABLES `room_images` WRITE;
/*!40000 ALTER TABLE `room_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `room_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_images_new`
--

DROP TABLE IF EXISTS `room_images_new`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `room_images_new` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `room_id` int(11) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `category_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `room_images_new_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms_new` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_images_new`
--

LOCK TABLES `room_images_new` WRITE;
/*!40000 ALTER TABLE `room_images_new` DISABLE KEYS */;
INSERT INTO `room_images_new` VALUES (5,3,'/uploads/rooms/room_1.png',0,'2026-06-20 08:43:56',4),(8,3,'/uploads/rooms/gallery_1783412853_8186.jpeg',10,'2026-07-07 08:27:33',4),(9,3,'/uploads/rooms/gallery_1783412863_8833.png',20,'2026-07-07 08:27:43',4),(10,3,'/uploads/rooms/gallery_1783413992_3604.png',30,'2026-07-07 08:46:32',4),(16,NULL,'/uploads/rooms/gallery_1783935600_3064.webp',10,'2026-07-13 09:40:00',2),(18,NULL,'/uploads/rooms/gallery_1784032951_2320.webp',10,'2026-07-14 12:42:31',10);
/*!40000 ALTER TABLE `room_images_new` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

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

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'100',NULL,'available',1);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms_new`
--

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
  `maintenance_start` date DEFAULT NULL,
  `maintenance_end` date DEFAULT NULL,
  `show_on_website` tinyint(1) DEFAULT 1,
  `featured_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `room_number` (`room_number`),
  KEY `fk_rooms_new_category` (`category_id`),
  CONSTRAINT `fk_rooms_new_category` FOREIGN KEY (`category_id`) REFERENCES `room_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms_new`
--

LOCK TABLES `rooms_new` WRITE;
/*!40000 ALTER TABLE `rooms_new` DISABLE KEYS */;
INSERT INTO `rooms_new` VALUES (3,'Super Delux','SD-01','',4,1,2700.00,NULL,NULL,3000.00,NULL,NULL,5,0,3,'550','King Size',1,1,0,0,'','Welcome to our signature Royal Heritage Suite. This room is a tribute to the architectural brilliance of Kumbakonam, blending centuries-old design with 21st-century comfort. Relax on a custom-made King bed surrounded by artisanal woodwork, or enjoy a private sunset on the balcony with a view of the grand gopurams.','Panoramic Temple View • Hand-Carved Teak Wood • Private Balcony • Rain Shower','No loud music. Check-out by 11 AM.','Available',NULL,NULL,1,'/uploads/rooms/room_1.png','2026-06-20 08:43:56','2026-08-04 10:41:33'),(9,'TEST','TS-01',NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,0,NULL,NULL,NULL,NULL,'Available',NULL,NULL,1,NULL,'2026-07-08 10:32:05','2026-07-18 07:11:22'),(16,'Super Delux','SD-02',NULL,4,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,0,NULL,NULL,NULL,NULL,'Available',NULL,NULL,1,NULL,'2026-07-08 10:32:05','2026-07-18 07:11:22'),(34,'TEST','TS-02',NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,0,NULL,NULL,NULL,NULL,'Available',NULL,NULL,1,NULL,'2026-07-10 10:31:45','2026-07-18 07:11:22'),(35,'Add Room Test','AR1-1',NULL,10,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,0,NULL,NULL,NULL,NULL,'Available',NULL,NULL,1,NULL,'2026-07-13 09:43:24','2026-07-18 07:11:22'),(36,'Add Room Test','AR1-2',NULL,10,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,0,NULL,NULL,NULL,NULL,'Available',NULL,NULL,1,NULL,'2026-07-13 09:43:24','2026-08-06 09:47:52');
/*!40000 ALTER TABLE `rooms_new` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,'site_name','Subra Residency','2026-06-27 08:43:45'),(2,'site_email','contact@subraresidency.com','2026-06-27 08:43:45'),(3,'site_phone','+91 9876543210','2026-06-27 08:43:45'),(4,'site_address','123 Temple Road, Kumbakonam, Tamil Nadu','2026-06-27 08:43:45'),(5,'site_description','A luxury stay near the heart of Kumbakonam.','2026-06-27 08:43:45'),(6,'social_facebook','https://facebook.com/subraresidency','2026-06-27 08:43:45'),(7,'social_instagram','https://instagram.com/subraresidency','2026-06-27 08:43:45'),(8,'social_twitter','https://twitter.com/subraresidency','2026-06-27 08:43:45'),(9,'seo_title','Subra Residency | Best Hotel in Kumbakonam','2026-06-27 08:43:45'),(10,'seo_keywords','hotel, kumbakonam, residency, luxury stay, temple city','2026-06-27 08:43:45'),(11,'seo_description','Experience the spiritual essence of Kumbakonam with a comfortable stay at Subra Residency.','2026-06-27 08:43:45'),(12,'check_in_time','12:00 PM','2026-06-27 08:43:45'),(13,'check_out_time','11:00 AM','2026-06-27 08:43:45'),(14,'tax_percentage','12','2026-06-27 08:43:45'),(15,'currency_symbol','₹','2026-06-27 08:43:45'),(16,'currency_code','INR','2026-06-27 08:43:45'),(17,'enable_online_booking','true','2026-06-27 08:43:45'),(18,'enable_notifications','true','2026-06-27 08:43:45'),(19,'popup_banner_image','/uploads/banners/banner_1784032393_9866.webp','2026-07-14 12:33:13'),(20,'popup_banner_enabled','true','2026-07-10 10:32:46'),(21,'temple_section_desc','Kumbakonam is surrounded by some of Tamil Nadu\'s most revered temples, sacred tanks and spiritual landmarks. Guests staying at Subra Residency can easily plan temple visits from the property, as many important temples are located within a short travel distance. Discover the rich spiritual heritage of the region through these iconic destinations.','2026-07-14 12:46:31');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `temples`
--

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

--
-- Dumping data for table `temples`
--

LOCK TABLES `temples` WRITE;
/*!40000 ALTER TABLE `temples` DISABLE KEYS */;
/*!40000 ALTER TABLE `temples` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

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

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
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

-- Dump completed on 2026-10-14 23:59:29
