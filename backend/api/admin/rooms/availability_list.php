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

    // Dynamic injection of maintenance dates
    $m_start = null;
    $m_end = null;
    if ($room_id) {
        $r_stmt = $db->prepare("SELECT maintenance_start, maintenance_end FROM rooms_new WHERE id = ?");
        $r_stmt->execute([$room_id]);
        $r_info = $r_stmt->fetch(PDO::FETCH_ASSOC);
        if ($r_info) {
            $m_start = $r_info['maintenance_start'];
            $m_end = $r_info['maintenance_end'];
        }
    }

    $avail_map = [];
    foreach ($rows as $row) {
        $avail_map[$row['date']] = $row;
    }

    if ($m_start && $m_end && $start && $end) {
        $curr = strtotime($start);
        $last = strtotime($end);
        $m_start_ts = strtotime($m_start);
        $m_end_ts = strtotime($m_end);
        while ($curr <= $last) {
            $date_str = date('Y-m-d', $curr);
            if ($curr >= $m_start_ts && $curr <= $m_end_ts) {
                if (!isset($avail_map[$date_str]) || $avail_map[$date_str]['status'] !== 'Booked') {
                    $avail_map[$date_str] = [
                        'room_id' => $room_id,
                        'date' => $date_str,
                        'status' => 'Maintenance',
                        'note' => 'Room maintenance block'
                    ];
                }
            }
            $curr += 86400;
        }
    }

    $result_rows = array_values($avail_map);
    usort($result_rows, function($a, $b) {
        return strcmp($a['date'], $b['date']);
    });

    echo json_encode($result_rows);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success"=>false, "message" => $e->getMessage()]);
}
?>
