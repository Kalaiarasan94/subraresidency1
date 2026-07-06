<?php
include 'config/db.php';
$db = (new Database())->getConnection();
$tables = ['users', 'bookings', 'payments', 'rooms_new'];
foreach ($tables as $table) {
    echo "--- $table ---\n";
    $stmt = $db->query("DESCRIBE $table");
    print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
}
