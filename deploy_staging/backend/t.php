<?php
include 'config/db.php';
$db = (new Database())->getConnection();

$out = "rooms count: " . $db->query("SELECT COUNT(*) FROM rooms")->fetchColumn() . "\n";
$out .= "rooms_new count: " . $db->query("SELECT COUNT(*) FROM rooms_new")->fetchColumn() . "\n";

file_put_contents('schema_info.txt', $out);
echo "Written!\n";
?>
