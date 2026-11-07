<?php
// Quick end-to-end test for all 3 management endpoints
include 'config/db.php';
require_once 'controllers/ManagementController.php';

echo "=== Testing ManagementController ===\n\n";

$c = new ManagementController();

echo "-- guests --\n";
ob_start();
$c->getGuestDirectory();
$out = ob_get_clean();
$decoded = json_decode($out, true);
if ($decoded && isset($decoded['status']) && $decoded['status'] === 'success') {
    echo "OK - " . count($decoded['data']) . " guests\n";
} else {
    echo "ERROR: " . $out . "\n";
}

echo "\n-- settlements --\n";
ob_start();
$c->getSettlements();
$out = ob_get_clean();
$decoded = json_decode($out, true);
if ($decoded && isset($decoded['status']) && $decoded['status'] === 'success') {
    echo "OK - " . count($decoded['data']) . " payments\n";
} else {
    echo "ERROR: " . $out . "\n";
}

echo "\n-- logs --\n";
ob_start();
$c->getStayLogs();
$out = ob_get_clean();
$decoded = json_decode($out, true);
if ($decoded && isset($decoded['status']) && $decoded['status'] === 'success') {
    echo "OK - " . count($decoded['data']) . " bookings\n";
} else {
    echo "ERROR: " . $out . "\n";
}

echo "\nDone.\n";
