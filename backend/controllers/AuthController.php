<?php
// backend/controllers/AuthController.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../config/db.php';

class AuthController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function login($user_type) {
        $data = json_decode(file_get_contents("php://input"));

        if (!empty($data->username) && !empty($data->password)) {
            $table = ($user_type == 'admin') ? 'admins' : 'reception_users';
            
            $query = "SELECT id, username, password, full_name FROM " . $table . " WHERE username = ?";
            $stmt = $this->db->prepare($query);
            $stmt->execute([$data->username]);
            
            if ($stmt->rowCount() > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if (password_verify($data->password, $row['password'])) {
                    // Success - In a real app we'd generate a JWT here
                    http_response_code(200);
                    echo json_encode(array(
                        "status" => "success",
                        "message" => "Login successful",
                        "user" => array(
                            "id" => $row['id'],
                            "username" => $row['username'],
                            "full_name" => $row['full_name'],
                            "role" => $user_type
                        )
                    ));
                } else {
                    http_response_code(401);
                    echo json_encode(array("status" => "error", "message" => "Invalid credentials"));
                }
            } else {
                http_response_code(401);
                echo json_encode(array("status" => "error", "message" => "User not found"));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("status" => "error", "message" => "Data incomplete"));
        }
    }
}
?>
