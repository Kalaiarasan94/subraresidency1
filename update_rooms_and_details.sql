-- ============================================================================
-- SUBRA RESIDENCY - ROOM CATEGORIES, DETAILS, IMAGES & PRICING UPDATE
-- ============================================================================
-- Structure:
-- 1. Deluxe: ₹1,600 / 24h (₹1,000 / 12h)
-- 2. Super Deluxe (Executive 1 Bedroom Family Suite with Balcony): ₹2,600 / 24h (₹1,600 / 12h)
-- 3. Suite (Executive 2 Bedroom Apartment): ₹3,600 / 24h (₹2,200 / 12h)
--
-- Images Order for all rooms:
-- 1. Room Images (1, 2, 3...)
-- 2. Properties Views (1 to 6)
-- 3. Facilities (1, 2)
-- 4. Dining (1, 2, 3)
--
-- Folders: saved under /uploads/room_details/<Category>/...
-- Note: Breakfast & Parking are strictly excluded per owner instructions.
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Clean existing room categories, subrooms, amenities and gallery links
DELETE FROM `room_images_new`;
ALTER TABLE `room_images_new` AUTO_INCREMENT = 1;

DELETE FROM `room_amenities`;
ALTER TABLE `room_amenities` AUTO_INCREMENT = 1;

DELETE FROM `rooms_new`;
ALTER TABLE `rooms_new` AUTO_INCREMENT = 1;

DELETE FROM `room_categories`;
ALTER TABLE `room_categories` AUTO_INCREMENT = 1;

-- Also clean legacy tables if present
DELETE FROM `room_images`;
ALTER TABLE `room_images` AUTO_INCREMENT = 1;

DELETE FROM `rooms`;
ALTER TABLE `rooms` AUTO_INCREMENT = 1;

-- 2. Insert the 3 Official Room Categories matching the folder names
INSERT INTO `room_categories` (
  `id`, `name`, `description`, `base_price_12h`, `base_price_24h`,
  `adults_count`, `children_count`, `max_guests`, `room_size`, `amenities`,
  `featured_image`, `full_description`, `highlights`, `house_rules`,
  `bed_type`, `number_of_beds`, `balcony`, `air_conditioning`, `smoking_allowed`,
  `show_on_website`, `status`, `sub_room_count`, `floor_number`, `category_tag`
) VALUES
(
  1,
  'Deluxe',
  'A comfortable and thoughtfully arranged air-conditioned room for a calm, restful stay. Ideal for up to 2 guests.',
  1000.00,
  1600.00,
  2,
  1,
  3,
  '240',
  '["Air Conditioning", "High-Speed Free Wi-Fi", "42-inch Smart TV", "Attached Modern Bathroom", "24/7 Hot Water", "Daily Housekeeping", "Room Service", "Electric Kettle / Coffee Maker", "Wardrobe", "Work Desk"]',
  '/uploads/room_details/Deluxe/1.webp',
  'Designed for pilgrims and leisure travelers, the Deluxe Room at Subra Residency offers a peaceful sanctuary in the heart of Kumbakonam. Enjoy premium bedding, climate control air conditioning, modern attached bathroom with 24/7 hot water, high-speed Wi-Fi, smart LED TV, and attentive room service.',
  'Climate Controlled AC • High-Speed Wi-Fi • 24/7 Hot Water • Daily Housekeeping • Smart TV',
  'Check-in from 12:00 PM. Check-out by 11:00 AM. No smoking. No loud music.',
  'Queen Size Bed',
  1,
  0,
  1,
  0,
  1,
  'Available',
  5,
  '1',
  'Deluxe AC'
),
(
  2,
  'Super Deluxe',
  'A spacious 1 BHK-style suite featuring a private balcony with town views, separate living area, and premium conveniences.',
  1600.00,
  2600.00,
  3,
  1,
  4,
  '420',
  '["Private Balcony", "1 BHK Living Area", "Air Conditioning", "High-Speed Free Wi-Fi", "43-inch Smart TV", "Attached Modern Bathroom", "24/7 Hot Water", "Mini Refrigerator", "Electric Kettle", "Daily Housekeeping", "Room Service", "Workstation & Sofa Seating"]',
  '/uploads/room_details/Super_Deluxe/1.webp',
  'The Super Deluxe Suite (Executive 1 Bedroom Family Suite with Balcony) offers generous living space and refined comfort in Kumbakonam. Step out onto your private balcony to soak in morning temple town views. Complete with a master bedroom, inviting living zone, air conditioning, luxury bath fittings, and smart entertainment, this suite is the quintessential choice for families and devotees seeking extra privacy, comfort, and space.',
  'Private Balcony with Town View • 1 BHK Layout with Living Area • Climate Control AC • High-Speed Wi-Fi • Rain Shower',
  'Check-in from 12:00 PM. Check-out by 11:00 AM. No smoking. No loud music.',
  'King Size Bed + Extra Bed',
  2,
  1,
  1,
  0,
  1,
  'Available',
  5,
  '2',
  'Executive 1 BHK with Balcony'
),
(
  3,
  'Suite',
  'A lavish 2 BHK apartment suite with two private master bedrooms, spacious living hall, dining space, and panoramic views.',
  2200.00,
  3600.00,
  5,
  2,
  6,
  '650',
  '["2 Independent Master Bedrooms", "2 BHK Apartment Layout", "Private Balconies", "Air Conditioning", "High-Speed Free Wi-Fi", "55-inch Smart TV", "Spacious Living Hall", "Dining Table & Seating", "2 Attached Modern Bathrooms", "24/7 Hot Water", "Mini Refrigerator", "Electric Kettle & Tea Station", "Daily Housekeeping", "Room Service", "Dedicated Work Desk"]',
  '/uploads/room_details/Suite/1.webp',
  'The Suite Room (Executive 2 Bedroom Apartment) is the premier luxury accommodation at Subra Residency, tailored for large families, group pilgrimages, and extended holidays. Featuring two expansive master bedrooms with plush King bedding, an independent central living hall, private balcony, and en-suite contemporary bathrooms. Revel in residential luxury, superior privacy, and premium amenities just moments away from Kumbakonam\'s sacred heritage and famous temples.',
  '2 BHK Apartment Layout • 2 Independent Master Bedrooms • Expansive Living Hall • Private Balconies • Luxury Rain Showers',
  'Check-in from 12:00 PM. Check-out by 11:00 AM. No smoking. No loud music.',
  '2 King Size Beds',
  2,
  1,
  1,
  0,
  1,
  'Available',
  3,
  '3',
  'Executive 2 BHK Apartment'
);

-- 3. Insert Gallery Images into room_images_new
-- EXACT ORDER: Room images (1, 2, 3...) -> Properties Views -> Facilities -> Dining
INSERT INTO `room_images_new` (`category_id`, `image_path`, `sort_order`) VALUES
-- Category 1: Deluxe (Room images: 1, 2)
(1, '/uploads/room_details/Deluxe/1.webp', 1),
(1, '/uploads/room_details/Deluxe/2.jpeg', 2),
-- Followed by Properties Views (1 to 6)
(1, '/uploads/room_details/Properties_Views/1.webp', 10),
(1, '/uploads/room_details/Properties_Views/2.jpeg', 20),
(1, '/uploads/room_details/Properties_Views/3.jpeg', 30),
(1, '/uploads/room_details/Properties_Views/4.jpeg', 40),
(1, '/uploads/room_details/Properties_Views/5.webp', 50),
(1, '/uploads/room_details/Properties_Views/6.webp', 60),
-- Followed by Facilities (1, 2)
(1, '/uploads/room_details/Facilities/1.jpeg', 70),
(1, '/uploads/room_details/Facilities/2.jpeg', 80),
-- Followed by Dining (1, 2, 3)
(1, '/uploads/room_details/Dining/1.jpg', 90),
(1, '/uploads/room_details/Dining/2.jpeg', 100),
(1, '/uploads/room_details/Dining/3.jpeg', 110),

-- Category 2: Super Deluxe (Room images: 1, 2, 3, 4, 5)
(2, '/uploads/room_details/Super_Deluxe/1.webp', 1),
(2, '/uploads/room_details/Super_Deluxe/2.webp', 2),
(2, '/uploads/room_details/Super_Deluxe/3.jpeg', 3),
(2, '/uploads/room_details/Super_Deluxe/4.jpeg', 4),
(2, '/uploads/room_details/Super_Deluxe/5.jpeg', 5),
-- Followed by Properties Views (1 to 6)
(2, '/uploads/room_details/Properties_Views/1.webp', 10),
(2, '/uploads/room_details/Properties_Views/2.jpeg', 20),
(2, '/uploads/room_details/Properties_Views/3.jpeg', 30),
(2, '/uploads/room_details/Properties_Views/4.jpeg', 40),
(2, '/uploads/room_details/Properties_Views/5.webp', 50),
(2, '/uploads/room_details/Properties_Views/6.webp', 60),
-- Followed by Facilities (1, 2)
(2, '/uploads/room_details/Facilities/1.jpeg', 70),
(2, '/uploads/room_details/Facilities/2.jpeg', 80),
-- Followed by Dining (1, 2, 3)
(2, '/uploads/room_details/Dining/1.jpg', 90),
(2, '/uploads/room_details/Dining/2.jpeg', 100),
(2, '/uploads/room_details/Dining/3.jpeg', 110),

-- Category 3: Suite (Room images: 1, 2, 3, 4, 5, 6)
(3, '/uploads/room_details/Suite/1.webp', 1),
(3, '/uploads/room_details/Suite/2.webp', 2),
(3, '/uploads/room_details/Suite/3.jpeg', 3),
(3, '/uploads/room_details/Suite/4.jpeg', 4),
(3, '/uploads/room_details/Suite/5.jpeg', 5),
(3, '/uploads/room_details/Suite/6.webp', 6),
-- Followed by Properties Views (1 to 6)
(3, '/uploads/room_details/Properties_Views/1.webp', 10),
(3, '/uploads/room_details/Properties_Views/2.jpeg', 20),
(3, '/uploads/room_details/Properties_Views/3.jpeg', 30),
(3, '/uploads/room_details/Properties_Views/4.jpeg', 40),
(3, '/uploads/room_details/Properties_Views/5.webp', 50),
(3, '/uploads/room_details/Properties_Views/6.webp', 60),
-- Followed by Facilities (1, 2)
(3, '/uploads/room_details/Facilities/1.jpeg', 70),
(3, '/uploads/room_details/Facilities/2.jpeg', 80),
-- Followed by Dining (1, 2, 3)
(3, '/uploads/room_details/Dining/1.jpg', 90),
(3, '/uploads/room_details/Dining/2.jpeg', 100),
(3, '/uploads/room_details/Dining/3.jpeg', 110);

-- 4. Insert Room Amenities (Strictly NO Breakfast, NO Parking)
INSERT INTO `room_amenities` (`category_id`, `amenity_name`) VALUES
-- Deluxe (Category 1)
(1, 'Air Conditioning'),
(1, 'High-Speed Free Wi-Fi'),
(1, '42-inch Smart TV'),
(1, 'Attached Modern Bathroom'),
(1, '24/7 Hot Water'),
(1, 'Daily Housekeeping'),
(1, 'Room Service'),
(1, 'Electric Kettle / Coffee Maker'),
(1, 'Wardrobe'),
(1, 'Work Desk'),

-- Super Deluxe (Category 2)
(2, 'Private Balcony'),
(2, '1 BHK Living Area'),
(2, 'Air Conditioning'),
(2, 'High-Speed Free Wi-Fi'),
(2, '43-inch Smart TV'),
(2, 'Attached Modern Bathroom'),
(2, '24/7 Hot Water'),
(2, 'Mini Refrigerator'),
(2, 'Electric Kettle'),
(2, 'Daily Housekeeping'),
(2, 'Room Service'),
(2, 'Workstation & Sofa Seating'),

-- Suite (Category 3)
(3, '2 Independent Master Bedrooms'),
(3, '2 BHK Apartment Layout'),
(3, 'Private Balconies'),
(3, 'Air Conditioning'),
(3, 'High-Speed Free Wi-Fi'),
(3, '55-inch Smart TV'),
(3, 'Spacious Living Hall'),
(3, 'Dining Table & Seating'),
(3, '2 Attached Modern Bathrooms'),
(3, '24/7 Hot Water'),
(3, 'Mini Refrigerator'),
(3, 'Electric Kettle & Tea Station'),
(3, 'Daily Housekeeping'),
(3, 'Room Service'),
(3, 'Dedicated Work Desk');

-- 5. Insert Individual Sub-Rooms into rooms_new
INSERT INTO `rooms_new` (
  `id`, `room_name`, `room_number`, `room_code`, `category_id`,
  `floor_number`, `base_price`, `price_12_hours`, `price_24_hours`,
  `max_adults`, `max_children`, `max_guests`, `room_size`, `bed_type`,
  `number_of_beds`, `balcony`, `air_conditioning`, `smoking_allowed`,
  `short_description`, `full_description`, `highlights`, `house_rules`,
  `status`, `show_on_website`, `featured_image`
) VALUES
-- Deluxe Subrooms
(1, 'Deluxe', '101', 'DEL-101', 1, 1, 1600.00, 1000.00, 1600.00, 2, 1, 3, '240', 'Queen Size Bed', 1, 0, 1, 0, 'Deluxe room on Floor 1', 'Peaceful Deluxe Room with air conditioning and modern comforts.', 'AC • Free Wi-Fi • 24/7 Hot Water', 'Check-out by 11 AM', 'Available', 1, '/uploads/room_details/Deluxe/1.webp'),
(2, 'Deluxe', '102', 'DEL-102', 1, 1, 1600.00, 1000.00, 1600.00, 2, 1, 3, '240', 'Queen Size Bed', 1, 0, 1, 0, 'Deluxe room on Floor 1', 'Peaceful Deluxe Room with air conditioning and modern comforts.', 'AC • Free Wi-Fi • 24/7 Hot Water', 'Check-out by 11 AM', 'Available', 1, '/uploads/room_details/Deluxe/1.webp'),
(3, 'Deluxe', '201', 'DEL-201', 1, 2, 1600.00, 1000.00, 1600.00, 2, 1, 3, '240', 'Queen Size Bed', 1, 0, 1, 0, 'Deluxe room on Floor 2', 'Peaceful Deluxe Room with air conditioning and modern comforts.', 'AC • Free Wi-Fi • 24/7 Hot Water', 'Check-out by 11 AM', 'Available', 1, '/uploads/room_details/Deluxe/1.webp'),
(4, 'Deluxe', '202', 'DEL-202', 1, 2, 1600.00, 1000.00, 1600.00, 2, 1, 3, '240', 'Queen Size Bed', 1, 0, 1, 0, 'Deluxe room on Floor 2', 'Peaceful Deluxe Room with air conditioning and modern comforts.', 'AC • Free Wi-Fi • 24/7 Hot Water', 'Check-out by 11 AM', 'Available', 1, '/uploads/room_details/Deluxe/1.webp'),
(5, 'Deluxe', '301', 'DEL-301', 1, 3, 1600.00, 1000.00, 1600.00, 2, 1, 3, '240', 'Queen Size Bed', 1, 0, 1, 0, 'Deluxe room on Floor 3', 'Peaceful Deluxe Room with air conditioning and modern comforts.', 'AC • Free Wi-Fi • 24/7 Hot Water', 'Check-out by 11 AM', 'Available', 1, '/uploads/room_details/Deluxe/1.webp'),

-- Super Deluxe Subrooms
(6, 'Super Deluxe', '203', 'SD-203', 2, 2, 2600.00, 1600.00, 2600.00, 3, 1, 4, '420', 'King Size Bed + Extra Bed', 2, 1, 1, 0, 'Executive 1 BHK with balcony on Floor 2', 'Spacious family suite with private balcony and living zone.', 'Private Balcony • 1 BHK • Free Wi-Fi', 'Check-out by 11 AM', 'Available', 1, '/uploads/room_details/Super_Deluxe/1.webp'),
(7, 'Super Deluxe', '204', 'SD-204', 2, 2, 2600.00, 1600.00, 2600.00, 3, 1, 4, '420', 'King Size Bed + Extra Bed', 2, 1, 1, 0, 'Executive 1 BHK with balcony on Floor 2', 'Spacious family suite with private balcony and living zone.', 'Private Balcony • 1 BHK • Free Wi-Fi', 'Check-out by 11 AM', 'Available', 1, '/uploads/room_details/Super_Deluxe/1.webp'),
(8, 'Super Deluxe', '302', 'SD-302', 2, 3, 2600.00, 1600.00, 2600.00, 3, 1, 4, '420', 'King Size Bed + Extra Bed', 2, 1, 1, 0, 'Executive 1 BHK with balcony on Floor 3', 'Spacious family suite with private balcony and living zone.', 'Private Balcony • 1 BHK • Free Wi-Fi', 'Check-out by 11 AM', 'Available', 1, '/uploads/room_details/Super_Deluxe/1.webp'),
(9, 'Super Deluxe', '303', 'SD-303', 2, 3, 2600.00, 1600.00, 2600.00, 3, 1, 4, '420', 'King Size Bed + Extra Bed', 2, 1, 1, 0, 'Executive 1 BHK with balcony on Floor 3', 'Spacious family suite with private balcony and living zone.', 'Private Balcony • 1 BHK • Free Wi-Fi', 'Check-out by 11 AM', 'Available', 1, '/uploads/room_details/Super_Deluxe/1.webp'),
(10, 'Super Deluxe', '304', 'SD-304', 2, 3, 2600.00, 1600.00, 2600.00, 3, 1, 4, '420', 'King Size Bed + Extra Bed', 2, 1, 1, 0, 'Executive 1 BHK with balcony on Floor 3', 'Spacious family suite with private balcony and living zone.', 'Private Balcony • 1 BHK • Free Wi-Fi', 'Check-out by 11 AM', 'Available', 1, '/uploads/room_details/Super_Deluxe/1.webp'),

-- Suite Subrooms
(11, 'Suite', '401', 'ST-401', 3, 4, 3600.00, 2200.00, 3600.00, 5, 2, 6, '650', '2 King Size Beds', 2, 1, 1, 0, 'Executive 2 BHK Apartment on Floor 4', 'Grand 2 BHK apartment suite with 2 master bedrooms and huge living room.', '2 Bedrooms • 2 Bathrooms • Large Hall • Balcony', 'Check-out by 11 AM', 'Available', 1, '/uploads/room_details/Suite/1.webp'),
(12, 'Suite', '402', 'ST-402', 3, 4, 3600.00, 2200.00, 3600.00, 5, 2, 6, '650', '2 King Size Beds', 2, 1, 1, 0, 'Executive 2 BHK Apartment on Floor 4', 'Grand 2 BHK apartment suite with 2 master bedrooms and huge living room.', '2 Bedrooms • 2 Bathrooms • Large Hall • Balcony', 'Check-out by 11 AM', 'Available', 1, '/uploads/room_details/Suite/1.webp'),
(13, 'Suite', '501', 'ST-501', 3, 5, 3600.00, 2200.00, 3600.00, 5, 2, 6, '650', '2 King Size Beds', 2, 1, 1, 0, 'Executive 2 BHK Apartment on Floor 5', 'Grand 2 BHK apartment suite with 2 master bedrooms and huge living room.', '2 Bedrooms • 2 Bathrooms • Large Hall • Balcony', 'Check-out by 11 AM', 'Available', 1, '/uploads/room_details/Suite/1.webp');

-- Also populate legacy rooms table for backward compatibility
INSERT INTO `rooms` (`id`, `room_number`, `category_id`, `status`) VALUES
(1, '101', 1, 'available'),
(2, '102', 1, 'available'),
(3, '201', 1, 'available'),
(4, '202', 1, 'available'),
(5, '301', 1, 'available'),
(6, '203', 2, 'available'),
(7, '204', 2, 'available'),
(8, '302', 2, 'available'),
(9, '303', 2, 'available'),
(10, '304', 2, 'available'),
(11, '401', 3, 'available'),
(12, '402', 3, 'available'),
(13, '501', 3, 'available');

-- 6. Multi-User Isolated Cart Tables
CREATE TABLE IF NOT EXISTS `carts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `session_id` VARCHAR(128) NOT NULL,
  `user_id` INT NULL,
  `status` ENUM('active', 'converted', 'abandoned') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uniq_session` (`session_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `cart_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  `room_id` INT NULL,
  `room_number` VARCHAR(50) NULL,
  `room_name` VARCHAR(150) NULL,
  `check_in` DATE NOT NULL,
  `check_out` DATE NOT NULL,
  `guests` INT DEFAULT 2,
  `adults` INT DEFAULT 2,
  `children` INT DEFAULT 0,
  `price_per_night` DECIMAL(10,2) NOT NULL,
  `total_price` DECIMAL(10,2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_cart` (`cart_id`),
  KEY `idx_category` (`category_id`),
  KEY `idx_room` (`room_id`),
  KEY `idx_dates` (`check_in`, `check_out`),
  CONSTRAINT `fk_cart_items_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- Room categories, subrooms, gallery photos, and pricing updated successfully.
-- ============================================================================
