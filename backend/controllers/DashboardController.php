<?php
// backend/controllers/DashboardController.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . '/../config/db.php';

class DashboardController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function getAdminStats() {
        try {
            $today = date('Y-m-d');
            $thisMonth = date('m');
            $thisYear = date('Y');

            // 1. STATS CARDS
            $total_bookings = $this->db->query("SELECT COUNT(*) FROM bookings")->fetchColumn();
            $today_bookings = $this->db->query("SELECT COUNT(*) FROM bookings WHERE DATE(created_at) = '$today'")->fetchColumn();
            
            $today_revenue = $this->db->query("SELECT SUM(amount) FROM payments WHERE DATE(payment_date) = '$today' AND status = 'success'")->fetchColumn() ?? 0;
            $monthly_revenue = $this->db->query("SELECT SUM(amount) FROM payments WHERE MONTH(payment_date) = '$thisMonth' AND YEAR(payment_date) = '$thisYear' AND status = 'success'")->fetchColumn() ?? 0;
            
            $rooms_total = $this->db->query("SELECT COUNT(*) FROM rooms_new")->fetchColumn();
            $rooms_available = $this->db->query("SELECT COUNT(*) FROM rooms_new WHERE status = 'available'")->fetchColumn();
            $rooms_occupied = $this->db->query("SELECT COUNT(*) FROM rooms_new WHERE status = 'booked'")->fetchColumn();
            $rooms_maintenance = $this->db->query("SELECT COUNT(*) FROM rooms_new WHERE status = 'maintenance'")->fetchColumn();
            
            $confirmed_bookings = $this->db->query("SELECT COUNT(*) FROM bookings WHERE status = 'confirmed'")->fetchColumn();
            $cancelled_bookings = $this->db->query("SELECT COUNT(*) FROM bookings WHERE status = 'cancelled'")->fetchColumn();
            $pending_bookings = $this->db->query("SELECT COUNT(*) FROM bookings WHERE status = 'pending'")->fetchColumn();

            // 2. CHART DATA (Last 7 Days)
            $chart_data = [];
            for ($i = 6; $i >= 0; $i--) {
                $d = date('Y-m-d', strtotime("-$i days"));
                $label = date('D', strtotime($d));
                $count = $this->db->query("SELECT COUNT(*) FROM bookings WHERE DATE(created_at) = '$d'")->fetchColumn();
                $chart_data[] = ["day" => $label, "bookings" => (int)$count];
            }

            // 3. REVENUE SOURCES (Last 30 Days)
            $revenue_room = $monthly_revenue * 0.85;
            $revenue_tax = $monthly_revenue * 0.12;
            $revenue_others = $monthly_revenue * 0.03;

            // 4. BOOKING SOURCES
            $sources_query = $this->db->query("SELECT booking_source, COUNT(*) as count FROM bookings GROUP BY booking_source");
            $booking_sources = $sources_query->fetchAll(PDO::FETCH_ASSOC);

            // 5. RECENT BOOKINGS / TRANSACTIONS
            $recent_stmt = $this->db->query("SELECT b.booking_id, b.guest_name, b.check_in_date, b.total_amount, b.status, p.payment_method as method, p.payment_date as date 
                                             FROM bookings b 
                                             LEFT JOIN payments p ON b.booking_id = p.booking_id 
                                             ORDER BY b.created_at DESC LIMIT 5");
            $recent_bookings = $recent_stmt->fetchAll(PDO::FETCH_ASSOC);

            // 6. ROOM STATUS GRID (LIVE)
            $rooms_grid_stmt = $this->db->query("SELECT r.room_number as number, r.status, c.name as category 
                                                 FROM rooms_new r 
                                                 JOIN room_categories c ON r.category_id = c.id 
                                                 ORDER BY r.room_number ASC");
            $rooms_grid = $rooms_grid_stmt->fetchAll(PDO::FETCH_ASSOC);

            $data = [
                "stats" => [
                    "total_bookings" => (int)$total_bookings,
                    "today_bookings" => (int)$today_bookings,
                    "today_revenue" => (float)$today_revenue,
                    "monthly_revenue" => (float)$monthly_revenue,
                    "total_revenue" => $this->db->query("SELECT SUM(amount) FROM payments WHERE status = 'success'")->fetchColumn() ?? 0,
                    "total_rooms" => (int)$rooms_total,
                    "available_rooms" => (int)$rooms_available,
                    "occupied_rooms" => (int)$rooms_occupied,
                    "maintenance_rooms" => (int)$rooms_maintenance,
                    "confirmed_bookings" => (int)$confirmed_bookings,
                    "cancelled_bookings" => (int)$cancelled_bookings,
                    "pending_bookings" => (int)$pending_bookings,
                    "checked_in_bookings" => 15,
                    "checked_out_bookings" => 20
                ],
                "chart_data" => $chart_data,
                "revenue_overview" => [
                    ["name" => "Room Revenue", "value" => (float)$revenue_room],
                    ["name" => "Tax", "value" => (float)$revenue_tax],
                    ["name" => "Other Charges", "value" => (float)$revenue_others]
                ],
                "booking_sources" => $booking_sources,
                "recent_bookings" => $recent_bookings,
                "rooms_grid" => $rooms_grid
            ];

            echo json_encode(['status' => 'success', 'data' => $data]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }

    public function getReceptionistStats() {
        try {
            $today = date('Y-m-d');

            // 1. STATS
            $arrivals = $this->db->query("SELECT COUNT(*) FROM bookings WHERE DATE(check_in_date) = '$today'")->fetchColumn();
            $departures = $this->db->query("SELECT COUNT(*) FROM bookings WHERE DATE(check_out_date) = '$today'")->fetchColumn();
            $checked_in = $this->db->query("SELECT COUNT(*) FROM bookings WHERE status = 'checked-in'")->fetchColumn();
            
            $available = $this->db->query("SELECT COUNT(*) FROM rooms_new WHERE status = 'Available'")->fetchColumn();
            $occupied = $this->db->query("SELECT COUNT(*) FROM rooms_new WHERE status = 'Occupied'")->fetchColumn();
            $maintenance = $this->db->query("SELECT COUNT(*) FROM rooms_new WHERE status = 'Maintenance'")->fetchColumn();
            $total_rooms = $this->db->query("SELECT COUNT(*) FROM rooms_new")->fetchColumn();

            // 2. RECENT ONLINE BOOKINGS
            $recent_stmt = $this->db->query("SELECT booking_id, guest_name, check_in_date, room_id, status 
                                             FROM bookings 
                                             WHERE booking_source = 'Online' OR booking_source = 'Website'
                                             ORDER BY created_at DESC LIMIT 5");
            $recent_bookings = $recent_stmt->fetchAll(PDO::FETCH_ASSOC);

            // 3. ROOM DISTRIBUTION
            $room_data = [
                ["name" => "Available", "value" => (int)$available, "color" => "#10b981"],
                ["name" => "Occupied", "value" => (int)$occupied, "color" => "#0b3a24"],
                ["name" => "Maintenance", "value" => (int)$maintenance, "color" => "#f59e0b"]
            ];

            $data = [
                "stats" => [
                    "arrivals" => (int)$arrivals,
                    "departures" => (int)$departures,
                    "checked_in" => (int)$checked_in,
                    "available" => (int)$available,
                    "occupied" => (int)$occupied,
                    "total_rooms" => (int)$total_rooms
                ],
                "recent_bookings" => $recent_bookings,
                "room_distribution" => $room_data
            ];

            echo json_encode(['status' => 'success', 'data' => $data]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }
}
