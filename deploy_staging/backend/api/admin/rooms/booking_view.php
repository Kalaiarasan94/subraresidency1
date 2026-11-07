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
$stmt = $db->prepare("SELECT b.*, bd.guests, bd.country, bd.address, bd.additional_notes, bd.children, bd.extra_guest_charge, bd.extra_adults, bd.extra_children, p.transaction_id, p.amount as paid_amount, p.platform_fee as payment_platform_fee, p.gross_amount as payment_gross_amount FROM bookings b LEFT JOIN booking_details bd ON bd.booking_id = b.id LEFT JOIN payments p ON p.booking_id = b.id WHERE b.id = ? OR b.booking_id = ? LIMIT 1");
$stmt->execute([$booking_id, $booking_id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$row) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Not found']);
    exit;
}

// fetch assigned rooms with category info
$roomStmt = $db->prepare("
    SELECT 
        br.id AS booking_room_id,
        br.room_id,
        r.room_number,
        r.room_name,
        r.floor_number,
        COALESCE(rc1.name, rc2.name, r.room_name) AS category_label,
        COALESCE(rc1.id, rc2.id, r.category_id) AS resolved_category_id,
        r.base_price
    FROM booking_rooms br
    LEFT JOIN rooms_new r ON r.id = br.room_id
    LEFT JOIN room_categories rc1 ON rc1.id = r.category_id
    LEFT JOIN room_categories rc2 ON rc2.id = br.room_id
    WHERE br.booking_id = ?
");
$roomStmt->execute([$row['id']]);
$rooms = $roomStmt->fetchAll(PDO::FETCH_ASSOC);

$row['rooms'] = $rooms;
$row['phone_number'] = $row['guest_phone'] ?? '';
$row['guests_count'] = $row['guests'] ?? '2 Guests';
$row['children_count'] = intval($row['children'] ?? 0);
$row['extra_guest_charge'] = floatval($row['extra_guest_charge'] ?? 0);
$row['extra_adults'] = intval($row['extra_adults'] ?? 0);
$row['extra_children'] = intval($row['extra_children'] ?? 0);

// Human-friendly category label
$catName = 'Luxury Deluxe Room';
if (!empty($rooms[0]['category_label']) && !is_numeric($rooms[0]['category_label'])) {
    $catName = $rooms[0]['category_label'];
} elseif (!empty($rooms[0]['room_name']) && !is_numeric($rooms[0]['room_name'])) {
    $catName = $rooms[0]['room_name'];
}

$roomNum = !empty($rooms[0]['room_number']) ? $rooms[0]['room_number'] : '';
$row['room_category'] = $catName;
$row['room_number'] = $roomNum;
$row['display_room'] = $roomNum ? ($catName . ' (Room ' . $roomNum . ')') : $catName;
$row['category_id'] = $rooms[0]['resolved_category_id'] ?? null;
$row['base_price'] = $rooms[0]['base_price'] ?? null;

echo json_encode(['status' => 'success', 'booking' => $row, 'data' => $row]);
?>