<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once __DIR__ . '/../../../config/db.php';

$database = new Database();
$db = $database->getConnection();

try {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) throw new Exception('Invalid JSON');

    $room_id = isset($data['room_id']) ? intval($data['room_id']) : null;
    $date = isset($data['date']) ? $data['date'] : null; // YYYY-MM-DD
    $status = isset($data['status']) ? $data['status'] : null; // Available|Booked|Maintenance
    $note = isset($data['note']) ? $data['note'] : null;
    $end_date = isset($data['end_date']) ? $data['end_date'] : null; // optional range

    if (!$room_id || !$date || !$status) {
        http_response_code(400);
        echo json_encode(["success"=>false, "message"=>"room_id, date and status are required"]);
        exit();
    }

    // Normalize status
    $status = ucfirst(strtolower($status));
    $allowed = ['Available','Booked','Maintenance'];
    if (!in_array($status, $allowed)) {
        http_response_code(400);
        echo json_encode(["success"=>false, "message"=>"Invalid status"]);
        exit();
    }

    $dates = [$date];
    if ($end_date) {
        // generate dates inclusive
        $startTs = strtotime($date);
        $endTs = strtotime($end_date);
        if ($endTs < $startTs) throw new Exception('end_date must be >= date');
        $dates = [];
        for ($ts = $startTs; $ts <= $endTs; $ts += 86400) {
            $dates[] = date('Y-m-d', $ts);
        }
    }

    $db->beginTransaction();
    // If trying to set Available, ensure there is no confirmed booking overlapping any of these dates
    if ($status === 'Available') {
        $checkBookingStmt = $db->prepare("SELECT b.id FROM bookings b
            JOIN booking_rooms br ON br.booking_id = b.id
            WHERE br.room_id = ? AND b.status = 'confirmed' AND (
                b.check_in_date <= ? AND b.check_out_date > ?
            ) LIMIT 1");
        foreach ($dates as $d) {
            $checkBookingStmt->execute([$room_id, $d, $d]);
            if ($checkBookingStmt->fetch(PDO::FETCH_ASSOC)) {
                throw new Exception('Cannot mark date ' . $d . ' as Available: confirmed booking exists');
            }
        }
    }
    $upsert = $db->prepare("INSERT INTO room_availability (room_id, `date`, status, note) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE status = VALUES(status), note = VALUES(note)");
    foreach ($dates as $d) {
        $upsert->execute([$room_id, $d, $status, $note]);
    }
    $db->commit();

    echo json_encode(["success"=>true, "message"=>"Availability updated", "updated_dates"=>count($dates)]);
} catch (Exception $e) {
    if ($db->inTransaction()) $db->rollBack();
    http_response_code(500);
    echo json_encode(["success"=>false, "message"=>$e->getMessage()]);
}
?>
