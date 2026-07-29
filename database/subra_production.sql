-- Subra Residency - Fully Consolidated Production Database Dump
-- Generated via API: 2026-07-18 09:31:04
SET FOREIGN_KEY_CHECKS=0;
SET NAMES utf8mb4;

DROP TABLE IF EXISTS `admins`;
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

INSERT INTO `admins` (`id`, `username`, `password`, `full_name`, `email`, `created_at`) VALUES
('1', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Subra Admin', 'admin@subraresidency.com', '2026-06-19 18:34:56');

DROP TABLE IF EXISTS `attractions`;
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

INSERT INTO `attractions` (`id`, `name`, `distance`, `mode`, `timing`, `dress_code`, `special_for`, `description`, `guest_note`, `image_path`, `sort_order`, `created_at`, `updated_at`) VALUES
('1', 'Mahamaham Tank', '700m from residency', 'Walk / Auto', '6:00 AM - 9:00 PM', 'Modest attire recommended', 'Mahamaham festival, holy bathing rituals, sacred tank visit and spiritual photography.', 'Mahamaham Tank is one of the most sacred landmarks of Kumbakonam and closely connected with the spiritual identity of the town. It is especially known for the Mahamaham festival, celebrated once in twelve years and visited by devotees from many places. The tank is associated with holy bathing rituals and temple traditions.', 'Since it is very close to Subra Residency, guests can visit by walk or auto.', '/uploads/attractions/mahamaham.jpg', '10', '2026-07-10 17:56:36', '2026-07-10 18:14:53'),
('2', 'Kasi Viswanathar Temple', 'Approximately 700 meters', 'Walk / Auto', '7:00 AM–12:00 PM and 4:00 PM–8:00 PM', 'Traditional / modest attire recommended', 'Shiva darshan, Mahamaham-area temple visit and peaceful spiritual atmosphere.', 'Kasi Viswanathar Temple is a revered Shiva temple located near Mahamaham Tank. It is an important temple for devotees seeking Lord Shiva\'s blessings and is closely connected with the sacred character of Kumbakonam. The temple is suitable for peaceful darshan and can be easily combined with a visit to Mahamaham Tank.', 'This is a convenient short visit from the hotel.', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80', '20', '2026-07-10 17:56:36', '2026-07-10 17:56:36'),
('3', 'Nageswaran Temple', 'Approximately 1.2 kilometers', 'Auto preferred', '6:00 AM–12:00 PM and 4:00 PM–8:30 PM', 'Modest traditional attire recommended', 'Chola-era architecture, Shiva worship, peaceful darshan and heritage interest.', 'Nageswaran Temple is an ancient Shiva temple admired for its Chola-era architectural style and calm spiritual setting. It is one of the important temples within Kumbakonam town and is visited by devotees as well as heritage lovers. The temple\'s traditional structure, stone work and peaceful ambience make it a meaningful stop in the in-town spiritual trail.', 'Auto is preferred for a comfortable visit.', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80', '30', '2026-07-10 17:56:36', '2026-07-10 17:56:36'),
('4', 'Sarangapani Temple', 'Approximately 1.8 kilometers', 'Auto', '6:00 AM–12:30 PM and 4:00 PM–9:00 PM', 'Traditional / modest attire recommended', 'Divya Desam worship, Lord Vishnu darshan, chariot-style sanctum and grand temple architecture.', 'Sarangapani Temple is one of the most important Vishnu temples in Kumbakonam and is associated with the Divya Desam tradition. The temple is known for its grand structure, deep Vaishnavite significance and impressive chariot-style sanctum. It is one of the must-visit temples for guests exploring the spiritual identity of Kumbakonam.', 'Suitable for both pilgrims and heritage travellers.', '/uploads/attractions/sarangapani.jpg', '40', '2026-07-10 17:56:36', '2026-07-10 17:56:36'),
('5', 'Arulmigu Adi Kumbeswarar Temple', 'Approximately 2.3 kilometers', 'Auto / Cab', '5:30 AM–12:00 PM and 4:00 PM–8:30 PM', 'Fully covered traditional / modest attire recommended', 'Major Shiva temple, Kumbakonam origin legend, Mahamaham connection and traditional worship.', 'Arulmigu Adi Kumbeswarar Temple is one of the most important Shiva temples in Kumbakonam. It is closely connected with the origin legend of Kumbakonam and the sacred Mahamaham tradition. The temple is one of the main spiritual landmarks of the town and is considered an essential visit for pilgrims coming to Kumbakonam.', 'Plan extra time during festival days, Pradosham and auspicious occasions.', '/uploads/attractions/ramaswamy.jpg', '50', '2026-07-10 17:56:36', '2026-07-10 17:56:36'),
('6', 'Chakrapani Temple', 'Approximately 2.8 kilometers', 'Auto', '6:00 AM–12:00 PM and 4:00 PM–8:30 PM', 'Traditional / modest attire recommended', 'Sudarshana Chakra worship, Vishnu temple tradition and peaceful darshan.', 'Chakrapani Temple is a historic Vishnu temple dedicated to Sudarshana Chakra. It is known for its unique iconography and peaceful temple atmosphere. The temple is an important Vaishnavite spiritual stop within Kumbakonam and can be included along with other nearby town temples.', 'Can be combined with Sarangapani Temple and other nearby temples.', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80', '60', '2026-07-10 17:56:36', '2026-07-10 17:56:36'),
('7', 'Airavatesvara Temple, Darasuram', 'Approximately 4.5 kilometers', 'Auto / Cab', '6:00 AM–12:00 PM and 4:00 PM–8:00 PM', 'Modest attire recommended', 'Chola architecture, UNESCO-recognised heritage, sculptural beauty and stone carvings.', 'Airavatesvara Temple at Darasuram is one of the finest examples of Chola temple architecture near Kumbakonam. It is admired for its stone carvings, sculpted mandapams, detailed pillars and artistic beauty. The temple is especially suitable for guests who love heritage, sculpture, photography and South Indian temple architecture.', 'Cab or auto is recommended for a comfortable visit.', '/uploads/attractions/airavatesvara.jpg', '70', '2026-07-10 17:56:36', '2026-07-10 17:56:36'),
('8', 'Arulmigu Sri Oppiliappan Temple', 'Approximately 6.2 kilometers', 'Cab / Auto', '6:00 AM–1:00 PM and 4:00 PM–9:00 PM', 'Traditional / modest attire recommended', 'Divya Desam worship, salt-free prasadam, Lord Vishnu darshan and family prayers.', 'Arulmigu Sri Oppiliappan Temple is a sacred Divya Desam dedicated to Lord Vishnu. The temple is especially known for its prasadam prepared without salt and its strong Vaishnavite tradition. It is a major pilgrimage destination near Kumbakonam and is highly suitable for families and devotees.', 'Cab is recommended for families and senior citizens.', '/uploads/attractions/uppiliappan.jpg', '80', '2026-07-10 17:56:36', '2026-07-10 17:56:36'),
('9', 'Sri Swarnapureeswarar Temple', 'Approximately 6.6 kilometers', 'Cab recommended', '6:00 AM–12:00 PM and 4:30 PM–8:30 PM', 'Modest traditional attire recommended', 'Shiva worship, calm temple atmosphere, local spiritual tradition and peaceful darshan.', 'Sri Swarnapureeswarar Temple is a revered Shiva temple known for its peaceful ambience, spiritual significance and traditional local worship practices. It is a meaningful stop for guests who wish to explore a quieter temple away from the busier town centre.', 'Best visited by cab for a smoother travel experience.', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80', '90', '2026-07-10 17:56:36', '2026-07-10 17:56:36'),
('10', 'Swamimalai Murugan Temple', 'Approximately 7.9 kilometers', 'Cab recommended', '6:00 AM–12:00 PM and 4:00 PM–8:30 PM', 'Traditional / modest attire recommended', 'Arupadai Veedu temple, Lord Murugan worship, Pranava mantra legend and family pilgrimage.', 'Swamimalai Murugan Temple is one of the six sacred abodes of Lord Murugan. The temple is celebrated for the legend of Lord Murugan teaching the meaning of the Pranava mantra. It is one of the most important Murugan temples near Kumbakonam and is a must-visit for Lord Murugan devotees.', 'Cab is recommended, especially for families and elderly guests.', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80', '100', '2026-07-10 17:56:36', '2026-07-10 17:56:36'),
('11', 'Thiruvidaimarudur Mahalinga Swamy Temple', 'Approximately 10 kilometers', 'Cab recommended', '5:30 AM–12:30 PM and 4:00 PM–9:00 PM', 'Traditional / modest attire recommended', 'Major Shiva worship, grand temple corridors, powerful spiritual atmosphere and traditional darshan.', 'Thiruvidaimarudur Mahalinga Swamy Temple is a major Shiva sthalam known for its grand scale, majestic corridors and powerful spiritual atmosphere. It is one of the important Shiva temples near Kumbakonam. The temple\'s size, traditional ambience and sanctity make it a meaningful part of the extended temple trail.', 'Cab is preferred due to the distance from the property.', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80', '110', '2026-07-10 17:56:36', '2026-07-10 17:56:36');

DROP TABLE IF EXISTS `booking_details`;
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
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `booking_details_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `booking_details` (`id`, `booking_id`, `guest_name`, `guest_email`, `guest_phone`, `guests`, `country`, `address`, `additional_notes`, `created_at`, `children`) VALUES
('1', '3', 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '7904242107', '2 Guests', 'India', 'maduari', 'Nothing ', '2026-06-26 15:07:40', '0'),
('2', '4', 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '1234567876543', '2 Guests', 'India', '1234567', '', '2026-06-26 15:19:56', '0'),
('3', '5', 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '76042421037', '2 Guests', 'India', '1234567', '', '2026-06-26 15:20:06', '0'),
('4', '6', 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '76042421037', '2 Guests', 'India', 'zgdgjyrhg', '', '2026-06-26 15:20:16', '0'),
('5', '7', 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '9876543210', '2 Guests', 'India', 'bk', '', '2026-06-26 17:05:24', '0'),
('6', '8', 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '8989897656', '2 Guests', 'India', '1233, Mdau', '', '2026-06-26 19:14:57', '0'),
('7', '9', 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '12345434444', '2 Guests', 'India', 'qwwdef', '', '2026-06-26 19:24:12', '0'),
('8', '10', 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '123454321', '2 Guests', 'India', '123, Madu', '', '2026-06-26 19:34:58', '0'),
('9', '11', 'Kirtheeswaran G R M', 'bhalaramsembu@gmail.com', '7878786565', '2 Guests', 'India', '123, madurai', '', '2026-06-26 19:38:19', '0'),
('10', '12', 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '234567654321', '2 Guests', 'India', '123 bfc', '', '2026-06-26 20:04:40', '0'),
('11', '13', 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '765432345', '2 Guests', 'India', '123, efdfgdrtfb ', '', '2026-06-26 20:05:44', '0'),
('12', '14', 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '098765432', '2 Guests', 'India', '123, mdu', '', '2026-06-26 20:14:49', '0'),
('13', '15', 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '78945613', '2', 'India', 'Nithing', 'othj', '2026-07-07 13:53:42', '0'),
('14', '16', 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '78945613', '2', 'India', 'Nithing', 'othj', '2026-07-07 14:00:43', '0'),
('15', '17', 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '123456789', '2', 'India', '123456', '123456', '2026-07-07 14:15:59', '0'),
('16', '18', 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '123456789', '2', 'India', '123456', '123456', '2026-07-07 14:30:12', '0'),
('18', '20', 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '9876543217', '2 Guests', 'India', '123Nuehdsn', 'sdbcilsdv', '2026-07-07 15:41:22', '0'),
('19', '21', 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '7894561253', '2 Guests', 'India', '123234', 'sdf', '2026-07-07 16:17:27', '0'),
('20', '22', 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '12345678909', '2 Guests', 'India', '1234', 'wert', '2026-07-07 17:03:37', '0'),
('21', '23', 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '12345678909', '2 Guests', 'India', '1234567', '234567', '2026-07-07 17:17:25', '0'),
('22', '24', 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '789456123', '2 Guests', '', '', '', '2026-07-07 17:43:31', '0'),
('23', '25', 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '9865046554', '4 Guests', '', '', '', '2026-07-07 19:12:00', '0'),
('24', '26', 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '789456136', '3 Guests', '', '', '', '2026-07-07 19:33:01', '0'),
('25', '27', 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '9025728998', '2', 'India', 'Madurai', '', '2026-07-08 22:27:33', '0'),
('26', '28', 'BHALARAM KRISHNA', 'bhalaramsembu@gmail.com', '123457890', '2 Guests', 'India', '7/2E Selva Vinayakar Kovil Street\nNew Ramnad Rd', '12345', '2026-07-10 15:34:22', '2'),
('27', '29', 'BHALARAM KRISHNA', 'bhalaramsembu@gmail.com', '7904242107', '2 Guests', 'India', '7/2E Selva Vinayakar Kovil Street\nNew Ramnad Rd', '', '2026-07-13 15:22:20', '0'),
('28', '30', 'BHALARAM KRISHNA', 'bhalaramsembu@gmail.com', '7904242107', '2 Guests', 'India', '7/2E Selva Vinayakar Kovil Street\nNew Ramnad Rd', 'Make it Good', '2026-07-13 15:33:52', '0'),
('29', '31', 'BHALARAM KRISHNA', 'bhalaramsembu@gmail.com', '7904242107', '2 Guests', 'India', '7/2E Selva Vinayakar Kovil Street\nNew Ramnad Rd', 'Make it Good', '2026-07-13 15:42:47', '0'),
('30', '32', 'BHALARAM KRISHNA test', 'bhalaramsembu@gmail.com', '7897897899', '2 Guests', 'India', '7/2E Selva Vinayakar Kovil Street\nNew Ramnad Rddc', 'D', '2026-07-13 16:12:01', '0'),
('31', '33', 'BHALARAM KRISHNA Mail Test', 'bhalaramsembu@gmail.com', '7904242107', '2', 'India', '7/2E Selva Vinayakar Kovil Street\nNew Ramnad Rd', '', '2026-07-13 19:26:34', '0'),
('32', '34', 'BHALARAM KRISHNA', 'bhalaramsembu@gmail.com', '7904242107', '2', 'India', '7/2E Selva Vinayakar Kovil Street\nNew Ramnad Rd', '', '2026-07-13 19:29:52', '0'),
('33', '35', 'BHALARAM KRISHNA 123', 'bhalaramsembu@gmail.com', '9876543212', '2 Guests', 'India', '7/2E Selva Vinayakar Kovil Street\nNew Ramnad Rd', '', '2026-07-14 13:21:44', '0'),
('34', '36', 'BHALARAM KRISHNA', 'bhalaramsembu@gmail.com', '7904242107', '3 Guests', 'India', '7/2E Selva Vinayakar Kovil Street\nNew Ramnad Rd', '', '2026-07-14 18:05:19', '0'),
('35', '37', 'BHALARAM KRISHNA', 'bhalaramsembu@gmail.com', '7905524109', '2 Guests', '', '', '', '2026-07-14 18:09:46', '0'),
('36', '38', 'BHALARAM KRISHNA 2', 'bhalaramsembu@gmail.com', '9898767877', '2 Guests', 'India', '7/2E Selva Vinayakar Kovil Street\nNew Ramnad Rd', '', '2026-07-15 14:14:57', '0'),
('37', '39', 'BHALARAM KRISHNA for test', 'bhalaramsembu@gmail.com', '9999876545', '2 Guests', 'India', '7/2E Selva Vinayakar Kovil Street\nNew Ramnad Rd', '', '2026-07-15 14:35:11', '0'),
('38', '40', 'kirrrrr', 'bhalaramsembu@gmail.com', '9876545788', '2 Guests', 'India', '7/2E Selva Vinayakar Kovil Street\nNew Ramnad Rd', '', '2026-07-15 15:31:19', '0');

DROP TABLE IF EXISTS `booking_rooms`;
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
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `booking_rooms` (`id`, `booking_id`, `room_id`, `price_at_booking`) VALUES
('9', '23', '3', '6750.00'),
('15', '29', '35', '3349.00'),
('16', '30', '36', '3349.00'),
('17', '31', '35', '3349.00'),
('19', '33', '35', '5348.00'),
('20', '34', '35', '5348.00'),
('21', '35', '35', '5348.00'),
('22', '36', '34', '6350.00'),
('24', '38', '36', '3349.00'),
('25', '39', '34', '3850.00'),
('26', '40', '9', '6350.00'),
('27', '1', '35', '3500.00'),
('28', '3', '36', '3850.00'),
('29', '7', '3', '3850.00'),
('30', '8', '36', '3850.00'),
('31', '9', '3', '3850.00'),
('32', '10', '16', '5150.00'),
('33', '11', '9', '3850.00'),
('34', '12', '34', '3850.00'),
('35', '18', '35', '6750.00'),
('36', '20', '36', '5150.00'),
('37', '21', '16', '4050.00'),
('38', '22', '9', '6750.00'),
('39', '24', '36', '2950.00'),
('40', '25', '3', '6490.00'),
('41', '26', '35', '12980.00'),
('42', '27', '16', '21350.00'),
('43', '32', '35', '6850.00'),
('44', '37', '35', '3186.00');

DROP TABLE IF EXISTS `bookings`;
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_id` (`booking_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `bookings` (`id`, `booking_id`, `user_id`, `guest_name`, `guest_email`, `guest_phone`, `check_in_date`, `check_out_date`, `total_amount`, `status`, `payment_status`, `source`, `special_requests`, `created_at`, `booking_source`) VALUES
('1', 'HBK202606207A0C', NULL, 'Test Guest', 'test@example.com', '9999999999', '2026-06-25', '2026-06-28', '3500.00', 'confirmed', 'success', 'website', NULL, '2026-06-20 16:04:28', 'Online'),
('2', 'HBK202606254FC2', NULL, 'Bhalaram krishnna', 'bhalaramsembu@gmail.com', '7904242107', '2026-06-25', '2026-06-26', '3850.00', 'pending', 'pending', 'website', NULL, '2026-06-25 16:58:51', 'Online'),
('3', 'HBK202606268BF5', NULL, 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '7904242107', '2026-06-25', '2026-06-26', '3850.00', 'confirmed', 'success', 'website', NULL, '2026-06-26 15:07:40', 'Online'),
('4', 'HBK202606264D81', NULL, 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '1234567876543', '2026-06-25', '2026-06-26', '3850.00', 'pending', 'pending', 'website', NULL, '2026-06-26 15:19:56', 'Online'),
('5', 'HBK202606268B27', NULL, 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '76042421037', '2026-06-25', '2026-06-26', '3850.00', 'pending', 'pending', 'website', NULL, '2026-06-26 15:20:06', 'Online'),
('6', 'HBK20260626A607', NULL, 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '76042421037', '2026-06-25', '2026-06-26', '3850.00', 'pending', 'pending', 'website', NULL, '2026-06-26 15:20:16', 'Online'),
('7', 'HBK20260626802B', NULL, 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '9876543210', '2026-06-25', '2026-06-26', '3850.00', 'confirmed', 'success', 'website', NULL, '2026-06-26 17:05:24', 'Online'),
('8', 'HBK202606260084', NULL, 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '8989897656', '2026-06-26', '2026-06-27', '3850.00', 'confirmed', 'success', 'website', NULL, '2026-06-26 19:14:57', 'Online'),
('9', 'HBK20260626BF29', NULL, 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '12345434444', '2026-06-26', '2026-06-27', '3850.00', 'confirmed', 'success', 'website', NULL, '2026-06-26 19:24:12', 'Online'),
('10', 'HBK20260626C444', NULL, 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '123454321', '2026-06-26', '2026-06-27', '5150.00', 'confirmed', 'success', 'website', NULL, '2026-06-26 19:34:58', 'Online'),
('11', 'HBK202606262DF9', NULL, 'Kirtheeswaran G R M', 'bhalaramsembu@gmail.com', '7878786565', '2026-06-26', '2026-06-27', '3850.00', 'confirmed', 'success', 'website', NULL, '2026-06-26 19:38:19', 'Online'),
('12', 'HBK202606264CE0', NULL, 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '234567654321', '2026-06-26', '2026-06-27', '3850.00', 'confirmed', 'success', 'website', NULL, '2026-06-26 20:04:40', 'Online'),
('13', 'HBK20260626A450', NULL, 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '765432345', '2026-06-26', '2026-06-27', '3850.00', 'confirmed', 'success', 'website', NULL, '2026-06-26 20:05:44', 'Online'),
('14', 'HBK202606269604', NULL, 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '098765432', '2026-06-26', '2026-06-27', '3850.00', 'cancelled', 'failed', 'website', NULL, '2026-06-26 20:14:49', 'Online'),
('15', 'HBK202607071E2D', NULL, 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '78945613', '2026-07-07', '2026-07-09', '6750.00', 'pending', 'pending', 'website', NULL, '2026-07-07 13:53:42', 'Online'),
('16', 'HBK202607078F8C', NULL, 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '78945613', '2026-07-07', '2026-07-09', '6750.00', 'pending', 'pending', 'website', NULL, '2026-07-07 14:00:43', 'Online'),
('17', 'HBK2026070730FE', NULL, 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '123456789', '2026-07-07', '2026-07-09', '6750.00', 'pending', 'pending', 'website', NULL, '2026-07-07 14:15:59', 'Online'),
('18', 'HBK20260707BCBA', NULL, 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '123456789', '2026-07-07', '2026-07-09', '6750.00', 'checked-out', 'success', 'website', NULL, '2026-07-07 14:30:12', 'Online'),
('20', 'HBK202607070BE2', NULL, 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '9876543217', '2026-07-07', '2026-07-08', '5150.00', 'confirmed', 'success', 'website', 'sdbcilsdv', '2026-07-07 15:41:22', 'Online'),
('21', 'HBK20260707B4FF', NULL, 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '7894561253', '2026-07-07', '2026-07-08', '4050.00', 'confirmed', 'success', 'website', 'sdf', '2026-07-07 16:17:27', 'Online'),
('22', 'HBK20260707E459', NULL, 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '12345678909', '2026-07-07', '2026-07-09', '6750.00', 'confirmed', 'success', 'website', 'wert', '2026-07-07 17:03:37', 'Online'),
('23', 'HBK202607071590', NULL, 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '12345678909', '2026-07-07', '2026-07-09', '6750.00', 'checked-out', 'success', 'website', '234567', '2026-07-07 17:17:25', 'Online'),
('24', 'HBK202607076838', NULL, 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '789456123', '2026-07-08', '2026-07-09', '2950.00', 'confirmed', 'success', 'reception', '', '2026-07-07 17:43:31', 'Walk-in'),
('25', 'HBK20260707BABE', NULL, 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '9865046554', '2026-07-15', '2026-07-16', '6490.00', 'confirmed', 'success', 'reception', '', '2026-07-07 19:12:00', 'Walk-in'),
('26', 'HBK2026070787C9', NULL, 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '789456136', '2026-07-18', '2026-07-20', '12980.00', 'confirmed', 'success', 'reception', '', '2026-07-07 19:33:01', 'Walk-in'),
('27', 'HBK202607083620', NULL, 'Kirtheeswaran G R M', 'kirtheeswarangrm@gmail.com', '9025728998', '2026-07-08', '2026-07-16', '21350.00', 'checked-out', 'success', 'website', '', '2026-07-08 22:27:33', 'Online'),
('28', 'HBK20260710ACE7', NULL, 'BHALARAM KRISHNA', 'bhalaramsembu@gmail.com', '123457890', '2026-07-10', '2026-07-11', '3850.00', 'pending', 'pending', 'website', '12345', '2026-07-10 15:34:22', 'Online'),
('29', 'HBK202607138BEE', NULL, 'BHALARAM KRISHNA', 'bhalaramsembu@gmail.com', '7904242107', '2026-07-28', '2026-07-29', '3349.00', 'confirmed', 'success', 'website', '', '2026-07-13 15:22:20', 'Online'),
('30', 'HBK2026071337FA', NULL, 'BHALARAM KRISHNA', 'bhalaramsembu@gmail.com', '7904242107', '2026-07-28', '2026-07-29', '3349.00', 'confirmed', 'success', 'website', 'Make it Good', '2026-07-13 15:33:52', 'Online'),
('31', 'HBK20260713B92C', NULL, 'BHALARAM KRISHNA', 'bhalaramsembu@gmail.com', '7904242107', '2026-07-28', '2026-07-29', '3349.00', 'confirmed', 'success', 'website', 'Make it Good', '2026-07-13 15:42:47', 'Online'),
('32', 'HBK2026071315AB', NULL, 'BHALARAM KRISHNA test', 'bhalaramsembu@gmail.com', '7897897899', '2026-07-31', '2026-08-01', '6850.00', 'confirmed', 'success', 'website', 'D', '2026-07-13 16:12:00', 'Online'),
('33', 'HBK2026071310A8', NULL, 'BHALARAM KRISHNA Mail Test', 'bhalaramsembu@gmail.com', '7904242107', '2026-07-13', '2026-07-15', '5348.00', 'pending', 'pending', 'website', '', '2026-07-13 19:26:34', 'Online'),
('34', 'HBK202607139BCA', NULL, 'BHALARAM KRISHNA', 'bhalaramsembu@gmail.com', '7904242107', '2026-07-13', '2026-07-15', '5348.00', 'pending', 'pending', 'website', '', '2026-07-13 19:29:52', 'Online'),
('35', 'HBK202607147DE8', NULL, 'BHALARAM KRISHNA 123', 'bhalaramsembu@gmail.com', '9876543212', '2026-07-15', '2026-07-17', '5348.00', 'checked-out', 'success', 'website', '', '2026-07-14 13:21:44', 'Online'),
('36', 'HBK20260714C79B', NULL, 'BHALARAM KRISHNA', 'bhalaramsembu@gmail.com', '7904242107', '2026-07-15', '2026-07-17', '6350.00', 'checked-out', 'success', 'website', '', '2026-07-14 18:05:19', 'Online'),
('37', 'HBK202607142A3F', NULL, 'BHALARAM KRISHNA', 'bhalaramsembu@gmail.com', '7905524109', '2026-07-14', '2026-07-15', '3186.00', 'confirmed', 'success', 'reception', '', '2026-07-14 18:09:46', 'Walk-in'),
('38', 'HBK20260715AADF', NULL, 'BHALARAM KRISHNA 2', 'bhalaramsembu@gmail.com', '9898767877', '2026-07-15', '2026-07-16', '3349.00', 'checked-out', 'success', 'website', '', '2026-07-15 14:14:57', 'Online'),
('39', 'HBK202607159355', NULL, 'BHALARAM KRISHNA for test', 'bhalaramsembu@gmail.com', '9999876545', '2026-07-17', '2026-07-18', '3850.00', 'confirmed', 'success', 'website', '', '2026-07-15 14:35:11', 'Online'),
('40', 'HBK202607150CE3', NULL, 'kirrrrr', 'bhalaramsembu@gmail.com', '9876545788', '2026-07-15', '2026-07-17', '6350.00', 'checked-out', 'success', 'website', '', '2026-07-15 15:31:19', 'Online');

DROP TABLE IF EXISTS `payments`;
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
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `payments` (`id`, `booking_id`, `transaction_id`, `amount`, `payment_method`, `status`, `payment_date`) VALUES
('2', '3', 'pay_T6DGW1S53SAqaM', '3850.00', 'razorpay', 'success', '2026-06-26 15:08:12'),
('3', '7', 'pay_T6FH2OSIRHJJgX', '3850.00', 'razorpay', 'success', '2026-06-26 17:06:02'),
('4', '8', 'pay_T6HTjFC9neDAdG', '3850.00', 'razorpay', 'success', '2026-06-26 19:15:21'),
('5', '9', 'pay_T6HdZdoSjCba3m', '3850.00', 'razorpay', 'success', '2026-06-26 19:24:42'),
('6', '10', 'pay_T6HpUVt09GMQTV', '5150.00', 'razorpay', 'success', '2026-06-26 19:36:25'),
('7', '11', 'pay_T6HsLuaixWa7lx', '3850.00', 'razorpay', 'success', '2026-06-26 19:38:39'),
('8', '12', 'pay_T6IKEoBlPwbHs8', '3850.00', 'razorpay', 'success', '2026-06-26 20:05:03'),
('9', '13', 'pay_T6ILKNngAY3Yf4', '3850.00', 'razorpay', 'success', '2026-06-26 20:06:05'),
('11', '20', 'pay_sim_VQYYQLNDU', '5150.00', 'razorpay', 'success', '2026-07-07 15:41:37'),
('12', '21', 'pay_sim_BH024CXB1', '4050.00', 'razorpay', 'success', '2026-07-07 16:17:42'),
('13', '22', 'pay_TAb7dXOUpiqj91', '6750.00', 'razorpay', 'success', '2026-07-07 17:04:19'),
('14', '23', 'pay_TAbLro2jVycg1X', '6750.00', 'razorpay', 'success', '2026-07-07 17:17:48'),
('15', '18', 'TXN_MANUAL_B8EF1132', '6750.00', 'Cash', 'success', '2026-07-07 17:35:34'),
('16', '24', 'TXN_OFFLINE_D6B58E6A', '2950.00', 'upi', 'success', '2026-07-07 17:43:31'),
('17', '25', 'TXN_OFFLINE_228814A6', '6490.00', 'upi', 'success', '2026-07-07 19:12:00'),
('18', '26', 'TXN_OFFLINE_7156BE25', '12980.00', 'cash', 'success', '2026-07-07 19:33:01'),
('19', '27', 'pay_TB5AknBVFJ1eKR', '21350.00', 'razorpay', 'success', '2026-07-08 22:28:26'),
('20', '29', 'pay_TCwbkDRAjRAqur', '3349.00', 'razorpay', 'success', '2026-07-13 15:23:40'),
('21', '30', 'pay_TCwnvyIKkBBix5', '3349.00', 'razorpay', 'success', '2026-07-13 15:35:29'),
('22', '31', 'pay_TCwwYViJq4uvSB', '3349.00', 'razorpay', 'success', '2026-07-13 15:43:16'),
('23', '32', 'pay_TCxRTFM45culQD', '6850.00', 'razorpay', 'success', '2026-07-13 16:12:28'),
('24', '35', 'pay_TDJ4mYY94dPs3S', '5348.00', 'razorpay', 'success', '2026-07-14 13:22:17'),
('25', '36', 'pay_TDNuT1MJfPIOfA', '6350.00', 'razorpay', 'success', '2026-07-14 18:05:59'),
('26', '37', 'TXN_OFFLINE_E125AFC3', '3186.00', 'cash', 'success', '2026-07-14 18:09:46'),
('27', '38', 'pay_TDiXLb7p1bbjHS', '3349.00', 'razorpay', 'success', '2026-07-15 14:16:39'),
('28', '39', 'pay_TDirRcDjZQPuIb', '3850.00', 'razorpay', 'success', '2026-07-15 14:36:01'),
('29', '40', 'pay_TDjoknPZ72IF8U', '6350.00', 'razorpay', 'success', '2026-07-15 15:31:44');

DROP TABLE IF EXISTS `qr_codes`;
CREATE TABLE `qr_codes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) DEFAULT NULL,
  `qr_content` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `qr_codes_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `qr_codes` (`id`, `booking_id`, `qr_content`, `created_at`) VALUES
('1', '3', 'HBK202606268BF5', '2026-06-26 15:08:12'),
('2', '7', 'HBK20260626802B', '2026-06-26 17:06:02'),
('3', '8', 'HBK202606260084', '2026-06-26 19:15:21'),
('4', '9', 'HBK20260626BF29', '2026-06-26 19:24:42'),
('5', '10', 'HBK20260626C444', '2026-06-26 19:36:25'),
('6', '11', 'HBK202606262DF9', '2026-06-26 19:38:39'),
('7', '12', 'HBK202606264CE0', '2026-06-26 20:05:03'),
('8', '13', 'HBK20260626A450', '2026-06-26 20:06:05'),
('9', '14', 'HBK202606269604', '2026-06-26 20:15:20'),
('10', '20', 'HBK202607070BE2', '2026-07-07 15:41:37'),
('11', '21', 'HBK20260707B4FF', '2026-07-07 16:17:42'),
('12', '22', 'HBK20260707E459', '2026-07-07 17:04:19'),
('13', '23', 'HBK202607071590', '2026-07-07 17:17:48'),
('14', '27', 'HBK202607083620', '2026-07-08 22:28:26'),
('15', '29', 'HBK202607138BEE', '2026-07-13 15:23:40'),
('16', '30', 'HBK2026071337FA', '2026-07-13 15:35:29'),
('17', '31', 'HBK20260713B92C', '2026-07-13 15:43:16'),
('18', '32', 'HBK2026071315AB', '2026-07-13 16:12:28'),
('19', '35', 'HBK202607147DE8', '2026-07-14 13:22:17'),
('20', '36', 'HBK20260714C79B', '2026-07-14 18:05:59'),
('21', '38', 'HBK20260715AADF', '2026-07-15 14:16:39'),
('22', '39', 'HBK202607159355', '2026-07-15 14:36:01'),
('23', '40', 'HBK202607150CE3', '2026-07-15 15:31:44');

DROP TABLE IF EXISTS `reception_users`;
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

INSERT INTO `reception_users` (`id`, `username`, `password`, `full_name`, `email`, `created_at`) VALUES
('1', 'rec', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Subra Reception', 'rec@subraresidency.com', '2026-06-19 18:34:56'),
('2', 'receptionist', '$2y$10$qkGvNwh9XWX3jX/zb1WlW.C/ibdEaYB8r7z22wLSdSeHBvXMHjfyi', 'Receptionist Manager', 'receptionist@subra.com', '2026-06-27 15:00:56');

DROP TABLE IF EXISTS `receptionist_notifications`;
CREATE TABLE `receptionist_notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  `message` text DEFAULT NULL,
  `data` text DEFAULT NULL,
  `is_read` tinyint(4) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `receptionist_notifications` (`id`, `type`, `message`, `data`, `is_read`, `created_at`) VALUES
('1', 'QR_SCAN', 'Guest QR Scanned: Kirtheeswaran G R M (ID: HBK20260707BABE)', '{\"booking_id\":\"HBK20260707BABE\",\"scanned_at\":\"2026-07-08 10:58:51\"}', '1', '2026-07-08 14:28:51'),
('2', 'QR_SCAN', 'Guest QR Scanned: Kirtheeswaran G R M (ID: HBK202607076838)', '{\"booking_id\":\"HBK202607076838\",\"scanned_at\":\"2026-07-08 11:02:54\"}', '1', '2026-07-08 14:32:54');

DROP TABLE IF EXISTS `room_amenities`;
CREATE TABLE `room_amenities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `room_id` int(11) DEFAULT NULL,
  `amenity_name` varchar(100) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `room_amenities_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms_new` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=190 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `room_amenities` (`id`, `room_id`, `amenity_name`, `category_id`) VALUES
('174', NULL, 'WiFi', '10'),
('175', NULL, 'TV', '10'),
('176', NULL, 'Balcony', '10'),
('177', NULL, 'Rain Shower', '10'),
('178', NULL, 'Mini Fridge', '2'),
('179', NULL, 'Room Service', '2'),
('180', NULL, 'City View', '2'),
('181', NULL, 'Temple View', '2'),
('182', NULL, 'Bathtub', '2'),
('183', NULL, 'Workspace', '2'),
('184', NULL, 'High-Speed WiFi', '4'),
('185', NULL, 'Smart TV', '4'),
('186', NULL, 'Mini Fridge', '4'),
('187', NULL, 'Room Service', '4'),
('188', NULL, 'Workspace', '4'),
('189', NULL, 'Temple View', '4');

DROP TABLE IF EXISTS `room_availability`;
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
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `room_availability` (`id`, `room_id`, `date`, `status`, `note`, `updated_at`) VALUES
('1', '3', '2026-06-19', 'Booked', NULL, '2026-06-20 16:01:53'),
('6', '3', '2026-06-20', 'Booked', NULL, '2026-06-20 16:06:27'),
('23', '3', '2026-07-07', 'Booked', 'booking:HBK202607071590', '2026-07-07 17:24:51'),
('24', '3', '2026-07-08', 'Booked', 'booking:HBK202607071590', '2026-07-07 17:24:51'),
('49', '35', '2026-07-28', 'Booked', 'booking:HBK20260713B92C', '2026-07-13 15:43:16'),
('50', '36', '2026-07-28', 'Booked', 'booking:HBK2026071337FA', '2026-07-13 15:35:29'),
('53', '35', '2026-07-15', 'Booked', 'booking:HBK202607147DE8', '2026-07-14 13:22:17'),
('54', '35', '2026-07-16', 'Booked', 'booking:HBK202607147DE8', '2026-07-14 13:22:17'),
('57', '34', '2026-07-15', 'Booked', 'booking:HBK20260714C79B', '2026-07-14 18:08:08'),
('58', '34', '2026-07-16', 'Booked', 'booking:HBK20260714C79B', '2026-07-14 18:08:08'),
('60', '36', '2026-07-15', 'Booked', 'booking:HBK20260715AADF', '2026-07-15 14:16:39'),
('61', '35', '2026-07-17', 'Available', NULL, '2026-07-15 17:55:18'),
('64', '36', '2026-07-17', 'Available', NULL, '2026-07-15 17:55:21'),
('66', '9', '2026-07-17', 'Booked', 'booking:HBK202607159355', '2026-07-15 14:36:01'),
('69', '9', '2026-07-15', 'Booked', 'booking:HBK202607150CE3', '2026-07-15 15:31:44'),
('70', '9', '2026-07-16', 'Booked', 'booking:HBK202607150CE3', '2026-07-15 15:31:44'),
('73', '35', '2026-06-25', 'Booked', 'booking:HBK202606207A0C', '2026-07-15 16:36:45'),
('74', '35', '2026-06-26', 'Booked', 'booking:HBK202606207A0C', '2026-07-15 16:36:45'),
('75', '35', '2026-06-27', 'Booked', 'booking:HBK202606207A0C', '2026-07-15 16:36:45'),
('76', '36', '2026-06-25', 'Booked', 'booking:HBK202606268BF5', '2026-07-15 16:36:46'),
('77', '3', '2026-06-25', 'Booked', 'booking:HBK20260626802B', '2026-07-15 16:36:46'),
('78', '36', '2026-06-26', 'Booked', 'booking:HBK202606260084', '2026-07-15 16:36:46'),
('79', '3', '2026-06-26', 'Booked', 'booking:HBK20260626BF29', '2026-07-15 16:36:46'),
('80', '16', '2026-06-26', 'Booked', 'booking:HBK20260626C444', '2026-07-15 16:36:46'),
('81', '9', '2026-06-26', 'Booked', 'booking:HBK202606262DF9', '2026-07-15 16:36:46'),
('82', '34', '2026-06-26', 'Booked', 'booking:HBK202606264CE0', '2026-07-15 16:36:46'),
('83', '35', '2026-07-07', 'Booked', 'booking:HBK20260707BCBA', '2026-07-15 16:36:46'),
('84', '35', '2026-07-08', 'Booked', 'booking:HBK20260707BCBA', '2026-07-15 16:36:46'),
('85', '36', '2026-07-07', 'Booked', 'booking:HBK202607070BE2', '2026-07-15 16:36:46'),
('86', '16', '2026-07-07', 'Booked', 'booking:HBK20260707B4FF', '2026-07-15 16:36:46'),
('87', '9', '2026-07-07', 'Booked', 'booking:HBK20260707E459', '2026-07-15 16:36:46'),
('88', '9', '2026-07-08', 'Booked', 'booking:HBK20260707E459', '2026-07-15 16:36:46'),
('89', '36', '2026-07-08', 'Booked', 'booking:HBK202607076838', '2026-07-15 16:36:46'),
('90', '3', '2026-07-15', 'Booked', 'booking:HBK20260707BABE', '2026-07-15 16:36:46'),
('91', '35', '2026-07-18', 'Booked', 'booking:HBK2026070787C9', '2026-07-15 16:36:46'),
('92', '35', '2026-07-19', 'Booked', 'booking:HBK2026070787C9', '2026-07-15 16:36:46'),
('93', '16', '2026-07-08', 'Booked', 'booking:HBK202607083620', '2026-07-15 16:36:46'),
('94', '16', '2026-07-09', 'Booked', 'booking:HBK202607083620', '2026-07-15 16:36:46'),
('95', '16', '2026-07-10', 'Booked', 'booking:HBK202607083620', '2026-07-15 16:36:46'),
('96', '16', '2026-07-11', 'Booked', 'booking:HBK202607083620', '2026-07-15 16:36:46'),
('97', '16', '2026-07-12', 'Booked', 'booking:HBK202607083620', '2026-07-15 16:36:46'),
('98', '16', '2026-07-13', 'Booked', 'booking:HBK202607083620', '2026-07-15 16:36:46'),
('99', '16', '2026-07-14', 'Booked', 'booking:HBK202607083620', '2026-07-15 16:36:46'),
('100', '16', '2026-07-15', 'Booked', 'booking:HBK202607083620', '2026-07-15 16:36:46'),
('101', '35', '2026-07-31', 'Booked', 'booking:HBK2026071315AB', '2026-07-15 16:36:46'),
('102', '35', '2026-07-14', 'Booked', 'booking:HBK202607142A3F', '2026-07-15 16:36:46'),
('105', '34', '2026-07-17', 'Booked', 'booking:HBK202607159355', '2026-07-15 18:20:25');

DROP TABLE IF EXISTS `room_categories`;
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

INSERT INTO `room_categories` (`id`, `name`, `description`, `base_price_12h`, `base_price_24h`, `adults_count`, `children_count`, `room_size`, `amenities`, `created_at`, `featured_image`, `full_description`, `highlights`, `house_rules`, `bed_type`, `number_of_beds`, `balcony`, `air_conditioning`, `smoking_allowed`, `max_guests`, `show_on_website`, `status`, `maintenance_start`, `maintenance_end`, `sub_room_count`, `floor_number`, `category_tag`) VALUES
('2', 'TEST', '', '1500.00', '2500.00', '3', '1', '450', NULL, '2026-07-08 16:02:05', '/uploads/rooms/gallery_1783935600_3064.webp', NULL, '', NULL, 'Queen Size', '1', '1', '1', '0', '3', '1', 'Available', NULL, NULL, '2', '3', 'Premium'),
('4', 'Super Delux', '', NULL, '2700.00', '5', NULL, '550', NULL, '2026-07-08 16:02:05', '/uploads/rooms/room_1.png', 'The Super Delux room offers spacious comfort with modern amenities and elegant traditional decor.', 'Panoramic Temple View • Hand-Carved Teak Wood • Private Balcony • Rain Shower', 'No loud music. Check-out by 11 AM.', 'King Size', '1', '1', '0', '0', '3', '1', 'Available', NULL, NULL, '2', '3', 'Premium'),
('10', 'Add Room Test', '', NULL, '1999.00', '2', '2', '550', NULL, '2026-07-13 15:13:24', '/uploads/rooms/category_1783935804_2696.webp', 'The Royal Emerald Suite at Subra Residency offers an unparalleled blend of traditional elegance and modern luxury. Designed for discerning travelers, this suite features a spacious master bedroom, a private balcony overlooking the historic Kumbakonam skyline, and premium amenities including a walk-in rain shower and a dedicated workstation. Enjoy the comfort of climate control and the serenity of our soundproofed sanctuary.', '', NULL, 'Double Bed', '1', '0', '1', '0', '0', '1', 'Available', NULL, NULL, '2', '3', 'Premium');

DROP TABLE IF EXISTS `room_images`;
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

DROP TABLE IF EXISTS `room_images_new`;
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

INSERT INTO `room_images_new` (`id`, `room_id`, `image_path`, `sort_order`, `created_at`, `category_id`) VALUES
('5', '3', '/uploads/rooms/room_1.png', '0', '2026-06-20 14:13:56', '4'),
('8', '3', '/uploads/rooms/gallery_1783412853_8186.jpeg', '10', '2026-07-07 13:57:33', '4'),
('9', '3', '/uploads/rooms/gallery_1783412863_8833.png', '20', '2026-07-07 13:57:43', '4'),
('10', '3', '/uploads/rooms/gallery_1783413992_3604.png', '30', '2026-07-07 14:16:32', '4'),
('16', NULL, '/uploads/rooms/gallery_1783935600_3064.webp', '10', '2026-07-13 15:10:00', '2'),
('18', NULL, '/uploads/rooms/gallery_1784032951_2320.webp', '10', '2026-07-14 18:12:31', '10');

DROP TABLE IF EXISTS `rooms`;
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

INSERT INTO `rooms` (`id`, `room_number`, `category_id`, `status`, `floor`) VALUES
('1', '100', NULL, 'booked', '1');

DROP TABLE IF EXISTS `rooms_new`;
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

INSERT INTO `rooms_new` (`id`, `room_name`, `room_number`, `room_code`, `category_id`, `floor_number`, `base_price`, `price_12_hours`, `price_24_hours`, `weekend_price`, `festival_price`, `extra_bed_price`, `max_adults`, `max_children`, `max_guests`, `room_size`, `bed_type`, `number_of_beds`, `balcony`, `air_conditioning`, `smoking_allowed`, `short_description`, `full_description`, `highlights`, `house_rules`, `status`, `maintenance_start`, `maintenance_end`, `show_on_website`, `featured_image`, `created_at`, `updated_at`) VALUES
('3', 'Super Delux', 'SD-01', '', '4', '1', '2700.00', NULL, NULL, '3000.00', NULL, NULL, '5', '0', '3', '550', 'King Size', '1', '1', '0', '0', '', 'Welcome to our signature Royal Heritage Suite. This room is a tribute to the architectural brilliance of Kumbakonam, blending centuries-old design with 21st-century comfort. Relax on a custom-made King bed surrounded by artisanal woodwork, or enjoy a private sunset on the balcony with a view of the grand gopurams.', 'Panoramic Temple View • Hand-Carved Teak Wood • Private Balcony • Rain Shower', 'No loud music. Check-out by 11 AM.', 'Available', NULL, NULL, '1', '/uploads/rooms/room_1.png', '2026-06-20 14:13:56', '2026-07-15 13:35:20'),
('9', 'TEST', 'TS-01', NULL, '2', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', '1', '0', NULL, NULL, NULL, NULL, 'Available', NULL, NULL, '1', NULL, '2026-07-08 16:02:05', '2026-07-18 12:41:22'),
('16', 'Super Delux', 'SD-02', NULL, '4', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', '1', '0', NULL, NULL, NULL, NULL, 'Available', NULL, NULL, '1', NULL, '2026-07-08 16:02:05', '2026-07-18 12:41:22'),
('34', 'TEST', 'TS-02', NULL, '2', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', '1', '0', NULL, NULL, NULL, NULL, 'Available', NULL, NULL, '1', NULL, '2026-07-10 16:01:45', '2026-07-18 12:41:22'),
('35', 'Add Room Test', 'AR1-1', NULL, '10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', '1', '0', NULL, NULL, NULL, NULL, 'Available', NULL, NULL, '1', NULL, '2026-07-13 15:13:24', '2026-07-18 12:41:22'),
('36', 'Add Room Test', 'AR1-2', NULL, '10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', '1', '0', NULL, NULL, NULL, NULL, 'Available', NULL, NULL, '1', NULL, '2026-07-13 15:13:24', '2026-07-18 12:41:22');

DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(50) DEFAULT NULL,
  `setting_value` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `settings` (`id`, `setting_key`, `setting_value`, `updated_at`) VALUES
('1', 'site_name', 'Subra Residency', '2026-06-27 14:13:45'),
('2', 'site_email', 'contact@subraresidency.com', '2026-06-27 14:13:45'),
('3', 'site_phone', '+91 9876543210', '2026-06-27 14:13:45'),
('4', 'site_address', '123 Temple Road, Kumbakonam, Tamil Nadu', '2026-06-27 14:13:45'),
('5', 'site_description', 'A luxury stay near the heart of Kumbakonam.', '2026-06-27 14:13:45'),
('6', 'social_facebook', 'https://facebook.com/subraresidency', '2026-06-27 14:13:45'),
('7', 'social_instagram', 'https://instagram.com/subraresidency', '2026-06-27 14:13:45'),
('8', 'social_twitter', 'https://twitter.com/subraresidency', '2026-06-27 14:13:45'),
('9', 'seo_title', 'Subra Residency | Best Hotel in Kumbakonam', '2026-06-27 14:13:45'),
('10', 'seo_keywords', 'hotel, kumbakonam, residency, luxury stay, temple city', '2026-06-27 14:13:45'),
('11', 'seo_description', 'Experience the spiritual essence of Kumbakonam with a comfortable stay at Subra Residency.', '2026-06-27 14:13:45'),
('12', 'check_in_time', '12:00 PM', '2026-06-27 14:13:45'),
('13', 'check_out_time', '11:00 AM', '2026-06-27 14:13:45'),
('14', 'tax_percentage', '12', '2026-06-27 14:13:45'),
('15', 'currency_symbol', '₹', '2026-06-27 14:13:45'),
('16', 'currency_code', 'INR', '2026-06-27 14:13:45'),
('17', 'enable_online_booking', 'true', '2026-06-27 14:13:45'),
('18', 'enable_notifications', 'true', '2026-06-27 14:13:45'),
('19', 'popup_banner_image', '/uploads/banners/banner_1784032393_9866.webp', '2026-07-14 18:03:13'),
('20', 'popup_banner_enabled', 'true', '2026-07-10 16:02:46'),
('21', 'temple_section_desc', 'Kumbakonam is surrounded by some of Tamil Nadu\'s most revered temples, sacred tanks and spiritual landmarks. Guests staying at Subra Residency can easily plan temple visits from the property, as many important temples are located within a short travel distance. Discover the rich spiritual heritage of the region through these iconic destinations.', '2026-07-14 18:16:31');

DROP TABLE IF EXISTS `temples`;
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

DROP TABLE IF EXISTS `users`;
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

SET FOREIGN_KEY_CHECKS=1;
