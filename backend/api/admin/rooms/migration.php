<?php
// backend/api/admin/rooms/migration.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . '/../../../config/db.php';

$database = new Database();
$db = $database->getConnection();

try {
    $db->exec("
        CREATE TABLE IF NOT EXISTS rooms_new (
            id INT AUTO_INCREMENT PRIMARY KEY,
            room_name VARCHAR(100),
            room_number VARCHAR(50) NOT NULL UNIQUE,
            room_code VARCHAR(50),
            category_id INT,
            floor_number INT,
            base_price DECIMAL(10, 2),
            price_12_hours DECIMAL(10, 2),
            price_24_hours DECIMAL(10, 2),
            weekend_price DECIMAL(10, 2),
            festival_price DECIMAL(10, 2),
            extra_bed_price DECIMAL(10, 2),
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
            status ENUM('Available', 'Occupied', 'Maintenance', 'Inactive') DEFAULT 'Available',
            show_on_website BOOLEAN DEFAULT TRUE,
            featured_image VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
    ");

    $db->exec("
        CREATE TABLE IF NOT EXISTS room_images_new (
            id INT AUTO_INCREMENT PRIMARY KEY,
            room_id INT,
            image_path VARCHAR(255),
            sort_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (room_id) REFERENCES rooms_new(id) ON DELETE CASCADE
        );
    ");

    $db->exec("
        CREATE TABLE IF NOT EXISTS room_amenities (
            id INT AUTO_INCREMENT PRIMARY KEY,
            room_id INT,
            amenity_name VARCHAR(100),
            FOREIGN KEY (room_id) REFERENCES rooms_new(id) ON DELETE CASCADE
        );
    ");

    echo json_encode(["success" => true, "message" => "Migration complete"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
