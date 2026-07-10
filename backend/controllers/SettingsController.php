<?php
// backend/controllers/SettingsController.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/db.php';
include_once '../models/Settings.php';

class SettingsController {
    private $db;
    private $settings;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->settings = new Settings($this->db);
    }

    public function getAllSettings() {
        try {
            $data = $this->settings->getAll();
            http_response_code(200);
            echo json_encode($data);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["message" => "Error fetching settings", "error" => $e->getMessage()]);
        }
    }

    public function updateSettings() {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (empty($data)) {
            http_response_code(400);
            echo json_encode(["message" => "No data provided"]);
            return;
        }

        try {
            if ($this->settings->updateMultiple($data)) {
                http_response_code(200);
                echo json_encode(["message" => "Settings updated successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Failed to update some settings"]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["message" => "Error updating settings", "error" => $e->getMessage()]);
        }
    }

    public function uploadBanner() {
        $upload_dir = __DIR__ . '/../uploads/banners/';
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        include_once __DIR__ . '/../utils/ImageUploader.php';

        if (isset($_FILES['banner']) && $_FILES['banner']['error'] === UPLOAD_ERR_OK) {
            $filename = ImageUploader::saveAsWebp($_FILES['banner'], $upload_dir, 'banner');
            if ($filename) {
                $path = '/uploads/banners/' . $filename;
                $this->settings->update('popup_banner_image', $path);
                http_response_code(200);
                echo json_encode(["status" => "success", "message" => "Banner uploaded successfully", "image_path" => $path]);
                return;
            }
        }
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Failed to upload banner image"]);
    }
}
?>
