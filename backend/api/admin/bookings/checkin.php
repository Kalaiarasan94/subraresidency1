<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once __DIR__ . '/../../../config/db.php';
include_once __DIR__ . '/../../../utils/Mailer.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['booking_id']) || !isset($data['room_id'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'booking_id and room_id are required']);
    exit;
}

$bookingId = $data['booking_id'];
$roomId    = $data['room_id'];

try {
    $db = (new Database())->getConnection();
    $db->beginTransaction();

    // 1. Get booking details (include guest email for voucher)
    $bookingStmt = $db->prepare("
        SELECT id, check_in_date, check_out_date, total_amount, booking_id,
               guest_name, guest_email
        FROM bookings WHERE booking_id = ?
    ");
    $bookingStmt->execute([$bookingId]);
    $booking = $bookingStmt->fetch(PDO::FETCH_ASSOC);

    if (!$booking) {
        throw new Exception("Booking not found: " . $bookingId);
    }

    $dbBookingId = $booking['id'];

    // 2. Update booking status to checked-in
    $updateStmt = $db->prepare("UPDATE bookings SET status = 'checked-in', payment_status = 'success' WHERE id = ?");
    $updateStmt->execute([$dbBookingId]);

    // 3. Upsert booking_rooms record
    $checkRoom = $db->prepare("SELECT id FROM booking_rooms WHERE booking_id = ?");
    $checkRoom->execute([$dbBookingId]);
    if ($checkRoom->rowCount() > 0) {
        $up = $db->prepare("UPDATE booking_rooms SET room_id = ? WHERE booking_id = ?");
        $up->execute([$roomId, $dbBookingId]);
    } else {
        $ins = $db->prepare("INSERT INTO booking_rooms (booking_id, room_id, price_at_booking) VALUES (?, ?, ?)");
        $ins->execute([$dbBookingId, $roomId, $booking['total_amount']]);
    }

    // 4. Update room status to Occupied in rooms_new — fetch room number for voucher
    $roomInfo = $db->prepare("SELECT room_number, room_name FROM rooms_new WHERE id = ?");
    $roomInfo->execute([$roomId]);
    $room = $roomInfo->fetch(PDO::FETCH_ASSOC);
    $roomLabel = ($room['room_name'] ?? '') . ' (Room ' . ($room['room_number'] ?? $roomId) . ')';

    $roomUp = $db->prepare("UPDATE rooms_new SET status = 'Occupied' WHERE id = ?");
    $roomUp->execute([$roomId]);

    // 5. Block the dates in room_availability table
    $startTs    = strtotime($booking['check_in_date']);
    $endTs      = strtotime($booking['check_out_date']);
    $upsertAvail = $db->prepare("INSERT INTO room_availability (room_id, `date`, status, note) VALUES (?, ?, 'Booked', ?) ON DUPLICATE KEY UPDATE status = VALUES(status), note = VALUES(note)");

    for ($ts = $startTs; $ts < $endTs; $ts += 86400) {
        $d = date('Y-m-d', $ts);
        $upsertAvail->execute([$roomId, $d, 'booking:' . $booking['booking_id']]);
    }

    // 6. Upsert payment record so settlement dashboard reflects check-in
    $payCheck = $db->prepare("SELECT id FROM payments WHERE booking_id = ?");
    $payCheck->execute([$dbBookingId]);
    if ($payCheck->rowCount() === 0) {
        $txnId   = 'TXN_CHECKIN_' . strtoupper(substr(uniqid(), -8));
        $payIns  = $db->prepare("INSERT INTO payments (booking_id, transaction_id, amount, payment_method, status) VALUES (?, ?, ?, 'Cash', 'success')");
        $payIns->execute([$dbBookingId, $txnId, $booking['total_amount']]);
    } else {
        $payUp = $db->prepare("UPDATE payments SET status = 'success' WHERE booking_id = ?");
        $payUp->execute([$dbBookingId]);
    }

    $db->commit();

    // 7. Send voucher email (after commit — non-blocking, errors don't roll back the check-in)
    $guestEmail = $booking['guest_email'] ?? '';
    if (!empty($guestEmail)) {
        try {
            Mailer::sendBookingConfirmation(
                $guestEmail,
                $booking['guest_name'],
                $booking['booking_id'],
                $booking['check_in_date'],
                $booking['check_out_date'],
                (float)$booking['total_amount'],
                $roomLabel
            );
        } catch (Exception $mailEx) {
            error_log('[Checkin Mailer] Failed to send voucher: ' . $mailEx->getMessage());
        }
    }

    echo json_encode(['status' => 'success', 'message' => 'Check-in completed successfully. Voucher email sent.']);
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>

