<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Cache-Control, cache-control, Pragma, Expires, *");

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
        // Ensure receptionist_notifications table exists
        $db->exec("CREATE TABLE IF NOT EXISTS receptionist_notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            type VARCHAR(50) NOT NULL,
            message TEXT,
            data JSON,
            is_read TINYINT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        // Find booking info using safe query with fallbacks
        $stmt = $db->prepare("SELECT * FROM bookings WHERE booking_id = ? OR id = ? LIMIT 1");
        $stmt->execute([$data->booking_id, $data->booking_id]);
        $booking = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$booking) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Reservation not found for ID: " . $data->booking_id]);
            exit();
        }

        $booking_id_str = !empty($booking['booking_id']) ? $booking['booking_id'] : $data->booking_id;
        $guest_name = !empty($booking['guest_name']) ? $booking['guest_name'] : (!empty($booking['name']) ? $booking['name'] : 'Guest');
        $guest_phone = !empty($booking['guest_phone']) ? $booking['guest_phone'] : (!empty($booking['phone']) ? $booking['phone'] : (!empty($booking['phone_number']) ? $booking['phone_number'] : ''));
        $arrival_note = !empty($data->arrival_note) ? trim($data->arrival_note) : 'Standing at Front Desk';

        // Resolve room category and room number
        $roomStmt = $db->prepare("
            SELECT r.room_number, r.room_name, rc.name AS category_label
            FROM booking_rooms br
            LEFT JOIN rooms_new r ON r.id = br.room_id
            LEFT JOIN room_categories rc ON rc.id = COALESCE(r.category_id, br.room_id)
            WHERE br.booking_id = ?
            LIMIT 1
        ");
        $roomStmt->execute([$booking['id']]);
        $roomInfo = $roomStmt->fetch(PDO::FETCH_ASSOC);

        $room_category = 'Reserved Suite';
        if ($roomInfo) {
            if (!empty($roomInfo['category_label'])) {
                $room_category = $roomInfo['category_label'];
            } elseif (!empty($roomInfo['room_name']) && !is_numeric($roomInfo['room_name'])) {
                $room_category = $roomInfo['room_name'];
            }
            if (!empty($roomInfo['room_number'])) {
                $room_category .= ' (Room ' . $roomInfo['room_number'] . ')';
            }
        }

        // Insert notification for front desk
        $query = "INSERT INTO receptionist_notifications (type, message, data, is_read, created_at) VALUES ('QR_SCAN', ?, ?, 0, NOW())";
        $stmt = $db->prepare($query);
        $notif_data = json_encode([
            'booking_id' => $booking_id_str,
            'guest_name' => $guest_name,
            'guest_phone' => $guest_phone,
            'room_category' => $room_category,
            'arrival_note' => $arrival_note,
            'status' => $booking['status'],
            'check_in_date' => $booking['check_in_date'],
            'check_out_date' => $booking['check_out_date'],
            'scanned_at' => date('Y-m-d H:i:s')
        ]);
        
        $message = "Guest QR Express Arrival: " . $guest_name . " (" . $booking_id_str . ") - " . $arrival_note;
        
        if ($stmt->execute([$message, $notif_data])) {
            echo json_encode([
                "status" => "success",
                "message" => "Reception alerted successfully",
                "booking_id" => $booking_id_str,
                "guest_name" => $guest_name,
                "room_category" => $room_category,
                "arrival_note" => $arrival_note
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
    echo json_encode(["status" => "error", "message" => "Booking ID is required"]);
}
?>
