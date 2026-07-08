<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

header("Content-Type: application/json; charset=UTF-8");
include_once __DIR__ . '/../../../config/db.php';

try {
    $db = (new Database())->getConnection();

    // Get input (from POST json body or query param)
    $data = json_decode(file_get_contents("php://input"));
    $booking_id = $data->booking_id ?? $_GET['booking_id'] ?? null;

    if (!$booking_id) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'booking_id is required']);
        exit;
    }

    $db->beginTransaction();

    // 1. Fetch booking to check if database record exists
    $stmt = $db->prepare("SELECT id, booking_id, guest_name, guest_email, check_in_date, check_out_date, total_amount FROM bookings WHERE booking_id = ? LIMIT 1");
    $stmt->execute([$booking_id]);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$booking) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Booking not found']);
        $db->rollBack();
        exit;
    }

    $bookingDbId = $booking['id'];

    // 2. Set status to 'cancelled' in bookings
    $updateStmt = $db->prepare("UPDATE bookings SET status = 'cancelled', payment_status = 'failed' WHERE id = ?");
    $updateStmt->execute([$bookingDbId]);

    // 3. Find room assignments to clear Occupied status in rooms_new and rooms
    $roomStmt = $db->prepare("SELECT room_id FROM booking_rooms WHERE booking_id = ?");
    $roomStmt->execute([$bookingDbId]);
    $rooms = $roomStmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($rooms as $r) {
        $roomId = $r['room_id'];
        $db->prepare("UPDATE rooms_new SET status = 'Available' WHERE id = ?")->execute([$roomId]);
        $db->prepare("UPDATE rooms SET status = 'available' WHERE id = ?")->execute([$roomId]);
    }

    // 4. Release all blocked dates from room_availability
    $notePattern = 'booking:' . $booking_id;
    $db->prepare("DELETE FROM room_availability WHERE note = ?")->execute([$notePattern]);

    $db->commit();

    // 5. Notify guest by email (non-breaking)
    $emailSent = false;
    if (!empty($booking['guest_email'])) {
        try {
            $catStmt = $db->prepare("
                SELECT rc.name as room_category_name
                FROM booking_rooms br
                JOIN rooms_new r ON r.id = br.room_id
                JOIN room_categories rc ON rc.id = r.category_id
                WHERE br.booking_id = ?
                LIMIT 1
            ");
            $catStmt->execute([$bookingDbId]);
            $catRow = $catStmt->fetch(PDO::FETCH_ASSOC);
            $roomCategoryName = $catRow['room_category_name'] ?? 'Luxury Sanctuary';

            include_once __DIR__ . '/../../../utils/Mailer.php';
            $emailSent = Mailer::sendBookingCancellation(
                $booking['guest_email'],
                $booking['guest_name'],
                $booking['booking_id'],
                $booking['check_in_date'],
                $booking['check_out_date'],
                $booking['total_amount'],
                $roomCategoryName
            );
        } catch (Exception $mailEx) {
            error_log("[cancel.php] Cancellation email failed: " . $mailEx->getMessage());
        }
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Booking cancelled successfully, room availability released.',
        'email_status' => $emailSent ? 'sent' : 'failed'
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
