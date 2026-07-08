<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once __DIR__ . '/../../config/db.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->notification_id)) {
    try {
        $stmt = $db->prepare("UPDATE receptionist_notifications SET is_read = 1 WHERE id = ?");
        if ($stmt->execute([$data->notification_id])) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    // Clear all
    $db->exec("UPDATE receptionist_notifications SET is_read = 1 WHERE is_read = 0");
    echo json_encode(["status" => "success"]);
}
?>
