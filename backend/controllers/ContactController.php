<?php
// backend/controllers/ContactController.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Cache-Control, cache-control, Pragma, Expires, *");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once __DIR__ . '/../config/db.php';

class ContactController {
    private $db;

    public function __construct() {
        try {
            $database = new Database();
            $this->db = $database->getConnection();
        } catch (\Throwable $t) {
            error_log("[ContactController] DB connection failed: " . $t->getMessage());
        }
    }

    public function submit() {
        // Ensure clean buffer so no PHP warnings/notices corrupt the JSON response
        if (ob_get_length()) {
            @ob_clean();
        }

        $rawInput = file_get_contents("php://input");
        $data = json_decode($rawInput, true);

        if (!is_array($data)) {
            $data = $_POST;
        }

        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $phone = trim($data['phone'] ?? '');
        $subject = trim($data['subject'] ?? 'Website Booking / General Enquiry');
        $message = trim($data['message'] ?? '');

        if (empty($name) || empty($email) || empty($message)) {
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "Please provide your name, email address, and message."
            ]);
            return;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "Please enter a valid email address."
            ]);
            return;
        }

        try {
            if (!$this->db) {
                throw new Exception("Database connection not established.");
            }

            // Ensure contact_messages table exists
            try {
                $this->db->exec("
                    CREATE TABLE IF NOT EXISTS `contact_messages` (
                        `id` INT AUTO_INCREMENT PRIMARY KEY,
                        `name` VARCHAR(100) NOT NULL,
                        `email` VARCHAR(100) NOT NULL,
                        `phone` VARCHAR(50) DEFAULT NULL,
                        `subject` VARCHAR(255) DEFAULT NULL,
                        `message` TEXT NOT NULL,
                        `status` VARCHAR(30) DEFAULT 'unread',
                        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                ");
            } catch (\Throwable $tTable) {
                // Table already exists or creation non-fatal
            }

            // Safely check if phone column exists
            try {
                $chk = $this->db->query("SHOW COLUMNS FROM `contact_messages` LIKE 'phone'");
                if ($chk && $chk->rowCount() === 0) {
                    $this->db->exec("ALTER TABLE `contact_messages` ADD COLUMN `phone` VARCHAR(50) AFTER `email`");
                }
            } catch (\Throwable $tCol) {
                // Non-fatal
            }

            // Insert the enquiry
            $stmt = $this->db->prepare("
                INSERT INTO `contact_messages` (`name`, `email`, `phone`, `subject`, `message`, `status`)
                VALUES (?, ?, ?, ?, ?, 'unread')
            ");
            $success = $stmt->execute([$name, $email, $phone, $subject, $message]);

            if (!$success) {
                throw new Exception("Could not insert message into database.");
            }

            // Attempt to dispatch non-blocking email alert to hotel management
            try {
                include_once __DIR__ . '/../utils/Mailer.php';
                if (class_exists('Mailer') && method_exists('Mailer', 'sendGenericMail')) {
                    $adminSubject = "New Website Enquiry from " . $name . " - " . $subject;
                    $adminBody = "<h3>New Guest Enquiry - Subra Residency</h3>" .
                                 "<p><strong>Guest Name:</strong> " . htmlspecialchars($name) . "</p>" .
                                 "<p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>" .
                                 "<p><strong>Phone:</strong> " . htmlspecialchars($phone) . "</p>" .
                                 "<p><strong>Subject:</strong> " . htmlspecialchars($subject) . "</p>" .
                                 "<p><strong>Message:</strong><br/>" . nl2br(htmlspecialchars($message)) . "</p>";
                    @Mailer::sendGenericMail("subraresidencykum@gmail.com", $adminSubject, $adminBody);
                }
            } catch (\Throwable $mailEx) {
                // Non-blocking mail failure: log but do not fail user submission
                error_log("[ContactController] Mail alert notice: " . $mailEx->getMessage());
            }

            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "message" => "Thank you for contacting Subra Residency. Your enquiry has been received. Our front desk team will contact you shortly."
            ]);
            return;
        } catch (\Throwable $e) {
            error_log("[ContactController] Submission exception: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Server error processing enquiry: " . $e->getMessage()
            ]);
            return;
        }
    }

    public function list() {
        if (ob_get_length()) {
            @ob_clean();
        }

        try {
            if (!$this->db) {
                throw new Exception("Database connection not established.");
            }

            $stmt = $this->db->prepare("SELECT * FROM `contact_messages` ORDER BY `created_at` DESC LIMIT 100");
            $stmt->execute();
            $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "data" => $messages ?: []
            ]);
        } catch (\Throwable $e) {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        }
    }
}
