<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once __DIR__ . '/../../../config/db.php';
$db = (new Database())->getConnection();

$limit  = isset($_GET['limit'])  ? intval($_GET['limit'])  : 50;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
$date   = $_GET['date']      ?? null;   // filter by check_in_date (YYYY-MM-DD)
$room   = $_GET['room']      ?? null;   // filter by room number (partial match)
$status = $_GET['status']    ?? null;   // filter by status
$all    = isset($_GET['all']) && $_GET['all'] === '1'; // include pending

$where = [];
$params = [];

if (!$all) {
    $where[] = "b.status != 'pending'";
}
if ($date) {
    $where[] = "b.check_in_date = ?";
    $params[] = $date;
}
if ($status) {
    $where[] = "b.status = ?";
    $params[] = $status;
}

$whereSql = count($where) > 0 ? 'WHERE ' . implode(' AND ', $where) : '';

// If filtering by room name/number we need a sub-query / join
$roomJoin = '';
if ($room) {
    $roomJoin = "JOIN booking_rooms _br ON _br.booking_id = b.id
                 JOIN rooms_new _r ON _r.id = _br.room_id AND (_r.room_number LIKE ? OR _r.room_name LIKE ?)";
    $params[] = "%$room%";
    $params[] = "%$room%";
}

$sql = "SELECT DISTINCT b.id, b.booking_id, b.guest_name, b.guest_email,
               b.guest_phone, b.check_in_date, b.check_out_date, b.total_amount,
               b.status, b.payment_status, b.booking_source, b.created_at,
               p.transaction_id, p.amount as paid_amount
        FROM bookings b
        $roomJoin
        LEFT JOIN payments p ON p.booking_id = b.id AND p.status = 'success'
        $whereSql
        ORDER BY b.created_at DESC
        LIMIT ? OFFSET ?";

$params[] = $limit;
$params[] = $offset;

$stmt = $db->prepare($sql);
// Bind params properly for PDO (integers last two)
foreach ($params as $i => $val) {
    $isInt = ($i >= count($params) - 2);
    $stmt->bindValue($i + 1, $val, $isInt ? PDO::PARAM_INT : PDO::PARAM_STR);
}
$stmt->execute();
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get total count for pagination
$countSql = "SELECT COUNT(DISTINCT b.id) FROM bookings b $roomJoin $whereSql";
$countParams = array_slice($params, 0, count($params) - 2); // strip limit/offset
$countStmt = $db->prepare($countSql);
$countStmt->execute($countParams);
$total = (int)$countStmt->fetchColumn();

// Attach room info to each booking
$room_stmt = $db->prepare("SELECT r.room_number, r.room_name FROM booking_rooms br JOIN rooms_new r ON br.room_id = r.id WHERE br.booking_id = ?");
foreach ($rows as &$row) {
    $room_stmt->execute([$row['id']]);
    $row['rooms'] = $room_stmt->fetchAll(PDO::FETCH_ASSOC);
    $row['room_number'] = !empty($row['rooms']) ? $row['rooms'][0]['room_number'] : 'N/A';
}

echo json_encode(['status' => 'success', 'bookings' => $rows, 'total' => $total]);
?>