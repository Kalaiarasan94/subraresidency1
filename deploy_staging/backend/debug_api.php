<?php
include_once 'config/db.php';
include_once 'controllers/RoomController.php';

$database = new Database();
$db = $database->getConnection();
$controller = new RoomController();

ob_start();
$controller->getCategories();
$output = ob_get_clean();

echo "API Response:\n";
echo $output;
?>
