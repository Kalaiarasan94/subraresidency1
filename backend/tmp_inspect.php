<?php
include 'config/db.php';
$db = (new Database())->getConnection();
$stmt = $db->query("DESCRIBE rooms_new");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
