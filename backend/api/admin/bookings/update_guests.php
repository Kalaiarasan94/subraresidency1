<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Cache-Control, cache-control, Pragma, Expires, *");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

header("Content-Type: application/json; charset=UTF-8");
include_once __DIR__ . '/../../../config/db.php';

try {
    $db = (new Database())->getConnection();

    // Ensure columns exist in booking_details table
    try {
        $db->exec("ALTER TABLE booking_details ADD COLUMN IF NOT EXISTS children INT DEFAULT 0");
        $db->exec("ALTER TABLE booking_details ADD COLUMN IF NOT EXISTS extra_guest_charge DECIMAL(10,2) DEFAULT 0.00");
        $db->exec("ALTER TABLE booking_details ADD COLUMN IF NOT EXISTS extra_adults INT DEFAULT 0");
        $db->exec("ALTER TABLE booking_details ADD COLUMN IF NOT EXISTS extra_children INT DEFAULT 0");
    } catch (PDOException $colEx) {
        // Fallback for MySQL versions without IF NOT EXISTS on ADD COLUMN
    }

    $data = json_decode(file_get_contents("php://input"));
    $booking_id = $data->booking_id ?? null;
    $guests = $data->guests ?? null;
    $children = isset($data->children) ? intval($data->children) : 0;
    $extra_charge = isset($data->extra_charge) ? floatval($data->extra_charge) : (isset($data->extra_guest_charge) ? floatval($data->extra_guest_charge) : 0.00);
    $extra_adults = isset($data->extra_adults) ? intval($data->extra_adults) : 0;
    $extra_children = isset($data->extra_children) ? intval($data->extra_children) : 0;
    $new_total_amount = isset($data->new_total_amount) && floatval($data->new_total_amount) > 0 ? floatval($data->new_total_amount) : null;

    if (!$booking_id || $guests === null) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'booking_id and guests are required']);
        exit;
    }

    $db->beginTransaction();

    // Fetch booking to make sure it exists
    $stmt = $db->prepare("SELECT id, total_amount, actual_amount FROM bookings WHERE booking_id = ? OR id = ? LIMIT 1");
    $stmt->execute([$booking_id, $booking_id]);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$booking) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Booking not found']);
        $db->rollBack();
        exit;
    }

    $bookingDbId = $booking['id'];
    $currentTotal = floatval($booking['total_amount'] ?? 0);

    // Calculate final total amount
    if ($new_total_amount !== null) {
        $finalTotal = $new_total_amount;
    } elseif ($extra_charge > 0) {
        $finalTotal = $currentTotal + $extra_charge;
    } else {
        $finalTotal = $currentTotal;
    }

    // Update bookings table total_amount if it changed
    if ($finalTotal != $currentTotal) {
        $upBooking = $db->prepare("UPDATE bookings SET total_amount = ? WHERE id = ?");
        $upBooking->execute([$finalTotal, $bookingDbId]);
    }

    // Update booking_details table (or insert if details row doesn't exist for some reason)
    $checkStmt = $db->prepare("SELECT id, additional_notes FROM booking_details WHERE booking_id = ? LIMIT 1");
    $checkStmt->execute([$bookingDbId]);
    $details = $checkStmt->fetch(PDO::FETCH_ASSOC);

    $extraNote = $extra_charge > 0 ? "[Front Desk Extra Guest Charge: ₹" . number_format($extra_charge, 2) . "]" : "";

    if ($details) {
        $existingNotes = $details['additional_notes'] ?? '';
        $updatedNotes = $existingNotes;
        if ($extraNote && strpos($existingNotes, 'Front Desk Extra Guest Charge') === false) {
            $updatedNotes = trim($existingNotes . ' ' . $extraNote);
        }

        $updateStmt = $db->prepare("UPDATE booking_details SET guests = ?, children = ?, extra_guest_charge = ?, extra_adults = ?, extra_children = ?, additional_notes = ? WHERE booking_id = ?");
        $updateStmt->execute([$guests, $children, $extra_charge, $extra_adults, $extra_children, $updatedNotes, $bookingDbId]);
    } else {
        // Fallback: if details don't exist, create them
        $insertStmt = $db->prepare("INSERT INTO booking_details (booking_id, guests, children, extra_guest_charge, extra_adults, extra_children, additional_notes) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $insertStmt->execute([$bookingDbId, $guests, $children, $extra_charge, $extra_adults, $extra_children, $extraNote]);
    }

    $db->commit();

    echo json_encode([
        'status' => 'success',
        'message' => 'Guest details and charges updated successfully.',
        'new_total_amount' => $finalTotal,
        'extra_charge' => $extra_charge,
        'guests' => $guests,
        'children' => $children
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
