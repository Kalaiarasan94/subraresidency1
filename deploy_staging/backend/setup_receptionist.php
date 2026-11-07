<?php
include 'config/db.php';
$db = (new Database())->getConnection();

try {
    // Create reception_users table
    $db->exec("CREATE TABLE IF NOT EXISTS reception_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        email VARCHAR(100),
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "Ensured 'reception_users' table exists.\n";

    // Add a default receptionist
    $stmt = $db->prepare("SELECT id FROM reception_users WHERE username = 'receptionist'");
    $stmt->execute();
    if ($stmt->rowCount() == 0) {
        $hash = password_hash('recep123', PASSWORD_DEFAULT);
        $db->exec("INSERT INTO reception_users (username, password, full_name, email) VALUES ('receptionist', '$hash', 'Receptionist Manager', 'receptionist@subra.com')");
        echo "Created 'receptionist' user.\n";
    }

    // Create notifications table
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
