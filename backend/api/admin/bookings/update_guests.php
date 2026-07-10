<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

header("Content-Type: application/json; charset=UTF-8");
include_once __DIR__ . '/../../../config/db.php';

try {
    $db = (new Database())->getConnection();

    // Ensure the children column exists in the booking_details table
    try {
        $db->exec("ALTER TABLE booking_details ADD COLUMN children INT DEFAULT 0");
    } catch (PDOException $colEx) {
        // Column may already exist, ignore error
    }

    $data = json_decode(file_get_contents("php://input"));
    $booking_id = $data->booking_id ?? null;
    $guests = $data->guests ?? null;
    $children = isset($data->children) ? intval($data->children) : 0;

    if (!$booking_id || $guests === null) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'booking_id and guests are required']);
        exit;
    }

    $db->beginTransaction();

    // Fetch booking to make sure it exists
    $stmt = $db->prepare("SELECT id FROM bookings WHERE booking_id = ? LIMIT 1");
    $stmt->execute([$booking_id]);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$booking) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Booking not found']);
        $db->rollBack();
        exit;
    }

    $bookingDbId = $booking['id'];

    // Update booking_details table (or insert if details row doesn't exist for some reason)
    $checkStmt = $db->prepare("SELECT id FROM booking_details WHERE booking_id = ? LIMIT 1");
    $checkStmt->execute([$bookingDbId]);
    $details = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if ($details) {
        $updateStmt = $db->prepare("UPDATE booking_details SET guests = ?, children = ? WHERE booking_id = ?");
        $updateStmt->execute([$guests, $children, $bookingDbId]);
    } else {
        // Fallback: if details don't exist, create them
        $insertStmt = $db->prepare("INSERT INTO booking_details (booking_id, guests, children) VALUES (?, ?, ?)");
        $insertStmt->execute([$bookingDbId, $guests, $children]);
    }

    $db->commit();

    echo json_encode([
        'status' => 'success',
        'message' => 'Guest details updated successfully.'
    ]);

} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>
