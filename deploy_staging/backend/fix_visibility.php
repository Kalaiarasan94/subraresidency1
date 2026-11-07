<?php
include_once 'config/db.php';
$database = new Database();
$db = $database->getConnection();
$db->exec("UPDATE rooms_new SET show_on_website = 1, status = 'Available'");
echo "All rooms set to Available and Visible.\n";
?>
