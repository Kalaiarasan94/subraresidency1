<?php
// backend/api/payments/verify.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Disable error display to prevent breaking JSON output
ini_set('display_errors', 0);
error_reporting(E_ALL);

function log_error($message) {
    $log_file = __DIR__ . '/../../logs/payment.log';
    if (!file_exists(dirname($log_file))) {
        mkdir(dirname($log_file), 0777, true);
    }
    error_log("[" . date('Y-m-d H:i:s') . "] " . $message . "\n", 3, $log_file);
}

include_once __DIR__ . '/../../config/db.php';

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    log_error("Invalid input: " . file_get_contents('php://input'));
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid input data']);
    exit;
}

log_error("Verification request for booking: " . ($input['booking_id'] ?? 'unknown'));

$env_path = __DIR__ . '/../../.env';
if (!file_exists($env_path)) {
    log_error(".env file missing at $env_path");
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Configuration error']);
    exit;
}

$env = parse_ini_file($env_path);
$key_id = $env['RAZORPAY_KEY_ID'] ?? '';
$key_secret = $env['RAZORPAY_KEY_SECRET'] ?? '';

if (empty($key_secret)) {
    log_error("RAZORPAY_KEY_SECRET missing in .env");
}

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
        log_error("Signature mismatch for booking $bookingId. Expected: $expected, Got: $signature");
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Payment signature verification failed. Please contact support.']);
        exit;
    }

    try {
        $database = new Database();
        $db = $database->getConnection();
        $db->beginTransaction();

        // 1. Get Booking details first
        $bookingStmt = $db->prepare("SELECT id, total_amount, check_in_date, check_out_date, guest_name, guest_email FROM bookings WHERE booking_id = ?");
        $bookingStmt->execute([$bookingId]);
        $booking = $bookingStmt->fetch(PDO::FETCH_ASSOC);

        if (!$booking) {
            throw new Exception("Booking ID $bookingId not found in database");
        }

        $bookingDbId = $booking['id'];
        $amount = $booking['total_amount'];

        // 2. Update booking status
        $update = $db->prepare("UPDATE bookings SET payment_status = 'success', status = 'confirmed' WHERE id = ?");
        $update->execute([$bookingDbId]);

        // 3. Insert into payments table
        $ins = $db->prepare("INSERT INTO payments (booking_id, transaction_id, amount, payment_method, status) VALUES (?, ?, ?, 'razorpay', 'success')");
        $ins->execute([$bookingDbId, $paymentId, $amount]);

        // 4. Handle Room Assignment if not already done
        $checkRoom = $db->prepare("SELECT room_id FROM booking_rooms WHERE booking_id = ?");
        $checkRoom->execute([$bookingDbId]);
        $assignedRoom = $checkRoom->fetch(PDO::FETCH_ASSOC);

        $room_id = null;
        if ($assignedRoom) {
            $room_id = $assignedRoom['room_id'];
            
            // Double check if assigned room is still available for these dates!
            $checkAvail = $db->prepare("
                SELECT id FROM room_availability 
                WHERE room_id = ? AND status IN ('Booked', 'Maintenance') 
                AND date >= ? AND date < ?
            ");
            $checkAvail->execute([$room_id, $booking['check_in_date'], $booking['check_out_date']]);
            if ($checkAvail->rowCount() > 0) {
                // Already booked! Reassign to another room inside rooms_new for this category
                $catStmt = $db->prepare("SELECT category_id FROM rooms_new WHERE id = ?");
                $catStmt->execute([$room_id]);
                $catRow = $catStmt->fetch(PDO::FETCH_ASSOC);
                $category_id = $catRow ? $catRow['category_id'] : null;
                
                if ($category_id) {
                    $availStmt = $db->prepare("
                        SELECT r.id FROM rooms_new r
                        WHERE r.category_id = ? AND r.status != 'Maintenance'
                        AND r.id NOT IN (
                            SELECT ra.room_id FROM room_availability ra 
                            WHERE ra.status IN ('Booked', 'Maintenance')
                            AND ra.date >= ? AND ra.date < ?
                        )
                        ORDER BY r.room_number ASC
                        LIMIT 1
                    ");
                    $availStmt->execute([$category_id, $booking['check_in_date'], $booking['check_out_date']]);
                    if ($newRoomRow = $availStmt->fetch(PDO::FETCH_ASSOC)) {
                        $room_id = $newRoomRow['id'];
                        $db->prepare("UPDATE booking_rooms SET room_id = ? WHERE booking_id = ?")->execute([$room_id, $bookingDbId]);
                    }
                }
            }
        } else {
            // Assign first available room from rooms_new
            $roomAssign = $db->query("SELECT id FROM rooms_new WHERE status != 'Maintenance' LIMIT 1");
            if ($roomAssignRow = $roomAssign->fetch(PDO::FETCH_ASSOC)) {
                $room_id = $roomAssignRow['id'];
                $db->prepare("INSERT INTO booking_rooms (booking_id, room_id, price_at_booking) VALUES (?, ?, ?)")
                   ->execute([$bookingDbId, $room_id, $amount]);
            }
        }

        if ($room_id) {
            // Room availability is blocked for the booked dates, but the physical room status 
            // remains 'Available' until the guest actually checks in at the hotel.

            // Sync availability
            $startTs = strtotime($booking['check_in_date']);
            $endTs = strtotime($booking['check_out_date']);
            $upsert = $db->prepare("INSERT INTO room_availability (room_id, `date`, status, note) VALUES (?, ?, 'Booked', ?) ON DUPLICATE KEY UPDATE status = VALUES(status), note = VALUES(note)");
            for ($ts = $startTs; $ts < $endTs; $ts += 86400) {
                $d = date('Y-m-d', $ts);
                $upsert->execute([$room_id, $d, 'booking:' . $bookingId]);
            }
        }

        // 5. Insert QR record
        $db->prepare("INSERT INTO qr_codes (booking_id, qr_content) VALUES (?, ?) ON DUPLICATE KEY UPDATE qr_content = VALUES(qr_content)")
           ->execute([$bookingDbId, $bookingId]);

        $db->commit();
        log_error("Booking $bookingId successfully confirmed in database.");

        // 6. Send Email (Non-breaking)
        $emailSent = false;
        try {
            $detailsQuery = $db->prepare("
                SELECT rc.name as room_category_name
                FROM booking_rooms br
                JOIN rooms_new r ON r.id = br.room_id
                JOIN room_categories rc ON rc.id = r.category_id
                WHERE br.booking_id = ?
                LIMIT 1
            ");
            $detailsQuery->execute([$bookingDbId]);
            $roomDetails = $detailsQuery->fetch(PDO::FETCH_ASSOC);
            $roomCategoryName = $roomDetails['room_category_name'] ?? 'Luxury Sanctuary';

            include_once __DIR__ . '/../../utils/Mailer.php';
            $emailSent = Mailer::sendBookingConfirmation(
                $booking['guest_email'],
                $booking['guest_name'],
                $bookingId,
                $booking['check_in_date'],
                $booking['check_out_date'],
                $amount,
                $roomCategoryName
            );
            
            if ($emailSent) {
                log_error("Email sent successfully to " . $booking['guest_email']);
            } else {
                log_error("Email failed to send to " . $booking['guest_email']);
            }
        } catch (Exception $mailEx) {
            log_error("Email Exception: " . $mailEx->getMessage());
        }

        echo json_encode([
            'status' => 'success', 
            'message' => 'Payment verified and booking confirmed',
            'email_status' => $emailSent ? 'sent' : 'failed',
            'booking_id' => $bookingId, 
            'payment_id' => $paymentId
        ]);
        exit;

    } catch (Exception $e) {
        if ($db && $db->inTransaction()) $db->rollBack();
        log_error("Verification Error for $bookingId: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        exit;
    }
}

// Webhook handling
if (!empty($_SERVER['HTTP_X_RAZORPAY_SIGNATURE'])) {
    log_error("Webhook received from Razorpay");
    http_response_code(200);
    echo json_encode(['status' => 'ok']);
    exit;
}

log_error("No recognizable payload received.");
http_response_code(400);
echo json_encode(['status' => 'error', 'message' => 'Invalid request payload']);
?>