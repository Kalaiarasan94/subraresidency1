<?php
// backend/controllers/RoomController.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/db.php';
include_once '../models/Room.php';

class RoomController {
    private $db;
    private $room;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->room = new Room($this->db);
    }

    public function getCategories() {
        $baseUrl = 'http://localhost:8001';
        $query = "SELECT * FROM rooms_new WHERE show_on_website = 1 ORDER BY created_at DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        
        $rooms = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // Get gallery images
            $img_query = "SELECT image_path FROM room_images_new WHERE room_id = ? ORDER BY sort_order ASC";
            $img_stmt = $this->db->prepare($img_query);
            $img_stmt->execute([$row['id']]);
            $gallery = $img_stmt->fetchAll(PDO::FETCH_COLUMN);
            
            // Get amenities
            $amenities_query = "SELECT amenity_name FROM room_amenities WHERE room_id = ?";
            $amenities_stmt = $this->db->prepare($amenities_query);
            $amenities_stmt->execute([$row['id']]);
            $amenities = $amenities_stmt->fetchAll(PDO::FETCH_COLUMN);

            $rooms[] = [
                "id" => $row['id'],
                "title" => $row['room_name'],
                "room_number" => $row['room_number'],
                "price" => "₹" . number_format($row['base_price']),
                "price_24h" => $row['base_price'],
                "price_12h" => $row['price_12_hours'],
                "adults" => $row['max_adults'],
                "children" => $row['max_children'],
                "max_guests" => $row['max_guests'],
                "size" => $row['room_size'],
                "bed_type" => $row['bed_type'],
                "beds_count" => $row['number_of_beds'],
                "amenities" => $amenities,
                "description" => $row['short_description'],
                "full_description" => $row['full_description'],
                "highlights" => $row['highlights'],
                "house_rules" => $row['house_rules'],
                "image" => $row['featured_image'] ? $baseUrl . $row['featured_image'] : '',
                "images" => array_map(function($img) use ($baseUrl) { return $baseUrl . $img; }, $gallery),
                "balcony" => (bool)$row['balcony'],
                "ac" => (bool)$row['air_conditioning'],
                "smoking" => (bool)$row['smoking_allowed']
            ];
        }

        http_response_code(200);
        echo json_encode($rooms);
    }

    // Create a new room category
    public function createCategory() {
        $data = json_decode(file_get_contents("php://input"));
        if (empty($data->name)) {
            http_response_code(400);
            echo json_encode(["message" => "Category name is required"]);
            return;
        }

        $query = "INSERT INTO room_categories (name, base_price_24h, description, amenities, adults_count, children_count) VALUES (:name, :price, :description, :amenities, :adults, :children)";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":name", $data->name);
        $price = $data->price ?? 0;
        $stmt->bindParam(":price", $price);
        $description = $data->description ?? '';
        $stmt->bindParam(":description", $description);
        $amenities = isset($data->amenities) ? json_encode($data->amenities) : '[]';
        $stmt->bindParam(":amenities", $amenities);
        $adults = $data->adults ?? 2;
        $stmt->bindParam(":adults", $adults);
        $children = $data->children ?? 0;
        $stmt->bindParam(":children", $children);

        if ($stmt->execute()) {
            $catId = $this->db->lastInsertId();
            if (!empty($data->image)) {
                $imgQuery = "INSERT INTO room_images (category_id, image_path, is_primary) VALUES (?, ?, 1)";
                $this->db->prepare($imgQuery)->execute([$catId, $data->image]);
            }
            http_response_code(201);
            echo json_encode(["message" => "Category created successfully", "id" => $catId, "title" => $data->name]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to create category"]);
        }
    }

        // Create a new room – match DB schema (category_id, no price column)
        public function create() {
            $data = json_decode(file_get_contents("php://input"));
            if (
                empty($data->room_number) ||
                empty($data->category_id) ||
                empty($data->floor) ||
                empty($data->status)
            ) {
                http_response_code(400);
                echo json_encode(["message" => "Missing required fields"]);
                return;
            }
            $query = "INSERT INTO rooms (room_number, category_id, floor, status) VALUES (:room_number, :category_id, :floor, :status)";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(":room_number", $data->room_number);
            $stmt->bindParam(":category_id", $data->category_id);
            $stmt->bindParam(":floor", $data->floor);
            $stmt->bindParam(":status", $data->status);
            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(["message" => "Room created"]);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Failed to create room"]);
            }
        }

    // Update room availability status
    public function updateStatus() {
        $data = json_decode(file_get_contents("php://input"));
        if (empty($data->room_number) || empty($data->status)) {
            http_response_code(400);
            echo json_encode(["message" => "Missing room_number or status"]);
            return;
        }
        $query = "UPDATE rooms SET status = :status WHERE room_number = :room_number";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":status", $data->status);
        $stmt->bindParam(":room_number", $data->room_number);
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(["message" => "Status updated"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to update status"]);
        }
    }


    // Fetch all rooms from rooms_new – use actual column names from the schema
    public function getAllRooms() {
        $query = "SELECT id, room_name, room_number, base_price, floor_number, status FROM rooms_new ORDER BY created_at DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $rooms = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $rooms[] = [
                'id' => $row['id'],
                'room_number' => $row['room_number'],
                'category' => $row['room_name'],
                'floor' => $row['floor_number'],
                'price' => $row['base_price'],
                'status' => strtolower($row['status']) === 'available' ? 'available' : 'occupied'
            ];
        }
        http_response_code(200);
        echo json_encode($rooms);
    }

    // Fetch a single room by ID with all details
    public function getRoomById($id) {
        $baseUrl = 'http://localhost:8001';
        $query = "SELECT * FROM rooms_new WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            // Get gallery images
            $img_query = "SELECT image_path FROM room_images_new WHERE room_id = ? ORDER BY sort_order ASC";
            $img_stmt = $this->db->prepare($img_query);
            $img_stmt->execute([$id]);
            $gallery = $img_stmt->fetchAll(PDO::FETCH_COLUMN);
            
            // Get amenities
            $amenities_query = "SELECT amenity_name FROM room_amenities WHERE room_id = ?";
            $amenities_stmt = $this->db->prepare($amenities_query);
            $amenities_stmt->execute([$id]);
            $amenities = $amenities_stmt->fetchAll(PDO::FETCH_COLUMN);

            $room = [
                "id" => $row['id'],
                "title" => $row['room_name'],
                "room_name" => $row['room_name'],
                "room_number" => $row['room_number'],
                "room_code" => $row['room_code'],
                "category_id" => $row['category_id'],
                "floor_number" => $row['floor_number'],
                "price" => "₹" . number_format($row['base_price']),
                "price_24h" => $row['base_price'],
                "price_12h" => $row['price_12_hours'],
                "weekend_price" => $row['weekend_price'],
                "festival_price" => $row['festival_price'],
                "extra_bed_price" => $row['extra_bed_price'],
                "adults" => $row['max_adults'],
                "children" => $row['max_children'],
                "max_guests" => $row['max_guests'],
                "size" => $row['room_size'],
                "bed_type" => $row['bed_type'],
                "beds_count" => $row['number_of_beds'],
                "amenities" => $amenities,
                "description" => $row['short_description'],
                "short_description" => $row['short_description'],
                "full_description" => $row['full_description'],
                "highlights" => $row['highlights'],
                "house_rules" => $row['house_rules'],
                "image" => $row['featured_image'] ? $baseUrl . $row['featured_image'] : '',
                "images" => array_map(function($img) use ($baseUrl) { return $baseUrl . $img; }, $gallery),
                "balcony" => (bool)$row['balcony'],
                "ac" => (bool)$row['air_conditioning'],
                "smoking_allowed" => (bool)$row['smoking_allowed'],
                "status" => $row['status'],
                "show_on_website" => (bool)$row['show_on_website']
            ];
            http_response_code(200);
            echo json_encode($room);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Room not found"]);
        }
    }
}

?>
