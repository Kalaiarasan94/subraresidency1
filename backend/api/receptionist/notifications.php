<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . '/../../config/db.php';

$database = new Database();
$db = $database->getConnection();

try {
    $query = "SELECT * FROM receptionist_notifications WHERE is_read = 0 ORDER BY created_at DESC LIMIT 5";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $notifs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Auto mark as read for polling demo or let client do it
    // For now, return them
    echo json_encode(["status" => "success", "notifications" => $notifs]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
