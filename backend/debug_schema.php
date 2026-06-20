<?php
require_once __DIR__.'/config/db.php';
$database = new Database();
$db = $database->getConnection();
$stmt = $db->query('SHOW COLUMNS FROM rooms');
foreach ($stmt as $row) {
    echo $row['Field'] . ':' . $row['Type'] . "\n";
}
?>
