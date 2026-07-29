<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

include_once __DIR__ . '/../../../config/db.php';

$database = new Database();
$db = $database->getConnection();

try {
    $room_id = isset($_GET['room_id']) ? intval($_GET['room_id']) : null;
    $startRaw = isset($_GET['start']) ? $_GET['start'] : null;
    $endRaw = isset($_GET['end']) ? $_GET['end'] : null;

    $startTime = $startRaw ? strtotime(str_replace('.', '-', $startRaw)) : null;
    $endTime = $endRaw ? strtotime(str_replace('.', '-', $endRaw)) : null;

    $start = $startTime ? date('Y-m-d', $startTime) : null;
    $end = $endTime ? date('Y-m-d', $endTime) : null;

    $params = [];
    $query = "SELECT room_id, `date`, status, note FROM room_availability";

    if ($room_id && $room_id > 0 && $start && $end) {
        $query .= " WHERE room_id = ? AND `date` BETWEEN ? AND ?";
        $params = [$room_id, $start, $end];
    } elseif ($start && $end) {
        $query .= " WHERE `date` BETWEEN ? AND ?";
        $params = [$start, $end];
    } elseif ($room_id && $room_id > 0) {
        $query .= " WHERE room_id = ?";
        $params = [$room_id];
    }

    $query .= " ORDER BY `date` ASC";
    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Index existing records by room_id and date
    $avail_map = [];
    foreach ($rows as $row) {
        $key = $row['room_id'] . '_' . $row['date'];
        $avail_map[$key] = $row;
    }

    // --- DYNAMICALLY INJECT BOOKINGS AS BOOKED STATUS ---
    // This handles any manual or auto-bookings not yet synced to the room_availability table
    $b_query = "
        SELECT br.room_id, b.check_in_date, b.check_out_date, b.id as booking_id, b.status as booking_status
        FROM booking_rooms br
        JOIN bookings b ON b.id = br.booking_id
        WHERE (b.status IN ('confirmed', 'checked-in')
           OR (b.status = 'pending' AND b.created_at >= NOW() - INTERVAL 15 MINUTE))
    ";
    $b_params = [];
    if ($room_id && $room_id > 0) {
        $b_query .= " AND br.room_id = ?";
        $b_params[] = $room_id;
    }
    if ($start && $end) {
        $b_query .= " AND b.check_in_date <= ? AND b.check_out_date >= ?";
        $b_params[] = $end;
        $b_params[] = $start;
    }

    $b_stmt = $db->prepare($b_query);
    $b_stmt->execute($b_params);
    $bookings_info = $b_stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($bookings_info as $bk) {
        $rid = $bk['room_id'];
        $b_start = strtotime($bk['check_in_date']);
        $b_end = strtotime($bk['check_out_date']);

        // Loop through each night of the booking
        for ($curr = $b_start; $curr < $b_end; $curr += 86400) {
            $date_str = date('Y-m-d', $curr);

            // If dates are bounded, check boundaries
            if ($start && $end) {
                if ($date_str < $start || $date_str > $end)
                    continue;
            }

            $key = $rid . '_' . $date_str;
            $avail_map[$key] = [
                'room_id' => $rid,
                'date' => $date_str,
                'status' => 'Booked',
                'note' => 'booking:' . $bk['booking_id'],
                'booking_status' => $bk['booking_status']
            ];
        }
    }

    // Fetch room details to inject status-based blocks (Occupied, Maintenance, Inactive)
    if ($room_id && $room_id > 0) {
        $r_stmt = $db->prepare("SELECT id, status, maintenance_start, maintenance_end FROM rooms_new WHERE id = ?");
        $r_stmt->execute([$room_id]);
        $rooms_info = $r_stmt->fetchAll(PDO::FETCH_ASSOC);
    } else {
        $r_stmt = $db->prepare("SELECT id, status, maintenance_start, maintenance_end FROM rooms_new");
        $r_stmt->execute();
        $rooms_info = $r_stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    if ($start && $end) {
        $start_ts = strtotime($start);
        $end_ts = strtotime($end);

        foreach ($rooms_info as $r) {
            $rid = $r['id'];
            $status = $r['status'];
            $m_start = $r['maintenance_start'];
            $m_end = $r['maintenance_end'];

            if ($status === 'Inactive') {
                $curr = $start_ts;
                while ($curr <= $end_ts) {
                    $date_str = date('Y-m-d', $curr);
                    $key = $rid . '_' . $date_str;

                    if (!isset($avail_map[$key])) {
                        $avail_map[$key] = [
                            'room_id' => $rid,
                            'date' => $date_str,
                            'status' => 'Booked',
                            'note' => 'Room status: ' . $status
                        ];
                    }
                    $curr += 86400;
                }
            } elseif ($status === 'Occupied') {
                $today_str = date('Y-m-d');
                $in_range = (!$start || $today_str >= $start) && (!$end || $today_str <= $end);
                if ($in_range) {
                    $key = $rid . '_' . $today_str;
                    if (!isset($avail_map[$key])) {
                        $avail_map[$key] = [
                            'room_id' => $rid,
                            'date' => $today_str,
                            'status' => 'Booked',
                            'note' => 'Room status: ' . $status
                        ];
                    }
                }
            } elseif ($status === 'Maintenance') {
                $curr = $start_ts;
                $m_start_ts = $m_start ? strtotime($m_start) : null;
                $m_end_ts = $m_end ? strtotime($m_end) : null;

                while ($curr <= $end_ts) {
                    $date_str = date('Y-m-d', $curr);
                    $key = $rid . '_' . $date_str;

                    $in_window = true;
                    if ($m_start_ts && $m_end_ts) {
                        $in_window = ($curr >= $m_start_ts && $curr <= $m_end_ts);
                    }

                    if ($in_window) {
                        if (!isset($avail_map[$key]) || $avail_map[$key]['status'] !== 'Booked') {
                            $avail_map[$key] = [
                                'room_id' => $rid,
                                'date' => $date_str,
                                'status' => 'Maintenance',
                                'note' => 'Room maintenance block'
                            ];
                        }
                    }
                    $curr += 86400;
                }
            }
        }
    }

    $result_rows = array_values($avail_map);
    usort($result_rows, function ($a, $b) {
        if ($a['room_id'] === $b['room_id']) {
            return strcmp($a['date'], $b['date']);
        }
        return intval($a['room_id']) - intval($b['room_id']);
    });

    echo json_encode($result_rows);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>