<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once __DIR__ . '/../../../config/db.php';

$booking_id = $_GET['booking_id'] ?? $_GET['id'] ?? null;
if (!$booking_id) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'booking_id required']);
    exit;
}

$db = (new Database())->getConnection();
$stmt = $db->prepare("SELECT b.*, bd.guests, bd.country, bd.address, bd.additional_notes, p.transaction_id, p.amount as paid_amount FROM bookings b LEFT JOIN booking_details bd ON bd.booking_id = b.id LEFT JOIN payments p ON p.booking_id = b.id WHERE b.id = ? OR b.booking_id = ? LIMIT 1");
$stmt->execute([$booking_id, $booking_id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$row) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Not found']);
    exit;
}

// fetch assigned rooms with category info
$roomStmt = $db->prepare("
    SELECT r.*, rc.name AS category_label
    FROM booking_rooms br
    JOIN rooms_new r ON r.id = br.room_id
    LEFT JOIN room_categories rc ON rc.id = r.category_id
    WHERE br.booking_id = ?
");
$roomStmt->execute([$row['id']]);
$rooms = $roomStmt->fetchAll(PDO::FETCH_ASSOC);

$row['rooms'] = $rooms;
$row['phone_number'] = $row['guest_phone'] ?? '';
$row['guests_count'] = $row['guests'] ?? '2 Guests';
$row['children_count'] = 0; // combined in guests field
// Use the category label (from room_categories) as room_category — not room_name
$row['room_category'] = isset($rooms[0]) ? ($rooms[0]['category_label'] ?: $rooms[0]['room_name']) : 'Luxury Suite';
$row['category_id'] = isset($rooms[0]) ? $rooms[0]['category_id'] : null;
$row['base_price'] = isset($rooms[0]) ? $rooms[0]['base_price'] : null;

echo json_encode(['status' => 'success', 'booking' => $row, 'data' => $row]);

?>