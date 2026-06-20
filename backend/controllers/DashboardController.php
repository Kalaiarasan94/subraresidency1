<?php
// backend/controllers/DashboardController.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/db.php';

class DashboardController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function getAdminStats() {
        try {
            // Total Bookings
            $total_bookings = $this->db->query("SELECT COUNT(*) FROM bookings")->fetchColumn();
            // Today's Bookings
            $today = date('Y-m-d');
            $today_bookings = $this->db->query("SELECT COUNT(*) FROM bookings WHERE DATE(created_at) = '$today'")->fetchColumn();
            // Today's Revenue
            $today_revenue = $this->db->query("SELECT SUM(amount) FROM payments WHERE DATE(payment_date) = '$today'")->fetchColumn() ?? 0;
            // Monthly Revenue
            $month = date('m');
            $year = date('Y');
            $monthly_revenue = $this->db->query("SELECT SUM(amount) FROM payments WHERE MONTH(payment_date) = '$month' AND YEAR(payment_date) = '$year'")->fetchColumn() ?? 0;
            // Room status counts
            $rooms_total = $this->db->query("SELECT COUNT(*) FROM rooms")->fetchColumn();
            $rooms_available = $this->db->query("SELECT COUNT(*) FROM rooms WHERE status = 'available'")->fetchColumn();
            $rooms_occupied = $this->db->query("SELECT COUNT(*) FROM rooms WHERE status = 'occupied'")->fetchColumn();
            $data = [
                "total_bookings" => $total_bookings,
                "today_bookings" => $today_bookings,
                "today_revenue" => "₹" . number_format($today_revenue),
                "monthly_revenue" => "₹" . number_format($monthly_revenue),
                "total_rooms" => $rooms_total,
                "available_rooms" => $rooms_available,
                "occupied_rooms" => $rooms_occupied,
                "cancelled_bookings" => 0
            ];
            http_response_code(200);
            echo json_encode($data);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
    }
}
?>
