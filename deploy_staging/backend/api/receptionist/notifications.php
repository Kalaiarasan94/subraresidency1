<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Cache-Control, cache-control, Pragma, Expires, *");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once __DIR__ . '/../../config/db.php';

$database = new Database();
$db = $database->getConnection();

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

    // Auto-detect any occupied bookings / rooms and ensure notification exists
    $occStmt = $db->query("
        SELECT b.id, b.booking_id, b.guest_name, r.room_number, b.check_in_date, b.created_at
        FROM bookings b
        LEFT JOIN booking_rooms br ON br.booking_id = b.id
        LEFT JOIN rooms_new r ON r.id = br.room_id
        WHERE b.status = 'checked-in' OR r.status = 'Occupied'
        ORDER BY b.id DESC LIMIT 10
    ");
    if ($occStmt) {
        $occupiedRows = $occStmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($occupiedRows as $row) {
            $refId = $row['booking_id'] ?: ('BKG-' . $row['id']);
            $checkExisting = $db->prepare("SELECT id FROM receptionist_notifications WHERE message LIKE ?");
            $checkExisting->execute(['%' . $refId . '%']);
            if ($checkExisting->rowCount() == 0) {
                $roomNum = $row['room_number'] ? ('Room ' . $row['room_number']) : 'Assigned Suite';
                $msg = "Guest " . ($row['guest_name'] ?: 'Guest') . " occupied " . $roomNum . " (" . $refId . ")";
                $dataJson = json_encode([
                    'type' => 'ROOM_OCCUPIED',
                    'guest_name' => $row['guest_name'],
                    'room_number' => $row['room_number'],
                    'booking_id' => $refId,
                    'time' => $row['created_at'] ?: date('Y-m-d H:i:s')
                ]);
                $ins = $db->prepare("INSERT INTO receptionist_notifications (type, message, data, is_read, created_at) VALUES ('ROOM_OCCUPIED', ?, ?, 0, ?)");
                $ins->execute([$msg, $dataJson, $row['created_at'] ?: date('Y-m-d H:i:s')]);
            }
        }
    }

    // Fetch only unread notifications (so marked as read notifications disappear)
    $stmt = $db->query("SELECT * FROM receptionist_notifications WHERE is_read = 0 ORDER BY created_at DESC LIMIT 30");
    $notifs = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];

    // Count unread
    $unreadCount = count($notifs);

    echo json_encode([
        "status" => "success", 
        "notifications" => $notifs,
        "unread_count" => $unreadCount
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
