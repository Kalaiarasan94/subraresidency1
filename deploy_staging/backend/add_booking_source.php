<?php
include_once 'config/db.php';
$database = new Database();
$db = $database->getConnection();

try {
    $db->exec("ALTER TABLE bookings ADD COLUMN booking_source ENUM('Online', 'Walk-in', 'Manual') DEFAULT 'Online'");
    echo "Column 'booking_source' added successfully.\n";
} catch (Exception $e) {
    echo "Error or column already exists: " . $e->getMessage() . "\n";
}
?>
