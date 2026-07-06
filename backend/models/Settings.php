<?php
// backend/models/Settings.php

class Settings {
    private $conn;
    private $table_name = "settings";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAll() {
        $query = "SELECT setting_key, setting_value FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        $settings = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
        return $settings;
    }

    public function getByKey($key) {
        $query = "SELECT setting_value FROM " . $this->table_name . " WHERE setting_key = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$key]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $row['setting_value'] : null;
    }

    public function update($key, $value) {
        // Check if key exists
        $query = "SELECT id FROM " . $this->table_name . " WHERE setting_key = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$key]);
        
        if ($stmt->rowCount() > 0) {
            $query = "UPDATE " . $this->table_name . " SET setting_value = ? WHERE setting_key = ?";
            $stmt = $this->conn->prepare($query);
            return $stmt->execute([$value, $key]);
        } else {
            $query = "INSERT INTO " . $this->table_name . " (setting_key, setting_value) VALUES (?, ?)";
            $stmt = $this->conn->prepare($query);
            return $stmt->execute([$key, $value]);
        }
    }

    public function updateMultiple($data) {
        $success = true;
        foreach ($data as $key => $value) {
            if (!$this->update($key, $value)) {
                $success = false;
            }
        }
        return $success;
    }
}
