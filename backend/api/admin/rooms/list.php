<?php
// backend/api/admin/rooms/list.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../../config/db.php';

$database = new Database();
$db = $database->getConnection();

try {
    $stmt = $db->prepare("SELECT id, room_name, room_number, base_price, max_adults, max_children, short_description, featured_image, status FROM rooms_new ORDER BY created_at DESC");
    $stmt->execute();
    
    $rooms = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Map database fields to the UI expectations
        $rooms[] = [
            'id' => $row['id'],
            'title' => $row['room_name'] . ' (' . $row['room_number'] . ')',
            'room_name' => $row['room_name'],
            'price_24h' => $row['base_price'],
            'adults' => $row['max_adults'],
            'children' => $row['max_children'],
            'description' => $row['short_description'],
            'image' => $row['featured_image'] ?: '',
            'status' => $row['status']
        ];
    }

    if (count($rooms) > 0) {
        http_response_code(200);
        echo json_encode($rooms);
    } else {
        http_response_code(200);
        echo json_encode([]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
