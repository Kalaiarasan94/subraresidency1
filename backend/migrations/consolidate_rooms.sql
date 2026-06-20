-- Migration: consolidate rooms-related tables into a simplified `rooms` table
-- WARNING: Run only after taking a full DB backup.

SET FOREIGN_KEY_CHECKS=0;

-- 1) Create consolidated rooms table (will preserve many columns from rooms_new)
CREATE TABLE IF NOT EXISTS rooms (
  id INT PRIMARY KEY,
  room_number VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(150),
  room_code VARCHAR(50),
  category_id INT,
  floor_number INT,
  base_price DECIMAL(10,2),
  price_12_hours DECIMAL(10,2),
  price_24_hours DECIMAL(10,2),
  weekend_price DECIMAL(10,2),
  festival_price DECIMAL(10,2),
  extra_bed_price DECIMAL(10,2),
  max_adults INT,
  max_children INT,
  max_guests INT,
  room_size VARCHAR(50),
  bed_type VARCHAR(50),
  number_of_beds INT,
  balcony BOOLEAN DEFAULT FALSE,
  air_conditioning BOOLEAN DEFAULT TRUE,
  smoking_allowed BOOLEAN DEFAULT FALSE,
  short_description TEXT,
  full_description TEXT,
  highlights TEXT,
  house_rules TEXT,
  status ENUM('Available','Occupied','Maintenance','Inactive') DEFAULT 'Available',
  show_on_website BOOLEAN DEFAULT TRUE,
  featured_image VARCHAR(255),
  images JSON DEFAULT NULL,
  amenities JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2) Populate `rooms` from existing `rooms_new` (preserve id where possible)
-- Note: this uses GROUP_CONCAT to create simple JSON arrays for images and amenities.
INSERT INTO rooms (id, room_number, title, room_code, category_id, floor_number, base_price, price_12_hours, price_24_hours, weekend_price, festival_price, extra_bed_price, max_adults, max_children, max_guests, room_size, bed_type, number_of_beds, balcony, air_conditioning, smoking_allowed, short_description, full_description, highlights, house_rules, status, show_on_website, featured_image, images, amenities, created_at, updated_at)
SELECT
  rn.id,
  rn.room_number,
  rn.room_name,
  rn.room_code,
  rn.category_id,
  rn.floor_number,
  rn.base_price,
  rn.price_12_hours,
  rn.price_24_hours,
  rn.weekend_price,
  rn.festival_price,
  rn.extra_bed_price,
  rn.max_adults,
  rn.max_children,
  rn.max_guests,
  rn.room_size,
  rn.bed_type,
  rn.number_of_beds,
  rn.balcony,
  rn.air_conditioning,
  rn.smoking_allowed,
  rn.short_description,
  rn.full_description,
  rn.highlights,
  rn.house_rules,
  rn.status,
  rn.show_on_website,
  rn.featured_image,
  -- images JSON: build from room_images_new
  (
    SELECT CONCAT('["', REPLACE(GROUP_CONCAT(image_path ORDER BY sort_order SEPARATOR '","'), '"', '\\"'), '"]')
    FROM room_images_new ri WHERE ri.room_id = rn.id GROUP BY ri.room_id
  ) AS images_json,
  -- amenities JSON: build from room_amenities
  (
    SELECT CONCAT('["', REPLACE(GROUP_CONCAT(amenity_name SEPARATOR '","'), '"', '\\"'), '"]')
    FROM room_amenities a WHERE a.room_id = rn.id GROUP BY a.room_id
  ) AS amenities_json,
  rn.created_at,
  rn.updated_at
FROM rooms_new rn
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  room_code = VALUES(room_code),
  category_id = VALUES(category_id),
  floor_number = VALUES(floor_number),
  base_price = VALUES(base_price),
  price_12_hours = VALUES(price_12_hours),
  price_24_hours = VALUES(price_24_hours),
  weekend_price = VALUES(weekend_price),
  festival_price = VALUES(festival_price),
  extra_bed_price = VALUES(extra_bed_price),
  max_adults = VALUES(max_adults),
  max_children = VALUES(max_children),
  max_guests = VALUES(max_guests),
  room_size = VALUES(room_size),
  bed_type = VALUES(bed_type),
  number_of_beds = VALUES(number_of_beds),
  balcony = VALUES(balcony),
  air_conditioning = VALUES(air_conditioning),
  smoking_allowed = VALUES(smoking_allowed),
  short_description = VALUES(short_description),
  full_description = VALUES(full_description),
  highlights = VALUES(highlights),
  house_rules = VALUES(house_rules),
  status = VALUES(status),
  show_on_website = VALUES(show_on_website),
  featured_image = VALUES(featured_image),
  images = VALUES(images),
  amenities = VALUES(amenities),
  updated_at = VALUES(updated_at);

-- 3) Ensure auto_increment continues after max id
SET @maxid = (SELECT COALESCE(MAX(id), 0) FROM rooms);
SET @ai = @maxid + 1;
ALTER TABLE rooms AUTO_INCREMENT = @ai;

-- 4) Ensure room_availability exists and points to new `rooms` table
CREATE TABLE IF NOT EXISTS room_availability (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  `date` DATE NOT NULL,
  status ENUM('Available','Booked','Maintenance') NOT NULL DEFAULT 'Available',
  note VARCHAR(255) DEFAULT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY room_date_unique (room_id, `date`),
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS=1;

-- 5) Notes for operator:
-- After verifying the data, you may drop the old tables (rooms_new, room_images_new, room_amenities) if they are no longer needed. Keep backups.
-- Example DROP (DO NOT RUN UNTIL YOU'VE VERIFIED):
-- SET FOREIGN_KEY_CHECKS=0;
-- DROP TABLE IF EXISTS room_amenities, room_images_new, rooms_new;
-- SET FOREIGN_KEY_CHECKS=1;

-- End of migration
