<?php
// backend/controllers/RoomController.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/db.php';
include_once '../models/Room.php';
include_once '../utils/ImageUploader.php';

class RoomController {
    private $db;
    private $room;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->room = new Room($this->db);
    }

    private function getBaseUrl() {
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443)) ? "https://" : "http://";
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        $script_uri = $_SERVER['SCRIPT_NAME'] ?? '';
        $script_dir = dirname(dirname($script_uri)); 
        $script_dir = str_replace('\\', '/', $script_dir);
        $script_dir = rtrim($script_dir, '/');
        if (strpos($host, 'localhost') !== false && strpos($script_uri, '/subraresidency1') !== false) {
            return 'http://' . $host . '/subraresidency1/backend';
        }
        return $protocol . $host . $script_dir;
    }

    public function getCategories() {
        $baseUrl = $this->getBaseUrl();
        $query = "SELECT * FROM room_categories WHERE show_on_website = 1 ORDER BY created_at DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute();

        $rooms = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // Get gallery images
            $img_query = "SELECT image_path FROM room_images_new WHERE category_id = ? ORDER BY sort_order ASC";
            $img_stmt = $this->db->prepare($img_query);
            $img_stmt->execute([$row['id']]);
            $gallery = $img_stmt->fetchAll(PDO::FETCH_COLUMN);

            // Get amenities
            $amenities_query = "SELECT amenity_name FROM room_amenities WHERE category_id = ?";
            $amenities_stmt = $this->db->prepare($amenities_query);
            $amenities_stmt->execute([$row['id']]);
            $amenities = $amenities_stmt->fetchAll(PDO::FETCH_COLUMN);

            // Sub-room counts: total physical rooms vs currently free (no active/pending booking, not in maintenance)
            $total_stmt = $this->db->prepare("SELECT COUNT(*) FROM rooms_new WHERE category_id = ? AND status != 'Inactive'");
            $total_stmt->execute([$row['id']]);
            $total_rooms = (int)$total_stmt->fetchColumn();

            $avail_stmt = $this->db->prepare("
                SELECT COUNT(*) FROM rooms_new r
                WHERE r.category_id = ? AND r.status = 'Available'
                  AND r.id NOT IN (
                      SELECT br.room_id FROM booking_rooms br
                      JOIN bookings b ON b.id = br.booking_id
                      WHERE b.status IN ('confirmed', 'checked-in')
                  )
            ");
            $avail_stmt->execute([$row['id']]);
            $available_rooms = (int)$avail_stmt->fetchColumn();

            $rooms[] = [
                "id" => $row['id'],
                "title" => $row['name'],
                "price" => "₹" . number_format($row['base_price_24h']),
                "price_24h" => $row['base_price_24h'],
                "price_12h" => $row['base_price_12h'],
                "adults" => $row['adults_count'],
                "children" => $row['children_count'],
                "max_guests" => $row['max_guests'],
                "size" => $row['room_size'],
                "floor" => $row['floor_number'] ?? '3',
                "floor_number" => $row['floor_number'] ?? '3',
                "bed_type" => $row['bed_type'],
                "beds_count" => $row['number_of_beds'],
                "amenities" => $amenities,
                "description" => $row['description'],
                "full_description" => $row['full_description'],
                "highlights" => $row['highlights'],
                "house_rules" => $row['house_rules'],
                "image" => $row['featured_image'] ? $baseUrl . $row['featured_image'] : '',
                "images" => array_map(function($img) use ($baseUrl) { return $baseUrl . $img; }, $gallery),
                "balcony" => (bool)$row['balcony'],
                "ac" => (bool)$row['air_conditioning'],
                "smoking" => (bool)$row['smoking_allowed'],
                "show_on_website" => (bool)$row['show_on_website'],
                "status" => $row['status'],
                "maintenance_start" => $row['maintenance_start'],
                "maintenance_end" => $row['maintenance_end'],
                "total_rooms" => $total_rooms,
                "available_rooms" => $available_rooms,
                "fully_booked" => $available_rooms === 0
            ];
        }

        http_response_code(200);
        echo json_encode($rooms);
    }

    // Create a new room category, plus its physical sub-rooms
    public function createCategory() {
        $data = json_decode(file_get_contents("php://input"));
        if (empty($data->name)) {
            http_response_code(400);
            echo json_encode(["message" => "Category name is required"]);
            return;
        }
        $roomNumbers = isset($data->room_numbers) && is_array($data->room_numbers) ? $data->room_numbers : [];

        try {
            $this->db->beginTransaction();

            $query = "INSERT INTO room_categories
                (name, description, base_price_12h, base_price_24h, adults_count, children_count, room_size,
                 featured_image, full_description, highlights, house_rules, bed_type, number_of_beds,
                 balcony, air_conditioning, smoking_allowed, max_guests, show_on_website, status, sub_room_count)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $this->db->prepare($query);
            $stmt->execute([
                $data->name,
                $data->description ?? '',
                $data->price_12h ?? null,
                $data->price_24h ?? ($data->price ?? 0),
                $data->adults ?? 2,
                $data->children ?? 0,
                $data->room_size ?? null,
                $data->featured_image ?? null,
                $data->full_description ?? null,
                $data->highlights ?? null,
                $data->house_rules ?? null,
                $data->bed_type ?? null,
                $data->number_of_beds ?? null,
                !empty($data->balcony) ? 1 : 0,
                isset($data->air_conditioning) ? (!empty($data->air_conditioning) ? 1 : 0) : 1,
                !empty($data->smoking_allowed) ? 1 : 0,
                $data->max_guests ?? null,
                isset($data->show_on_website) ? (!empty($data->show_on_website) ? 1 : 0) : 1,
                'Available',
                count($roomNumbers) ?: 5,
            ]);
            $catId = $this->db->lastInsertId();

            if (!empty($data->amenities)) {
                $amenities = is_array($data->amenities) ? $data->amenities : explode(',', $data->amenities);
                $stmt_amenity = $this->db->prepare("INSERT INTO room_amenities (category_id, amenity_name) VALUES (?, ?)");
                foreach ($amenities as $amenity) {
                    if (trim($amenity)) $stmt_amenity->execute([$catId, trim($amenity)]);
                }
            }

            $insertRoom = $this->db->prepare("INSERT INTO rooms_new (room_name, room_number, category_id, floor_number, status) VALUES (?, ?, ?, ?, 'Available')");
            foreach ($roomNumbers as $roomNumber) {
                $roomNumber = trim($roomNumber);
                if ($roomNumber === '') continue;
                $insertRoom->execute([$data->name, $roomNumber, $catId, $data->floor_number ?? null]);
            }

            $this->db->commit();
            http_response_code(201);
            echo json_encode(["message" => "Category created successfully", "id" => $catId, "title" => $data->name]);
        } catch (Exception $e) {
            if ($this->db->inTransaction()) $this->db->rollBack();
            http_response_code(500);
            echo json_encode(["message" => "Failed to create category: " . $e->getMessage()]);
        }
    }

    // List each physical sub-room under a category, with live status and (if occupied) the current guest
    public function getSubRooms($categoryId) {
        if (!$categoryId) {
            http_response_code(400);
            echo json_encode(["message" => "category_id is required"]);
            return;
        }
        $query = "
            SELECT r.id, r.room_number, r.room_name, r.floor_number, r.status,
                   b.guest_name, b.check_in_date, b.check_out_date, b.booking_id
            FROM rooms_new r
            LEFT JOIN (
                SELECT br2.room_id, b2.guest_name, b2.check_in_date, b2.check_out_date, b2.id as booking_id
                FROM booking_rooms br2
                JOIN bookings b2 ON b2.id = br2.booking_id
                WHERE b2.status IN ('confirmed', 'checked-in')
                  AND CURDATE() >= b2.check_in_date 
                  AND CURDATE() < b2.check_out_date
            ) b ON b.room_id = r.id
            WHERE r.category_id = ?
            ORDER BY r.room_number ASC
        ";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$categoryId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode(["status" => "success", "rooms" => $rows]);
    }

    public function addSubRoom() {
        try {
            $data = json_decode(file_get_contents('php://input'));
            if (!isset($data->category_id) || !isset($data->room_number)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "category_id and room_number are required."]);
                return;
            }
            
            // Get category name
            $stmt = $this->db->prepare("SELECT name FROM room_categories WHERE id = ?");
            $stmt->execute([$data->category_id]);
            $cat = $stmt->fetch(PDO::FETCH_ASSOC);
            $roomName = isset($data->room_name) && trim($data->room_name) !== '' ? trim($data->room_name) : ($cat ? $cat['name'] : 'Room');

            $floor = $data->floor_number ?? '1';
            
            $insert = $this->db->prepare("
                INSERT INTO rooms_new (room_name, room_number, category_id, floor_number, status)
                VALUES (?, ?, ?, ?, 'Available')
            ");
            $insert->execute([$roomName, $data->room_number, $data->category_id, $floor]);

            // Sync sub_room_count in room_categories
            $updateCount = $this->db->prepare("
                UPDATE room_categories rc
                SET sub_room_count = (SELECT COUNT(*) FROM rooms_new WHERE category_id = rc.id AND status != 'Inactive')
                WHERE rc.id = ?
            ");
            $updateCount->execute([$data->category_id]);
            
            echo json_encode(["status" => "success", "message" => "Sub-room added successfully."]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }

    public function updateSubRoom() {
        try {
            $data = json_decode(file_get_contents('php://input'));
            if (!isset($data->id) || !isset($data->room_number)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "id and room_number are required."]);
                return;
            }
            
            $floor = $data->floor_number ?? '1';
            $roomName = isset($data->room_name) ? trim($data->room_name) : null;
            
            if ($roomName !== null && $roomName !== '') {
                $update = $this->db->prepare("
                    UPDATE rooms_new 
                    SET room_number = ?, floor_number = ?, room_name = ?
                    WHERE id = ?
                ");
                $update->execute([$data->room_number, $floor, $roomName, $data->id]);
            } else {
                $update = $this->db->prepare("
                    UPDATE rooms_new 
                    SET room_number = ?, floor_number = ?
                    WHERE id = ?
                ");
                $update->execute([$data->room_number, $floor, $data->id]);
            }
            
            echo json_encode(["status" => "success", "message" => "Sub-room updated successfully."]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }

    public function deleteSubRoom() {
        try {
            $data = json_decode(file_get_contents('php://input'));
            $id = $data->id ?? $_GET['id'] ?? null;
            if (!$id) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "id is required."]);
                return;
            }
            
            // Get category_id before deletion to sync count
            $getCat = $this->db->prepare("SELECT category_id FROM rooms_new WHERE id = ?");
            $getCat->execute([$id]);
            $catId = $getCat->fetchColumn();

            $delete = $this->db->prepare("DELETE FROM rooms_new WHERE id = ?");
            $delete->execute([$id]);

            if ($catId) {
                // Sync sub_room_count in room_categories
                $updateCount = $this->db->prepare("
                    UPDATE room_categories rc
                    SET sub_room_count = (SELECT COUNT(*) FROM rooms_new WHERE category_id = rc.id AND status != 'Inactive')
                    WHERE rc.id = ?
                ");
                $updateCount->execute([$catId]);
            }
            
            echo json_encode(["status" => "success", "message" => "Sub-room deleted successfully."]);
        } catch (Exception $e) {
            if (strpos($e->getMessage(), 'a foreign key constraint fails') !== false) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Cannot delete room number because it is associated with existing bookings or transactions."]);
            } else {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => $e->getMessage()]);
            }
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


    // Fetch all physical sub-rooms from rooms_new, joined to their category
    public function getAllRooms() {
        $query = "
            SELECT r.id, r.room_name, r.room_number, r.floor_number, r.status,
                   r.category_id, c.name AS category_name, c.base_price_24h
            FROM rooms_new r
            LEFT JOIN room_categories c ON c.id = r.category_id
            ORDER BY r.category_id ASC, r.room_number ASC
        ";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $rooms = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $rooms[] = [
                'id' => $row['id'],
                'room_number' => $row['room_number'],
                'category_id' => $row['category_id'],
                'category_name' => $row['category_name'],
                'category' => $row['category_name'],
                'title' => $row['category_name'],
                'floor' => $row['floor_number'],
                'price' => $row['base_price_24h'],
                'status' => strtolower($row['status']) === 'available' ? 'available' : 'occupied'
            ];
        }
        http_response_code(200);
        echo json_encode($rooms);
    }

    // Fetch a single room by ID with all details
    public function getRoomById($id) {
        $baseUrl = $this->getBaseUrl();
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
                "maintenance_start" => $row['maintenance_start'],
                "maintenance_end" => $row['maintenance_end'],
                "show_on_website" => (bool)$row['show_on_website']
            ];
            http_response_code(200);
            echo json_encode($room);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Room not found"]);
        }
    }

    // Update a category's details in room_categories (id here is a category id —
    // AdminRoomDetailView.tsx edits the category, not an individual physical sub-room)
    public function updateRoomDetails() {
        $data = json_decode(file_get_contents("php://input"));
        if (empty($data->id)) {
            http_response_code(400);
            echo json_encode(["message" => "Category ID is required"]);
            return;
        }

        $id = $data->id;
        $fields = [];
        $params = [];

        // Map incoming fields to room_categories columns
        $map = [
            'room_name' => 'name',
            'base_price' => 'base_price_24h',
            'full_description' => 'full_description',
            'short_description' => 'description',
            'house_rules' => 'house_rules',
            'status' => 'status',
            'max_adults' => 'adults_count',
            'max_children' => 'children_count',
            'floor_number' => 'floor_number',
            'bed_type' => 'bed_type',
            'room_size' => 'room_size',
            'featured_image' => 'featured_image',
            'maintenance_start' => 'maintenance_start',
            'maintenance_end' => 'maintenance_end'
        ];

        foreach ($map as $apiKey => $dbCol) {
            if (property_exists($data, $apiKey)) {
                $val = $data->$apiKey;
                if ($val === '') $val = null;
                $fields[] = "$dbCol = :$apiKey";
                $params[":$apiKey"] = $val;
            }
        }

        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(["message" => "No fields to update"]);
            return;
        }

        $query = "UPDATE room_categories SET " . implode(', ', $fields) . " WHERE id = :id";
        $params[':id'] = $id;

        $stmt = $this->db->prepare($query);
        if ($stmt->execute($params)) {
            // Keep every physical sub-room's denormalized room_name in sync
            if (isset($data->room_name)) {
                $this->db->prepare("UPDATE rooms_new SET room_name = ? WHERE category_id = ?")->execute([$data->room_name, $id]);
            }
            // Propagate status and maintenance dates to subrooms
            if (isset($data->status)) {
                if ($data->status === 'Maintenance') {
                    $m_start = isset($data->maintenance_start) && $data->maintenance_start !== '' ? $data->maintenance_start : null;
                    $m_end = isset($data->maintenance_end) && $data->maintenance_end !== '' ? $data->maintenance_end : null;
                    $this->db->prepare("UPDATE rooms_new SET status = 'Maintenance', maintenance_start = ?, maintenance_end = ? WHERE category_id = ?")->execute([$m_start, $m_end, $id]);
                } else {
                    $this->db->prepare("UPDATE rooms_new SET status = ?, maintenance_start = NULL, maintenance_end = NULL WHERE category_id = ?")->execute([$data->status, $id]);
                }
            }
            if (isset($data->amenities)) {
                $this->db->prepare("DELETE FROM room_amenities WHERE category_id = ?")->execute([$id]);
                $amenities = is_array($data->amenities) ? $data->amenities : (is_string($data->amenities) ? explode(',', $data->amenities) : []);
                $stmt_amenity = $this->db->prepare("INSERT INTO room_amenities (category_id, amenity_name) VALUES (?, ?)");
                foreach ($amenities as $amenity) {
                    if (trim($amenity)) {
                        $stmt_amenity->execute([$id, trim($amenity)]);
                    }
                }
            }
            http_response_code(200);
            echo json_encode(["message" => "Category updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to update category"]);
        }
    }

    public function uploadGalleryImage() {
        // Ensure uploads directory exists
        $upload_dir = __DIR__ . '/../uploads/rooms/';
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        // AdminRoomDetailView.tsx sends the category id under the "room_id" field name
        $category_id = $_POST['room_id'] ?? null;
        if (!$category_id) {
            http_response_code(400);
            echo json_encode(["message" => "Category ID is required"]);
            return;
        }

        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $filename = ImageUploader::saveAsWebp($_FILES['image'], $upload_dir, 'gallery');

            if ($filename) {
                $path = '/uploads/rooms/' . $filename;
                $sort_stmt = $this->db->prepare("SELECT MAX(sort_order) FROM room_images_new WHERE category_id = ?");
                $sort_stmt->execute([$category_id]);
                $max_sort = (int)$sort_stmt->fetchColumn();
                $sort_order = $max_sort + 10;

                $query = "INSERT INTO room_images_new (category_id, image_path, sort_order) VALUES (?, ?, ?)";
                $stmt = $this->db->prepare($query);
                if ($stmt->execute([$category_id, $path, $sort_order])) {
                    http_response_code(200);
                    echo json_encode(["message" => "Image uploaded successfully", "image_path" => $path]);
                    return;
                }
            }
        }

        http_response_code(500);
        echo json_encode(["message" => "Failed to upload image"]);
    }

    public function deleteGalleryImage() {
        $data = json_decode(file_get_contents("php://input"));
        // AdminRoomDetailView.tsx sends the category id under the "room_id" field name
        $category_id = $data->room_id ?? null;
        $image_path = $data->image_path ?? null;

        if (!$category_id || !$image_path) {
            http_response_code(400);
            echo json_encode(["message" => "Category ID and image path are required"]);
            return;
        }

        $clean_path = str_replace('http://localhost:8001', '', $image_path);
        $clean_path = preg_replace('/https?:\/\/[^\/]+/i', '', $clean_path); // Remove proto + host
        $clean_path = preg_replace('/^\/subraresidency1\/backend/i', '', $clean_path); // Remove subfolders prefix if present

        $query = "DELETE FROM room_images_new WHERE category_id = ? AND image_path = ?";
        $stmt = $this->db->prepare($query);
        if ($stmt->execute([$category_id, $clean_path])) {
            $file_path = __DIR__ . '/../..' . $clean_path;
            if (file_exists($file_path)) {
                unlink($file_path);
            }
            http_response_code(200);
            echo json_encode(["message" => "Image deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to delete image"]);
        }
    }
}

?>
