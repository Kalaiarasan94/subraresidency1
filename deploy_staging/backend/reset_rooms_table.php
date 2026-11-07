<?php
require_once __DIR__.'/config/db.php';
$database = new Database();
$db = $database->getConnection();
try {
    // Disable foreign key checks
    $db->exec('SET FOREIGN_KEY_CHECKS=0');
    // Drop existing rooms table if it exists
    $db->exec('DROP TABLE IF EXISTS rooms');
    // Recreate rooms table with correct schema
    $create = "CREATE TABLE rooms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        room_number VARCHAR(10) NOT NULL UNIQUE,
        category_id INT,
        status ENUM('available','booked','occupied','maintenance','checked-in','checked-out') DEFAULT 'available',
        floor INT,
        FOREIGN KEY (category_id) REFERENCES room_categories(id) ON DELETE SET NULL
    ) ENGINE=InnoDB";
    $db->exec($create);
    // Re‑enable foreign key checks
    $db->exec('SET FOREIGN_KEY_CHECKS=1');
    echo "Rooms table reset successfully\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
