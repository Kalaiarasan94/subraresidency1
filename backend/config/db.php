<?php
// backend/config/db.php

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct() {
        $env = @parse_ini_file(__DIR__ . '/../.env');
        if (!$env) $env = [];
        $this->host = $env['DB_HOST'] ?? 'localhost';
        $this->db_name = $env['DB_NAME'] ?? 'subra';
        $this->username = $env['DB_USER'] ?? 'root';
        $this->password = $env['DB_PASS'] ?? '';
    }

    public function getConnection() {
        $this->conn = null;
        $hosts = [$this->host];
        if ($this->host === 'localhost') {
            $hosts[] = '127.0.0.1';
        }
        foreach ($hosts as $h) {
            try {
                $this->conn = new PDO("mysql:host=" . $h . ";dbname=" . $this->db_name, $this->username, $this->password);
                $this->conn->exec("set names utf8");
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                return $this->conn;
            } catch(PDOException $exception) {
                $lastErr = $exception->getMessage();
            }
        }
        $log_file = __DIR__ . '/../logs/payment.log';
        if (!file_exists(dirname($log_file))) @mkdir(dirname($log_file), 0777, true);
        @error_log("[" . date('Y-m-d H:i:s') . "] Database Connection error: " . ($lastErr ?? 'Unknown') . "\n", 3, $log_file);
        return $this->conn;
    }
}
?>
