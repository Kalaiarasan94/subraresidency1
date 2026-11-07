<?php
require_once __DIR__.'/config/db.php';
$database = new Database();
$db = $database->getConnection();
$sql = "ALTER TABLE rooms ADD COLUMN room_number VARCHAR(10) NOT NULL UNIQUE AFTER id";
try {
    $db->exec($sql);
    echo "Column added successfully\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
