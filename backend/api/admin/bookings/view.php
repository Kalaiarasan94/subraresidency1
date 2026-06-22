<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once __DIR__ . '/../../../config/db.php';
$db = (new Database())->getConnection();
$booking_id = $_GET['booking_id'] ?? null;
if (!$booking_id) { http_response_code(400); echo json_encode(['status'=>'error','message'=>'booking_id required']); exit; }
$stmt = $db->prepare("SELECT b.*, bd.*, p.transaction_id, p.amount as paid_amount FROM bookings b LEFT JOIN booking_details bd ON bd.booking_id = b.id LEFT JOIN payments p ON p.booking_id = b.id WHERE b.booking_id = ? LIMIT 1");
$stmt->execute([$booking_id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$row) { http_response_code(404); echo json_encode(['status'=>'error','message'=>'not found']); exit; }
$roomStmt = $db->prepare("SELECT r.* FROM booking_rooms br JOIN rooms r ON r.id = br.room_id WHERE br.booking_id = ?");
$roomStmt->execute([$row['id']]);
$rooms = $roomStmt->fetchAll(PDO::FETCH_ASSOC);
$row['rooms']=$rooms;
echo json_encode(['status'=>'success','booking'=>$row]);
?>