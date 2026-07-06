<?php
header("Access-Control-Allow-Origin: *");
header("Content-Length: 0"); // For pre-flight if needed but usually just * is fine
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . '/../../config/db.php';
include_once __DIR__ . '/../../utils/Mailer.php';

$logFile = __DIR__ . '/../../logs/payment.log';
file_put_contents($logFile, "[" . date('Y-m-d H:i:s') . "] CRITICAL: create_order.php reached!\n", FILE_APPEND);

// Read input: expects { booking_id, amount, currency }
$input = json_decode(file_get_contents('php://input'), true);
file_put_contents($logFile, "[" . date('Y-m-d H:i:s') . "] CRITICAL: Input: " . json_encode($input) . "\n", FILE_APPEND);
if (!$input || empty($input['booking_id']) || empty($input['amount'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
    exit;
}

$bookingId = $input['booking_id'];
$amount = intval(round(floatval($input['amount']) * 100)); // in paise
$currency = $input['currency'] ?? 'INR';

// Load keys from env file
$env = @parse_ini_file(__DIR__ . '/../../.env');
if (!$env) $env = [];
$key_id = $env['RAZORPAY_KEY_ID'] ?? 'rzp_test_T39EAKfhTXbEkR';
$key_secret = $env['RAZORPAY_KEY_SECRET'] ?? 'hqkqX0BRo10gzkQ5CrG7r0RP';

if (!$key_id || !$key_secret) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Payment gateway not configured']);
    exit;
}

// Check for Debug Mail Flag
if (isset($env['DEBUG_MAIL_ON_ORDER']) && ($env['DEBUG_MAIL_ON_ORDER'] == 'true' || $env['DEBUG_MAIL_ON_ORDER'] == 1)) {
    $logFile = __DIR__ . '/../../logs/payment.log';
    file_put_contents($logFile, "[" . date('Y-m-d H:i:s') . "] DEBUG: Debug Mail Triggered for ID: $bookingId\n", FILE_APPEND);
    try {
        $database = new Database();
        $db = $database->getConnection();
        $stmt = $db->prepare("SELECT guest_email, guest_name, check_in_date, check_out_date FROM bookings WHERE booking_id = ?");
        $stmt->execute([$bookingId]);
        $booking = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($booking) {
            file_put_contents($logFile, "[" . date('Y-m-d H:i:s') . "] DEBUG: Sending Mail to " . $booking['guest_email'] . "\n", FILE_APPEND);
            Mailer::sendBookingConfirmation(
                $booking['guest_email'],
                $booking['guest_name'],
                $bookingId,
                $booking['check_in_date'],
                $booking['check_out_date'],
                floatval($input['amount'])
            );
        } else {
            file_put_contents($logFile, "[" . date('Y-m-d H:i:s') . "] DEBUG: No booking found for ID: $bookingId\n", FILE_APPEND);
        }
    } catch (Exception $e) {
        file_put_contents($logFile, "[" . date('Y-m-d H:i:s') . "] DEBUG ERROR: " . $e->getMessage() . "\n", FILE_APPEND);
    }
}

// Create order via Razorpay REST API
$payload = json_encode([
    'amount' => $amount,
    'currency' => $currency,
    'receipt' => $bookingId,
    'payment_capture' => 1
]);

$ch = curl_init('https://api.razorpay.com/v1/orders');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERPWD, $key_id . ':' . $key_secret);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code >= 200 && $http_code < 300) {
    $resp = json_decode($response, true);
    echo json_encode(['status' => 'success', 'order' => $resp, 'key_id' => $key_id]);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to create order', 'details' => $response]);
}
?>