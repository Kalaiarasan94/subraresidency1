<?php
include 'config/db.php';
$db = (new Database())->getConnection();

// Re-create or Alter notifications table with TEXT instead of JSON
$db->exec("DROP TABLE IF EXISTS receptionist_notifications");
$db->exec("CREATE TABLE receptionist_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    message TEXT,
    data TEXT,
    is_read TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");
echo "Table receptionist_notifications Re-created with TEXT data column.\n";
