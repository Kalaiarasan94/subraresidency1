<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once __DIR__ . '/../../../config/db.php';
$db = (new Database())->getConnection();

// simple list with pagination
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

$stmt = $db->prepare("SELECT b.id, b.booking_id, b.guest_name, b.guest_email, b.check_in_date, b.check_out_date, b.total_amount, b.status, b.payment_status, b.booking_source, p.transaction_id, p.amount as paid_amount FROM bookings b LEFT JOIN payments p ON p.booking_id = b.id WHERE b.status != 'pending' ORDER BY b.created_at DESC LIMIT ? OFFSET ?");
$stmt->bindValue(1, $limit, PDO::PARAM_INT);
$stmt->bindValue(2, $offset, PDO::PARAM_INT);
$stmt->execute();
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Fetch rooms for each booking to display in the frontend Management Inventory
$room_stmt = $db->prepare("SELECT r.room_number, r.room_name FROM booking_rooms br JOIN rooms_new r ON br.room_id = r.id WHERE br.booking_id = ?");
foreach ($rows as &$row) {
    $room_stmt->execute([$row['id']]);
    $row['rooms'] = $room_stmt->fetchAll(PDO::FETCH_ASSOC);
}

echo json_encode(['status' => 'success', 'bookings' => $rows]);
?>