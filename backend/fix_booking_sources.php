<?php
// backend/fix_booking_sources.php
include 'config/db.php';

try {
    $db = (new Database())->getConnection();
    
    // Update booking_source from Manual to Walk-in
    $stmt = $db->prepare("UPDATE bookings SET booking_source = 'Walk-in' WHERE booking_source = 'Manual'");
    $stmt->execute();
    $rowsAffected1 = $stmt->rowCount();
    
    // Update source from manual or reception to walk-in/receptionist
    $stmt2 = $db->prepare("UPDATE bookings SET source = 'reception' WHERE source = 'manual'");
    $stmt2->execute();
    $rowsAffected2 = $stmt2->rowCount();
    
    echo json_encode([
        "status" => "success",
        "message" => "Cleaned up booking sources.",
        "booking_source_updated" => $rowsAffected1,
        "source_updated" => $rowsAffected2
    ]);
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
