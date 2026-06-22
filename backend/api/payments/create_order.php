<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . '/../../config/db.php';

// Read input: expects { booking_id, amount, currency }
$input = json_decode(file_get_contents('php://input'), true);
if (!$input || empty($input['booking_id']) || empty($input['amount'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
    exit;
}

$bookingId = $input['booking_id'];
$amount = intval(round(floatval($input['amount']) * 100)); // in paise
$currency = $input['currency'] ?? 'INR';

// Load keys from env file
$env = parse_ini_file(__DIR__ . '/../../.env');
$key_id = $env['RAZORPAY_KEY_ID'] ?? '';
$key_secret = $env['RAZORPAY_KEY_SECRET'] ?? '';

if (!$key_id || !$key_secret) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Payment gateway not configured']);
    exit;
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