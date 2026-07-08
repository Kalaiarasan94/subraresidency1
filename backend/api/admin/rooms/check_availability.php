<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once __DIR__ . '/../../../config/db.php';

$checkin = $_GET['checkin'] ?? null;
$checkout = $_GET['checkout'] ?? null;

if (!$checkin || !$checkout) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'checkin and checkout dates are required']);
    exit;
}

try {
    $db = (new Database())->getConnection();
    
    // Find rooms in rooms_new that are status 'Available' and have no bookings/maintenance blocks during dates
    $query = "
        SELECT r.id, r.room_number, r.room_name AS category_name, r.category_id, r.base_price, r.floor_number 
        FROM rooms_new r
        WHERE r.status != 'Maintenance'
          AND r.id NOT IN (
              SELECT ra.room_id 
              FROM room_availability ra
              WHERE ra.status IN ('Booked', 'Maintenance')
                AND ra.date >= ? 
                AND ra.date < ?
          )
          AND r.id NOT IN (
              SELECT br.room_id FROM booking_rooms br
              JOIN bookings b ON b.id = br.booking_id
              WHERE b.status = 'pending'
                AND b.payment_status = 'pending'
                AND b.created_at >= NOW() - INTERVAL 15 MINUTE
                AND b.check_in_date < ? 
                AND b.check_out_date > ?
          )
        ORDER BY r.room_number ASC
    ";
    
    $stmt = $db->prepare($query);
    $stmt->execute([$checkin, $checkout, $checkout, $checkin]);
    $rooms = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(['status' => 'success', 'rooms' => $rooms]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
