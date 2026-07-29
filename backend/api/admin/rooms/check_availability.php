<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once __DIR__ . '/../../../config/db.php';

$checkinRaw = $_GET['checkin'] ?? null;
$checkoutRaw = $_GET['checkout'] ?? null;
$booking_id = $_GET['booking_id'] ?? null; // the internal numeric id of the current booking
$cat_id = $_GET['category_id'] ?? null; // filter by category (optional)

if (!$checkinRaw || !$checkoutRaw) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'checkin and checkout dates are required']);
    exit;
}

$checkinTime = strtotime(str_replace('.', '-', $checkinRaw));
$checkoutTime = strtotime(str_replace('.', '-', $checkoutRaw));

if (!$checkinTime || !$checkoutTime) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid checkin or checkout date format']);
    exit;
}

$checkin = date('Y-m-d', $checkinTime);
$checkout = date('Y-m-d', $checkoutTime);

try {
    $db = (new Database())->getConnection();

    // Fetch booking details if checking for a specific booking to exclude its own blocks
    $dbId = null;
    $strId = null;
    if ($booking_id) {
        $stmt_bk = $db->prepare("SELECT id, booking_id FROM bookings WHERE id = ? OR booking_id = ? LIMIT 1");
        $stmt_bk->execute([$booking_id, $booking_id]);
        $bk_row = $stmt_bk->fetch(PDO::FETCH_ASSOC);
        if ($bk_row) {
            $dbId = $bk_row['id'];
            $strId = $bk_row['booking_id'];
        }
    }

    // --- Build exclusion sub-query for rooms booked by OTHER bookings
    // A room is "taken" if another CONFIRMED booking overlaps with [checkin, checkout)
    // We exclude the current booking (if provided) so its pre-assigned room shows up
    $otherBookingExclusion = "
        SELECT br.room_id FROM booking_rooms br
        JOIN bookings b ON b.id = br.booking_id
        WHERE (b.status IN ('confirmed', 'checked-in')
           OR (b.status = 'pending' AND b.created_at >= NOW() - INTERVAL 15 MINUTE))
          AND b.check_in_date  < ?
          AND b.check_out_date > ?
          AND br.room_id IS NOT NULL
    ";

    if ($dbId) {
        $otherBookingExclusion .= " AND b.id != ?";
    }

    // Category filter
    $categoryFilter = '';
    if ($cat_id) {
        $categoryFilter = " AND r.category_id = ?";
    }

    // Maintenance block filter (room_availability table)
    $maintenanceExclusion = "
        SELECT ra.room_id FROM room_availability ra
        WHERE ra.status IN ('Booked', 'Maintenance')
          AND ra.date >= ?
          AND ra.date < ?
          AND ra.room_id IS NOT NULL
    ";
    if ($dbId && $strId) {
        $maintenanceExclusion .= " AND (ra.note IS NULL OR (ra.note != ? AND ra.note != ?))";
    }

    // Build parameters array in the exact order placeholders appear in SQL
    $params = [];

    // For $otherBookingExclusion
    $params[] = $checkout;
    $params[] = $checkin;
    if ($dbId) {
        $params[] = (int)$dbId;
    }

    // For $maintenanceExclusion
    $params[] = $checkin;
    $params[] = $checkout;
    if ($dbId && $strId) {
        $params[] = 'booking:' . $strId;
        $params[] = 'booking:' . $dbId;
    }

    // For $categoryFilter
    if ($cat_id) {
        $params[] = (int)$cat_id;
    }

    $today_str = date('Y-m-d');
    $is_today_in_range = ($checkin <= $today_str && $checkout > $today_str);
    $statusExclusions = "'Maintenance', 'Inactive'";
    if ($is_today_in_range) {
        $statusExclusions .= ", 'Occupied'";
    }

    $query = "
        SELECT r.id, r.room_number, r.room_name, r.room_name AS category_name,
               r.category_id, COALESCE(NULLIF(r.base_price, 0), rc.base_price_24h, 0) AS base_price,
               r.floor_number, r.status, rc.name AS category_label
        FROM rooms_new r
        LEFT JOIN room_categories rc ON rc.id = r.category_id
        WHERE r.status NOT IN ($statusExclusions)
          AND r.id NOT IN ($otherBookingExclusion)
          AND r.id NOT IN ($maintenanceExclusion)
          $categoryFilter
        ORDER BY r.floor_number ASC, r.room_number ASC
    ";

    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $rooms = $stmt->fetchAll(PDO::FETCH_ASSOC);


    echo json_encode(['status' => 'success', 'rooms' => $rooms, 'total' => count($rooms)]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>