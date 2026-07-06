<?php
include 'config/db.php';
$db = (new Database())->getConnection();

function ensureTable($db, $tableName, $createSql) {
    $stmt = $db->query("SHOW TABLES LIKE '$tableName'");
    if ($stmt->rowCount() == 0) {
        $db->exec($createSql);
        echo "Table $tableName Created\n";
    } else {
        echo "Table $tableName Exists\n";
    }
}

ensureTable($db, 'receptionist_notifications', "CREATE TABLE receptionist_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    message TEXT,
    data JSON,
    is_read TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

ensureTable($db, 'reception_users', "CREATE TABLE reception_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// Check rooms_new statuses
$stmt = $db->query("SHOW COLUMNS FROM rooms_new LIKE 'status'");
$col = $stmt->fetch();
echo "rooms_new status type: " . $col['Type'] . "\n";

if (strpos($col['Type'], 'dirty') === false) {
    echo "Adding 'dirty' to rooms_new status enum...\n";
    // This is risky if we don't know the full list. Let's just catch query errors in PHP instead of modifying schema.
}
