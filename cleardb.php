<?php
// cleardb.php - Self-contained script to clear all booking data from Hostinger live database
header("X-LiteSpeed-Purge: *");
header("Content-Type: text/plain; charset=UTF-8");

echo "=== Subra Residency Live Database Cleanup ===\n\n";

$databasesToTry = [
    [
        'host' => 'localhost',
        'dbname' => 'u388330196_subra_db',
        'user' => 'u388330196_subra_db',
        'pass' => 'Inwora@2026'
    ]
];

// Also try loading from backend/.env if available
$env_path = __DIR__ . '/backend/.env';
if (file_exists($env_path)) {
    $lines = file($env_path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $envVars = [];
    foreach ($lines as $line) {
        $line = trim($line);
        // Strip leading semicolons for production keys if present
        if (strpos($line, '; DB_') === 0) {
            $line = substr($line, 2);
        }
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $val) = explode('=', $line, 2);
            $envVars[trim($key)] = trim($val, " \"'");
        }
    }
    if (!empty($envVars['DB_NAME'])) {
        array_unshift($databasesToTry, [
            'host' => $envVars['DB_HOST'] ?? 'localhost',
            'dbname' => $envVars['DB_NAME'],
            'user' => $envVars['DB_USER'] ?? 'root',
            'pass' => $envVars['DB_PASS'] ?? ''
        ]);
    }
}

$success = false;

foreach ($databasesToTry as $config) {
    try {
        echo "Attempting connection to Database: `{$config['dbname']}` on Host: `{$config['host']}` as User: `{$config['user']}`...\n";
        $pdo = new PDO(
            "mysql:host={$config['host']};dbname={$config['dbname']};charset=utf8mb4",
            $config['user'],
            $config['pass'],
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );

        echo "Connected successfully to `{$config['dbname']}`!\n\n";

        $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");

        $tables = [
            'booking_details',
            'booking_rooms',
            'payments',
            'qr_codes',
            'receptionist_notifications',
            'room_availability',
            'bookings',
            'users',
            'expenses'
        ];

        foreach ($tables as $table) {
            try {
                $countBefore = $pdo->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
                $pdo->exec("DELETE FROM `$table`;");
                $pdo->exec("ALTER TABLE `$table` AUTO_INCREMENT = 1;");
                echo "Cleared `$table` (Deleted $countBefore rows)\n";
            } catch (Exception $te) {
                echo "Notice for `$table`: " . $te->getMessage() . "\n";
            }
        }

        try {
            $pdo->exec("UPDATE `rooms_new` SET `status` = 'Available' WHERE `status` = 'Occupied';");
            $pdo->exec("UPDATE `rooms` SET `status` = 'available' WHERE `status` = 'occupied';");
            echo "Reset occupied room statuses back to Available.\n";
        } catch (Exception $re) {
            echo "Notice resetting rooms: " . $re->getMessage() . "\n";
        }

        $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

        echo "\nSUCCESS: Purged database `{$config['dbname']}`!\n";
        $success = true;

    } catch (PDOException $e) {
        echo "Could not connect to `{$config['dbname']}`: " . $e->getMessage() . "\n\n";
    }
}

if (!$success) {
    echo "ERROR: Failed to clean any database. Please check Hostinger database credentials.\n";
}
?>
