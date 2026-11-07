<?php
include 'config/db.php';
$db = (new Database())->getConnection();

try {
    // Check if role column exists
    $stmt = $db->query("SHOW COLUMNS FROM users LIKE 'role'");
    if ($stmt->rowCount() == 0) {
        $db->exec("ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'admin' AFTER password");
        echo "Added 'role' column to users table.\n";
    }

    // Create a receptionist user if not exists
    $stmt = $db->prepare("SELECT id FROM users WHERE username = 'receptionist'");
    $stmt->execute();
    if ($stmt->rowCount() == 0) {
        $pass = password_hash('recep123', PASSWORD_DEFAULT);
        $db->exec("INSERT INTO users (username, password, role, name, email) VALUES ('receptionist', '$pass', 'receptionist', 'Receptionist User', 'receptionist@subra.com')");
        echo "Created 'receptionist' user (pass: recep123).\n";
    }

    // Create notifications table for QR scans
    $db->exec("CREATE TABLE IF NOT EXISTS receptionist_notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        message TEXT,
        data JSON,
        is_read TINYINT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "Ensured 'receptionist_notifications' table exists.\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
