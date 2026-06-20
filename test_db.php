<?php
try {
    $conn = new PDO("mysql:host=localhost", "root", "");
    echo "Connected successfully to MySQL root\n";
    $conn->exec("CREATE DATABASE IF NOT EXISTS subra");
    echo "Database subra created or exists\n";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
?>
