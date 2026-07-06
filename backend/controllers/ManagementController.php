<?php
// backend/controllers/ManagementController.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . '/../config/db.php';

class ManagementController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    // GET /management/guests
    // Returns one row per unique guest (grouped by email + phone)
    public function getGuestDirectory() {
        try {
            $query = "SELECT
                        guest_name   AS name,
                        guest_email  AS email,
                        guest_phone  AS phone,
                        COUNT(*)             AS total_stays,
                        MAX(check_in_date)   AS last_visit,
                        SUM(total_amount)    AS total_spent
                      FROM bookings
                      GROUP BY guest_name, guest_email, guest_phone
                      ORDER BY last_visit DESC";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $guests = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["status" => "success", "data" => $guests]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }

    // GET /management/settlements
    // Joins payments → bookings using the STRING booking_id on bookings side
    // Note: payments.booking_id is int FK → bookings.id (auto-increment PK)
    //       but we display bookings.booking_id (the human-readable string)
    public function getSettlements() {
        try {
            $query = "SELECT
                        p.id,
                        p.transaction_id,
                        p.amount,
                        p.payment_method,
                        p.status,
                        p.payment_date,
                        b.booking_id  AS booking_ref,
                        b.guest_name
                      FROM payments p
                      LEFT JOIN bookings b ON b.id = p.booking_id
                      ORDER BY p.payment_date DESC";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["status" => "success", "data" => $payments]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }

    // GET /management/logs
    // All bookings that have a meaningful stay status; joins room number from rooms_new
    public function getStayLogs() {
        try {
            $query = "SELECT
                        b.booking_id,
                        b.guest_name,
                        b.guest_phone,
                        b.check_in_date,
                        b.check_out_date,
                        b.total_amount,
                        b.status,
                        b.payment_status,
                        b.created_at,
                        r.room_number
                      FROM bookings b
                      LEFT JOIN rooms_new r ON b.id = r.id
                      ORDER BY b.created_at DESC
                      LIMIT 100";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["status" => "success", "data" => $logs]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }
}
