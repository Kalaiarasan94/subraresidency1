<?php
// backend/controllers/AttractionController.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . '/../config/db.php';
include_once __DIR__ . '/../utils/ImageUploader.php';

class AttractionController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    private function getBaseUrl() {
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        $host = $_SERVER['HTTP_HOST'];
        $script_name = $_SERVER['SCRIPT_NAME'];
        $script_dir = dirname(dirname($script_name));
        if ($script_dir === '/' || $script_dir === '\\') {
            $script_dir = '';
        }
        return $protocol . $host . $script_dir;
    }

    public function list() {
        try {
            $baseUrl = $this->getBaseUrl();
            $query = "SELECT * FROM attractions ORDER BY sort_order ASC, created_at DESC";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $attractions = [];
            foreach ($rows as $row) {
                $image = $row['image_path'];
                if ($image && !preg_match('/^https?:\/\//i', $image)) {
                    $image = $baseUrl . $image;
                }
                $attractions[] = [
                    'id' => $row['id'],
                    'name' => $row['name'],
                    'dist' => $row['distance'],
                    'mode' => $row['mode'],
                    'timing' => $row['timing'],
                    'dressCode' => $row['dress_code'],
                    'specialFor' => $row['special_for'],
                    'desc' => $row['description'],
                    'guestNote' => $row['guest_note'],
                    'image' => $image,
                    'image_path' => $row['image_path'],
                    'sort_order' => $row['sort_order']
                ];
            }

            http_response_code(200);
            echo json_encode(["status" => "success", "attractions" => $attractions]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }

    public function create() {
        try {
            $data = json_decode(file_get_contents("php://input"));
            if (empty($data->name)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Name is required."]);
                return;
            }

            $query = "INSERT INTO attractions (name, distance, mode, timing, dress_code, special_for, description, guest_note, image_path, sort_order) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $this->db->prepare($query);
            $stmt->execute([
                $data->name,
                $data->distance ?? '',
                $data->mode ?? '',
                $data->timing ?? '',
                $data->dress_code ?? '',
                $data->special_for ?? '',
                $data->description ?? '',
                $data->guest_note ?? '',
                $data->image_path ?? '',
                (int)($data->sort_order ?? 0)
            ]);

            http_response_code(201);
            echo json_encode(["status" => "success", "message" => "Attraction created successfully.", "id" => $this->db->lastInsertId()]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }

    public function update() {
        try {
            $data = json_decode(file_get_contents("php://input"));
            if (empty($data->id) || empty($data->name)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "ID and Name are required."]);
                return;
            }

            $query = "UPDATE attractions SET name = ?, distance = ?, mode = ?, timing = ?, dress_code = ?, special_for = ?, description = ?, guest_note = ?, image_path = ?, sort_order = ? 
                      WHERE id = ?";
            $stmt = $this->db->prepare($query);
            $stmt->execute([
                $data->name,
                $data->distance ?? '',
                $data->mode ?? '',
                $data->timing ?? '',
                $data->dress_code ?? '',
                $data->special_for ?? '',
                $data->description ?? '',
                $data->guest_note ?? '',
                $data->image_path ?? '',
                (int)($data->sort_order ?? 0),
                $data->id
            ]);

            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Attraction updated successfully."]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }

    public function delete() {
        try {
            $data = json_decode(file_get_contents("php://input"));
            $id = $data->id ?? $_GET['id'] ?? null;
            if (!$id) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "ID is required."]);
                return;
            }

            $query = "DELETE FROM attractions WHERE id = ?";
            $stmt = $this->db->prepare($query);
            $stmt->execute([$id]);

            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Attraction deleted successfully."]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }

    public function uploadImage() {
        $upload_dir = __DIR__ . '/../uploads/attractions/';
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $filename = ImageUploader::saveAsWebp($_FILES['image'], $upload_dir, 'attraction');
            if ($filename) {
                $path = '/uploads/attractions/' . $filename;
                http_response_code(200);
                echo json_encode(["status" => "success", "image_path" => $path]);
                return;
            }
        }
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Failed to upload attraction image."]);
    }
}
?>
