<?php
// backend/models/Room.php

class Room {
    private $conn;
    private $table_name = "rooms";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAllCategories() {
        $query = "SELECT * FROM room_categories";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function getRoomsByCategory($category_id) {
        $query = "SELECT r.*, c.name as category_name 
                  FROM " . $this->table_name . " r 
                  JOIN room_categories c ON r.category_id = c.id 
                  WHERE r.category_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $category_id);
        $stmt->execute();
        return $stmt;
    }

    public function getCategoryImages($category_id) {
        $query = "SELECT image_path, is_primary FROM room_images WHERE category_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $category_id);
        $stmt->execute();
        return $stmt;
    }

    public function getAllRoomsWithCategories() {
        $query = "SELECT r.*, c.name as category_name, c.base_price_12h, c.base_price_24h, c.adults_count, c.children_count, c.room_size, c.amenities
                  FROM " . $this->table_name . " r 
                  JOIN room_categories c ON r.category_id = c.id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}
?>
