<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . '/../../../config/db.php';

$database = new Database();
$db = $database->getConnection();

try {
    $room_id = isset($_GET['room_id']) ? intval($_GET['room_id']) : null;
    $start = isset($_GET['start']) ? $_GET['start'] : null; // YYYY-MM-DD
    $end = isset($_GET['end']) ? $_GET['end'] : null;     // YYYY-MM-DD

    $params = [];
    $query = "SELECT room_id, `date`, status, note FROM room_availability";

    if ($room_id && $start && $end) {
        $query .= " WHERE room_id = ? AND `date` BETWEEN ? AND ?";
        $params = [$room_id, $start, $end];
    } elseif ($start && $end) {
        $query .= " WHERE `date` BETWEEN ? AND ?";
        $params = [$start, $end];
    } elseif ($room_id) {
        $query .= " WHERE room_id = ?";
        $params = [$room_id];
    }

    $query .= " ORDER BY `date` ASC";
    $stmt = $db->prepare($query);
    $stmt->execute($params);

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($rows);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success"=>false, "message" => $e->getMessage()]);
}
?>
