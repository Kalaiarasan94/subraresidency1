<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once __DIR__ . '/../../config/db.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->booking_id)) {
    try {
        // Find booking info
        $stmt = $db->prepare("SELECT guest_name, phone, room_category, status, check_in_date, check_out_date FROM bookings WHERE booking_id = ?");
        $stmt->execute([$data->booking_id]);
        $booking = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $guest_name = $booking ? $booking['guest_name'] : 'Unknown Guest';
        $room_category = $booking ? ($booking['room_category'] ?? 'Standard Room') : 'Standard Room';
        $arrival_note = !empty($data->arrival_note) ? trim($data->arrival_note) : 'Guest arrived & approved express check-in';
        
        $query = "INSERT INTO receptionist_notifications (type, message, data) VALUES ('QR_SCAN', ?, ?)";
        $stmt = $db->prepare($query);
        $notif_data = json_encode([
            'booking_id' => $data->booking_id,
            'guest_name' => $guest_name,
            'room_category' => $room_category,
            'arrival_note' => $arrival_note,
            'scanned_at' => date('Y-m-d H:i:s')
        ]);
        $message = "Guest QR Approved: " . $guest_name . " (ID: " . $data->booking_id . ") - " . $arrival_note;
        
        if ($stmt->execute([$message, $notif_data])) {
            echo json_encode([
                "status" => "success",
                "message" => "Receptionist notified successfully",
                "booking_id" => $data->booking_id,
                "guest_name" => $guest_name
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to log notification"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Booking ID missing"]);
}
?>
