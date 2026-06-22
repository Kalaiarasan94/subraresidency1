<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . '/../../config/db.php';

// This endpoint can be used as both webhook (POST from Razorpay) or client-side verification
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
    exit;
}

$env = parse_ini_file(__DIR__ . '/../../.env');
$key_id = $env['RAZORPAY_KEY_ID'] ?? '';
$key_secret = $env['RAZORPAY_KEY_SECRET'] ?? '';

// Basic verification flow (client sends: razorpay_payment_id, razorpay_order_id, razorpay_signature, booking_id)
if (!empty($input['razorpay_payment_id']) && !empty($input['razorpay_order_id']) && !empty($input['razorpay_signature']) && !empty($input['booking_id'])) {
    $bookingId = $input['booking_id'];
    $paymentId = $input['razorpay_payment_id'];
    $orderId = $input['razorpay_order_id'];
    $signature = $input['razorpay_signature'];

    // Verify signature
    $data = $orderId . '|' . $paymentId;
    $expected = hash_hmac('sha256', $data, $key_secret);
    if (!hash_equals($expected, $signature)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid signature']);
        exit;
    }

    // Mark booking as paid, insert payments row, assign room, sync availability (single transactional op)
    try {
        $database = new Database();
        $db = $database->getConnection();
        $db->beginTransaction();

        // Update booking payment_status and status
        $update = $db->prepare("UPDATE bookings SET payment_status = 'success', status = 'confirmed' WHERE booking_id = ?");
        $update->execute([$bookingId]);

        // Insert into payments table (create if not exists elsewhere)
        $ins = $db->prepare("INSERT INTO payments (booking_id, transaction_id, amount, payment_method, status) VALUES ((SELECT id FROM bookings WHERE booking_id = ?), ?, ?, 'razorpay', 'success')");
        // Attempt to get amount from bookings
        $amountRow = $db->prepare("SELECT total_amount, id FROM bookings WHERE booking_id = ?");
        $amountRow->execute([$bookingId]);
        $ar = $amountRow->fetch(PDO::FETCH_ASSOC);
        $amount = $ar['total_amount'] ?? 0;
        $bookingDbId = $ar['id'] ?? null;
        $ins->execute([$bookingId, $paymentId, $amount]);

        // Assign room if not assigned yet (simple logic: pick first available)
        $roomAssign = $db->query("SELECT id FROM rooms WHERE status = 'available' LIMIT 1");
        if ($roomAssignRow = $roomAssign->fetch(PDO::FETCH_ASSOC)) {
            $room_id = $roomAssignRow['id'];
            // insert into booking_rooms
            $db->prepare("INSERT INTO booking_rooms (booking_id, room_id, price_at_booking) VALUES (?, ?, ?)")->execute([$bookingDbId, $room_id, $amount]);
            // mark room as booked
            $db->prepare("UPDATE rooms SET status = 'booked' WHERE id = ?")->execute([$room_id]);

            // Upsert room_availability for the booking dates
            $getBookingDates = $db->prepare("SELECT check_in_date, check_out_date FROM bookings WHERE id = ?");
            $getBookingDates->execute([$bookingDbId]);
            $bd = $getBookingDates->fetch(PDO::FETCH_ASSOC);
            if ($bd) {
                $startTs = strtotime($bd['check_in_date']);
                $endTs = strtotime($bd['check_out_date']);
                $upsert = $db->prepare("INSERT INTO room_availability (room_id, `date`, status, note) VALUES (?, ?, 'Booked', ?) ON DUPLICATE KEY UPDATE status = VALUES(status), note = VALUES(note)");
                for ($ts = $startTs; $ts < $endTs; $ts += 86400) {
                    $d = date('Y-m-d', $ts);
                    $note = 'booking:' . $bookingId;
                    $upsert->execute([$room_id, $d, $note]);
                }
            }
        }

        $db->commit();

        echo json_encode(['status' => 'success', 'message' => 'Payment verified and booking confirmed', 'booking_id' => $bookingId, 'payment_id' => $paymentId]);
        exit;
    } catch (Exception $e) {
        if ($db && $db->inTransaction()) $db->rollBack();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to verify payment: ' . $e->getMessage()]);
        exit;
    }
}

    // After successful processing, insert a QR record to allow scanning to retrieve booking info
    try {
        $database = new Database();
        $db2 = $database->getConnection();
        $qrIns = $db2->prepare("INSERT INTO qr_codes (booking_id, qr_content) VALUES ((SELECT id FROM bookings WHERE booking_id = ?), ?) ");
        $qrIns->execute([$bookingId ?? '', $bookingId ?? '']);
    } catch (Exception $e) {
        // non-fatal
    }

// Webhook handling: Razorpay can post events; for now accept 'payment.captured' with raw body signature header
if (!empty($_SERVER['HTTP_X_RAZORPAY_SIGNATURE'])) {
    $raw = file_get_contents('php://input');
    $sig = $_SERVER['HTTP_X_RAZORPAY_SIGNATURE'];
    // For production verify using webhook secret (not implemented here)
    // Respond with 200
    http_response_code(200);
    echo json_encode(['status' => 'ok', 'message' => 'webhook received']);
    exit;
}

http_response_code(400);
echo json_encode(['status' => 'error', 'message' => 'No recognizable verification payload']);

?>