<?php
include_once __DIR__ . '/../config/db.php';

try {
    $db = (new Database())->getConnection();
    
    // Change booking_source to VARCHAR(50) to support 'Other' (e.g. Airbnb, etc.)
    $db->exec("ALTER TABLE bookings MODIFY COLUMN booking_source VARCHAR(50) NOT NULL DEFAULT 'Online'");
    echo "Column booking_source modified to VARCHAR(50) successfully.\n";

    // Let's also check and log existing booking sources
    $stmt = $db->query("SELECT booking_source, COUNT(*) as cnt FROM bookings GROUP BY booking_source");
    print_r($stmt->fetchAll(PDO::FETCH_ASSOC));

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
