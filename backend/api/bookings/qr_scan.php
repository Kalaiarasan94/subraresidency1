<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../../config/db.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->booking_id)) {
    try {
        // Find booking info
        $stmt = $db->prepare("SELECT guest_name FROM bookings WHERE booking_id = ?");
        $stmt->execute([$data->booking_id]);
        $booking = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $guest_name = $booking ? $booking['guest_name'] : 'Unknown Guest';
        
        $query = "INSERT INTO receptionist_notifications (type, message, data) VALUES ('QR_SCAN', ?, ?)";
        $stmt = $db->prepare($query);
        $notif_data = json_encode(['booking_id' => $data->booking_id, 'scanned_at' => date('Y-m-d H:i:s')]);
        $message = "Guest QR Scanned: " . $guest_name . " (ID: " . $data->booking_id . ")";
        
        if ($stmt->execute([$message, $notif_data])) {
            echo json_encode(["status" => "success", "message" => "Notification sent to receptionist"]);
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
