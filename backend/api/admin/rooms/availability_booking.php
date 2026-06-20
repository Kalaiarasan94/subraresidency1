<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . '/../../../config/db.php';

$database = new Database();
$db = $database->getConnection();

try {
    $room_id = isset($_GET['room_id']) ? intval($_GET['room_id']) : null;
    $date = isset($_GET['date']) ? $_GET['date'] : null; // YYYY-MM-DD
    if (!$room_id || !$date) {
        http_response_code(400);
        echo json_encode(["success"=>false, "message"=>"room_id and date are required"]);
        exit();
    }

    // Find a booking that covers this date for this room
    $stmt = $db->prepare("SELECT b.id as booking_db_id, b.booking_id, b.guest_name, b.guest_email, b.guest_phone, b.check_in_date, b.check_out_date, b.status, b.source
        FROM bookings b
        JOIN booking_rooms br ON br.booking_id = b.id
        WHERE br.room_id = ? AND b.check_in_date <= ? AND b.check_out_date > ? AND b.status IN ('confirmed','checked-in','completed') LIMIT 1");
    $stmt->execute([$room_id, $date, $date]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row) {
        echo json_encode(["success"=>true, "booking" => $row]);
    } else {
        // No booking; check if there's a manual availability note
        $avail = $db->prepare("SELECT status, note FROM room_availability WHERE room_id = ? AND `date` = ? LIMIT 1");
        $avail->execute([$room_id, $date]);
        $a = $avail->fetch(PDO::FETCH_ASSOC);
        if ($a) {
            echo json_encode(["success"=>true, "booking" => null, "availability" => $a]);
        } else {
            echo json_encode(["success"=>true, "booking" => null, "availability" => null]);
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success"=>false, "message"=>$e->getMessage()]);
}

?>
