<?php
// backend/scripts/migrate_ota_and_extra_charges.php
require_once __DIR__ . '/../config/db.php';

try {
    $db = (new Database())->getConnection();
    if (!$db) {
        die("Failed to connect to database.\n");
    }

    function addColumnIfNotExists($db, $table, $col, $def) {
        $check = $db->query("SHOW COLUMNS FROM `$table` LIKE '$col'");
        if ($check->rowCount() == 0) {
            $db->exec("ALTER TABLE `$table` ADD COLUMN `$col` $def");
            echo "Added $table.$col\n";
        } else {
            echo "$table.$col already exists\n";
        }
    }

    addColumnIfNotExists($db, "bookings", "actual_amount", "DECIMAL(10,2) DEFAULT NULL");
    addColumnIfNotExists($db, "bookings", "platform_fee", "DECIMAL(10,2) DEFAULT 0.00");
    addColumnIfNotExists($db, "payments", "platform_fee", "DECIMAL(10,2) DEFAULT 0.00");
    addColumnIfNotExists($db, "payments", "gross_amount", "DECIMAL(10,2) DEFAULT NULL");
    addColumnIfNotExists($db, "booking_details", "extra_guest_charge", "DECIMAL(10,2) DEFAULT 0.00");
    addColumnIfNotExists($db, "booking_details", "extra_adults", "INT(11) DEFAULT 0");
    addColumnIfNotExists($db, "booking_details", "extra_children", "INT(11) DEFAULT 0");

    echo "Migration completed successfully.\n";
} catch (Exception $e) {
    echo "Migration error: " . $e->getMessage() . "\n";
}
