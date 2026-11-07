<?php
include_once 'config/db.php';
$database = new Database();
$db = $database->getConnection();

$stmt = $db->query("SELECT id, room_name, status, show_on_website FROM rooms_new");
$rooms = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "Rooms in DB:\n";
print_r($rooms);
?>
