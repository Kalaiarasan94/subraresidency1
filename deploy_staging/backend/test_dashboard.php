<?php
require_once __DIR__.'/config/db.php';
$database = new Database();
$db = $database->getConnection();
include_once __DIR__.'/controllers/DashboardController.php';
$controller = new DashboardController();
$controller->getAdminStats();
?>
