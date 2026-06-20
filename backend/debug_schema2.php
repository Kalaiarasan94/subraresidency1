<?php
require_once __DIR__.'/config/db.php';
$database = new Database();
$db = $database->getConnection();
foreach(['bookings','payments'] as $tbl){
    echo "--- $tbl ---\n";
    $stmt = $db->query("SHOW COLUMNS FROM $tbl");
    foreach($stmt as $row){
        echo $row['Field'].':'.$row['Type']."\n";
    }
}
?>
