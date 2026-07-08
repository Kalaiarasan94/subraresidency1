<?php
// backend/controllers/UserController.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/db.php';

class UserController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function getUsers() {
        try {
            // Fetch Admins
            $adminStmt = $this->db->prepare("SELECT id, username, full_name, email, created_at, 'admin' as role FROM admins ORDER BY id DESC");
            $adminStmt->execute();
            $admins = $adminStmt->fetchAll(PDO::FETCH_ASSOC);

            // Fetch Receptionists
            $recepStmt = $this->db->prepare("SELECT id, username, full_name, email, created_at, 'receptionist' as role FROM reception_users ORDER BY id DESC");
            $recepStmt->execute();
            $receptionists = $recepStmt->fetchAll(PDO::FETCH_ASSOC);

            $allUsers = array_merge($admins, $receptionists);

            http_response_code(200);
            echo json_encode($allUsers);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }

    public function createUser() {
        $data = json_decode(file_get_contents("php://input"));

        if (!empty($data->username) && !empty($data->password) && !empty($data->role)) {
            try {
                $table = ($data->role === 'admin') ? 'admins' : 'reception_users';
                
                // Check if username already exists in either table to avoid conflicts
                $checkAdmin = $this->db->prepare("SELECT id FROM admins WHERE username = ?");
                $checkAdmin->execute([$data->username]);
                $checkRecep = $this->db->prepare("SELECT id FROM reception_users WHERE username = ?");
                $checkRecep->execute([$data->username]);

                if ($checkAdmin->rowCount() > 0 || $checkRecep->rowCount() > 0) {
                    http_response_code(400);
                    echo json_encode(["status" => "error", "message" => "Username already exists"]);
                    return;
                }

                $hashedPass = password_hash($data->password, PASSWORD_DEFAULT);
                $fullName = $data->fullName ?? $data->full_name ?? '';
                $email = $data->email ?? '';

                $query = "INSERT INTO " . $table . " (username, password, full_name, email) VALUES (?, ?, ?, ?)";
                $stmt = $this->db->prepare($query);
                $stmt->execute([$data->username, $hashedPass, $fullName, $email]);

                http_response_code(201);
                echo json_encode(["status" => "success", "message" => "User created successfully"]);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => $e->getMessage()]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Incomplete data. Username, password, and role are required."]);
        }
    }

    public function updateUser() {
        $data = json_decode(file_get_contents("php://input"));

        if (!empty($data->id) && !empty($data->role)) {
            try {
                $table = ($data->role === 'admin') ? 'admins' : 'reception_users';
                
                // If username is changing, ensure uniqueness
                if (!empty($data->username)) {
                    $chk1 = $this->db->prepare("SELECT id FROM admins WHERE username = ? AND (id != ? OR 'admin' != ?)");
                    $chk1->execute([$data->username, $data->id, $data->role]);
                    $chk2 = $this->db->prepare("SELECT id FROM reception_users WHERE username = ? AND (id != ? OR 'receptionist' != ?)");
                    $chk2->execute([$data->username, $data->id, $data->role]);

                    if ($chk1->rowCount() > 0 || $chk2->rowCount() > 0) {
                        http_response_code(400);
                        echo json_encode(["status" => "error", "message" => "Username already exists"]);
                        return;
                    }
                }

                $fields = [];
                $params = [];

                if (!empty($data->username)) {
                    $fields[] = "username = ?";
                    $params[] = $data->username;
                }
                if (!empty($data->password)) {
                    $fields[] = "password = ?";
                    $params[] = password_hash($data->password, PASSWORD_DEFAULT);
                }
                if (isset($data->fullName) || isset($data->full_name)) {
                    $fields[] = "full_name = ?";
                    $params[] = $data->fullName ?? $data->full_name;
                }
                if (isset($data->email)) {
                    $fields[] = "email = ?";
                    $params[] = $data->email;
                }

                if (empty($fields)) {
                    http_response_code(400);
                    echo json_encode(["status" => "error", "message" => "No fields to update"]);
                    return;
                }

                $params[] = $data->id;
                $query = "UPDATE " . $table . " SET " . implode(", ", $fields) . " WHERE id = ?";
                $stmt = $this->db->prepare($query);
                $stmt->execute($params);

                http_response_code(200);
                echo json_encode(["status" => "success", "message" => "User updated successfully"]);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => $e->getMessage()]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "User ID and role are required."]);
        }
    }

    public function deleteUser() {
        $data = json_decode(file_get_contents("php://input"));

        if (!empty($data->id) && !empty($data->role)) {
            try {
                $table = ($data->role === 'admin') ? 'admins' : 'reception_users';

                // Prevent deleting the last admin
                if ($data->role === 'admin') {
                    $cnt = $this->db->query("SELECT COUNT(*) FROM admins")->fetchColumn();
                    if ($cnt <= 1) {
                        http_response_code(400);
                        echo json_encode(["status" => "error", "message" => "Cannot delete the last admin user."]);
                        return;
                    }
                }

                $query = "DELETE FROM " . $table . " WHERE id = ?";
                $stmt = $this->db->prepare($query);
                $stmt->execute([$data->id]);

                http_response_code(200);
                echo json_encode(["status" => "success", "message" => "User deleted successfully"]);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => $e->getMessage()]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "User ID and role are required."]);
        }
    }
}
