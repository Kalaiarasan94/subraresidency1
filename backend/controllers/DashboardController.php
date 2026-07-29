<?php
// backend/controllers/DashboardController.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . '/../config/db.php';

class DashboardController
{
    private $db;

    public function __construct()
    {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function getAdminStats()
    {
        try {
            $today = date('Y-m-d');
            $thisMonth = date('m');
            $thisYear = date('Y');

            // 0. Auto-healing database synchronization
            $this->db->prepare("
                UPDATE bookings 
                SET status = 'checked-out' 
                WHERE status = 'checked-in' AND check_out_date < ?
            ")->execute([$today]);

            $this->db->prepare("
                UPDATE bookings 
                SET status = 'confirmed' 
                WHERE status = 'checked-in' AND check_in_date > ?
            ")->execute([$today]);

            $this->db->prepare("
                UPDATE rooms_new r 
                SET r.status = 'Occupied'
                WHERE r.status != 'Occupied' AND r.status NOT IN ('Maintenance', 'Inactive')
                AND r.id IN (
                    SELECT br.room_id FROM booking_rooms br
                    JOIN bookings b ON b.id = br.booking_id
                    WHERE b.status = 'checked-in'
                )
            ")->execute();

            $this->db->prepare("
                UPDATE rooms_new r 
                SET r.status = 'Available'
                WHERE r.status = 'Occupied'
                AND r.id NOT IN (
                    SELECT br.room_id FROM booking_rooms br
                    JOIN bookings b ON b.id = br.booking_id
                    WHERE b.status = 'checked-in'
                )
            ")->execute();

            // 1. STATS CARDS
            $total_bookings = $this->db->query("SELECT COUNT(*) FROM bookings")->fetchColumn();
            $today_bookings = $this->db->query("SELECT COUNT(*) FROM bookings WHERE DATE(created_at) = '$today'")->fetchColumn();

            $today_revenue = $this->db->query("SELECT SUM(amount) FROM payments WHERE DATE(payment_date) = '$today' AND status = 'success'")->fetchColumn() ?? 0;
            $monthly_revenue = $this->db->query("SELECT SUM(amount) FROM payments WHERE MONTH(payment_date) = '$thisMonth' AND YEAR(payment_date) = '$thisYear' AND status = 'success'")->fetchColumn() ?? 0;

            $rooms_total = $this->db->query("SELECT COUNT(*) FROM rooms_new")->fetchColumn();
            $rooms_available = $this->db->query("SELECT COUNT(*) FROM rooms_new WHERE status = 'Available'")->fetchColumn();
            $rooms_occupied = $this->db->query("SELECT COUNT(*) FROM rooms_new WHERE status = 'Occupied'")->fetchColumn();
            $rooms_maintenance = $this->db->query("SELECT COUNT(*) FROM rooms_new WHERE status = 'Maintenance'")->fetchColumn();

            $confirmed_bookings = $this->db->query("SELECT COUNT(*) FROM bookings WHERE status = 'confirmed'")->fetchColumn();
            $cancelled_bookings = $this->db->query("SELECT COUNT(*) FROM bookings WHERE status = 'cancelled'")->fetchColumn();
            $pending_bookings = $this->db->query("SELECT COUNT(*) FROM bookings WHERE status = 'pending'")->fetchColumn();
            $checked_in_bookings = $this->db->query("SELECT COUNT(*) FROM bookings WHERE status = 'checked-in'")->fetchColumn();
            $checked_out_bookings = $this->db->query("SELECT COUNT(*) FROM bookings WHERE status = 'checked-out'")->fetchColumn();

            // 2. CHART DATA (Last 7 Days)
            $chart_data = [];
            for ($i = 6; $i >= 0; $i--) {
                $d = date('Y-m-d', strtotime("-$i days"));
                $label = date('D', strtotime($d));
                $count = $this->db->query("SELECT COUNT(*) FROM bookings WHERE DATE(created_at) = '$d' AND status != 'pending'")->fetchColumn();
                $chart_data[] = ["day" => $label, "bookings" => (int) $count];
            }

            // 3. REVENUE SOURCES (Last 30 Days)
            $revenue_room = $monthly_revenue * 0.85;
            $revenue_tax = $monthly_revenue * 0.12;
            $revenue_others = $monthly_revenue * 0.03;

            // 4. BOOKING SOURCES
            $sources_query = $this->db->query("SELECT booking_source, COUNT(*) as count FROM bookings WHERE status != 'pending' GROUP BY booking_source");
            $booking_sources = $sources_query->fetchAll(PDO::FETCH_ASSOC);

            // Calculate dynamic payment method breakdown
            $pm_stmt = $this->db->query("
                SELECT payment_method, SUM(amount) as total_amount 
                FROM payments 
                WHERE status = 'success' 
                GROUP BY payment_method
            ");
            $payment_methods_raw = $pm_stmt->fetchAll(PDO::FETCH_ASSOC);

            $payment_methods = [];
            $method_totals = [];
            $total_paid = 0;
            foreach ($payment_methods_raw as $pm) {
                $method = trim($pm['payment_method']);
                $amount = (float) $pm['total_amount'];
                if ($method === '') continue;
                
                // Normalize names
                if (strcasecmp($method, 'razorpay') === 0) {
                    $norm = 'Razorpay';
                } else if (strcasecmp($method, 'cash') === 0) {
                    $norm = 'Cash';
                } else if (strcasecmp($method, 'upi') === 0) {
                    $norm = 'UPI';
                } else {
                    $norm = ucfirst($method);
                }
                
                if (!isset($method_totals[$norm])) {
                    $method_totals[$norm] = 0;
                }
                $method_totals[$norm] += $amount;
                $total_paid += $amount;
            }

            foreach ($method_totals as $method => $amount) {
                $payment_methods[] = [
                    "method" => $method,
                    "amount" => $amount,
                    "percentage" => $total_paid > 0 ? round(($amount / $total_paid) * 100, 1) : 0
                ];
            }

            // 5. RECENT BOOKINGS / TRANSACTIONS
            $recent_stmt = $this->db->query("SELECT b.booking_id, b.guest_name, b.check_in_date, b.total_amount, b.status, p.payment_method as method, p.payment_date as date 
                                             FROM bookings b 
                                             LEFT JOIN payments p ON b.id = p.booking_id AND p.status = 'success'
                                             WHERE b.status != 'pending'
                                             ORDER BY b.created_at DESC LIMIT 5");
            $recent_bookings = $recent_stmt->fetchAll(PDO::FETCH_ASSOC);

            // 6. ROOM STATUS GRID (LIVE)
            $rooms_grid_stmt = $this->db->query("SELECT r.room_number as number, r.status, c.name as category 
                                                 FROM rooms_new r 
                                                 JOIN room_categories c ON r.category_id = c.id 
                                                 ORDER BY r.room_number ASC");
            $rooms_grid = $rooms_grid_stmt->fetchAll(PDO::FETCH_ASSOC);

            // 7. DETAIL LISTS FOR OVERVIEW MODALS
            // Today's Bookings list
            $today_bookings_stmt = $this->db->prepare("
                SELECT b.booking_id, b.guest_name, b.check_in_date, b.check_out_date, b.total_amount, b.status
                FROM bookings b
                WHERE DATE(b.created_at) = ?
                ORDER BY b.created_at DESC
            ");
            $today_bookings_stmt->execute([$today]);
            $today_bookings_list = $today_bookings_stmt->fetchAll(PDO::FETCH_ASSOC);

            // Today's Revenue list
            $today_revenue_stmt = $this->db->prepare("
                SELECT p.transaction_id, p.amount, p.payment_method, p.payment_date, b.booking_id, b.guest_name
                FROM payments p
                LEFT JOIN bookings b ON b.id = p.booking_id
                WHERE DATE(p.payment_date) = ? AND p.status = 'success'
                ORDER BY p.payment_date DESC
            ");
            $today_revenue_stmt->execute([$today]);
            $today_revenue_list = $today_revenue_stmt->fetchAll(PDO::FETCH_ASSOC);

            // Available Rooms list
            $av_stmt = $this->db->prepare("
                SELECT r.room_number, r.room_name, rc.name AS category_name, r.status
                FROM rooms_new r
                LEFT JOIN room_categories rc ON rc.id = r.category_id
                WHERE r.status = 'Available'
                ORDER BY r.room_number ASC
            ");
            $av_stmt->execute();
            $available_rooms_list = $av_stmt->fetchAll(PDO::FETCH_ASSOC);

            // Occupied Rooms list
            $oc_stmt = $this->db->prepare("
                SELECT r.room_number, r.room_name, rc.name AS category_name,
                       (SELECT b.guest_name FROM bookings b 
                        JOIN booking_rooms br ON br.booking_id = b.id 
                        WHERE br.room_id = r.id AND b.status = 'checked-in' LIMIT 1) AS guest_name,
                       (SELECT b.check_in_date FROM bookings b 
                        JOIN booking_rooms br ON br.booking_id = b.id 
                        WHERE br.room_id = r.id AND b.status = 'checked-in' LIMIT 1) AS check_in_date,
                       (SELECT b.check_out_date FROM bookings b 
                        JOIN booking_rooms br ON br.booking_id = b.id 
                        WHERE br.room_id = r.id AND b.status = 'checked-in' LIMIT 1) AS check_out_date
                FROM rooms_new r
                LEFT JOIN room_categories rc ON rc.id = r.category_id
                WHERE r.status = 'Occupied'
                ORDER BY r.room_number ASC
            ");
            $oc_stmt->execute();
            $occupied_rooms_list = $oc_stmt->fetchAll(PDO::FETCH_ASSOC);

            $data = [
                "stats" => [
                    "total_bookings" => (int) $total_bookings,
                    "today_bookings" => (int) $today_bookings,
                    "today_revenue" => (float) $today_revenue,
                    "monthly_revenue" => (float) $monthly_revenue,
                    "total_revenue" => $this->db->query("SELECT SUM(amount) FROM payments WHERE status = 'success'")->fetchColumn() ?? 0,
                    "total_rooms" => (int) $rooms_total,
                    "available_rooms" => (int) $rooms_available,
                    "occupied_rooms" => (int) $rooms_occupied,
                    "maintenance_rooms" => (int) $rooms_maintenance,
                    "confirmed_bookings" => (int) $confirmed_bookings,
                    "cancelled_bookings" => (int) $cancelled_bookings,
                    "pending_bookings" => (int) $pending_bookings,
                    "checked_in_bookings" => (int) $checked_in_bookings,
                    "checked_out_bookings" => (int) $checked_out_bookings
                ],
                "chart_data" => $chart_data,
                "revenue_overview" => [
                    ["name" => "Room Revenue", "value" => (float) $revenue_room],
                    ["name" => "Tax", "value" => (float) $revenue_tax],
                    ["name" => "Other Charges", "value" => (float) $revenue_others]
                ],
                "booking_sources" => $booking_sources,
                "payment_methods" => $payment_methods,
                "recent_bookings" => $recent_bookings,
                "rooms_grid" => $rooms_grid,
                "today_bookings_list" => $today_bookings_list,
                "today_revenue_list" => $today_revenue_list,
                "available_rooms_list" => $available_rooms_list,
                "occupied_rooms_list" => $occupied_rooms_list
            ];

            echo json_encode(['status' => 'success', 'data' => $data]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }

    public function getReceptionistStats()
    {
        try {
            $today = date('Y-m-d');

            // 0. Auto-healing database synchronization
            $this->db->prepare("
                UPDATE bookings 
                SET status = 'checked-out' 
                WHERE status = 'checked-in' AND check_out_date < ?
            ")->execute([$today]);

            $this->db->prepare("
                UPDATE bookings 
                SET status = 'confirmed' 
                WHERE status = 'checked-in' AND check_in_date > ?
            ")->execute([$today]);

            $this->db->prepare("
                UPDATE rooms_new r 
                SET r.status = 'Occupied'
                WHERE r.status != 'Occupied' AND r.status NOT IN ('Maintenance', 'Inactive')
                AND r.id IN (
                    SELECT br.room_id FROM booking_rooms br
                    JOIN bookings b ON b.id = br.booking_id
                    WHERE b.status = 'checked-in'
                )
            ")->execute();

            $this->db->prepare("
                UPDATE rooms_new r 
                SET r.status = 'Available'
                WHERE r.status = 'Occupied'
                AND r.id NOT IN (
                    SELECT br.room_id FROM booking_rooms br
                    JOIN bookings b ON b.id = br.booking_id
                    WHERE b.status = 'checked-in'
                )
            ")->execute();

            // 1. STATS
            $arrivals = $this->db->query("SELECT COUNT(*) FROM bookings WHERE DATE(check_in_date) = '$today' AND status = 'confirmed'")->fetchColumn();
            $departures = $this->db->query("SELECT COUNT(*) FROM bookings WHERE DATE(check_out_date) = '$today' AND status IN ('confirmed', 'checked-in')")->fetchColumn();
            $checked_in = $this->db->query("SELECT COUNT(*) FROM bookings WHERE status = 'checked-in'")->fetchColumn();

            $available = $this->db->query("SELECT COUNT(*) FROM rooms_new WHERE status = 'Available'")->fetchColumn();
            $occupied = $this->db->query("SELECT COUNT(*) FROM rooms_new WHERE status = 'Occupied'")->fetchColumn();
            $maintenance = $this->db->query("SELECT COUNT(*) FROM rooms_new WHERE status = 'Maintenance'")->fetchColumn();
            $total_rooms = $this->db->query("SELECT COUNT(*) FROM rooms_new")->fetchColumn();

            // Dynamic check of today's new bookings
            $today_created = $this->db->query("SELECT COUNT(*) FROM bookings WHERE DATE(created_at) = '$today'")->fetchColumn();

            // 2. RECENT ONLINE BOOKINGS (join rooms via booking_rooms)
            $recent_stmt = $this->db->query("
                SELECT b.booking_id, b.guest_name, b.check_in_date, b.status,
                       r.room_number AS room_id
                FROM bookings b
                LEFT JOIN booking_rooms br ON br.booking_id = b.id
                LEFT JOIN rooms_new r ON r.id = br.room_id
                WHERE (b.booking_source = 'Online' OR b.booking_source = 'Website') AND b.status != 'pending'
                ORDER BY b.created_at DESC LIMIT 5
            ");
            $recent_bookings = $recent_stmt->fetchAll(PDO::FETCH_ASSOC);

            // 3. DEPARTURES LIST
            $dep_stmt = $this->db->prepare("
                SELECT b.booking_id, b.guest_name, r.room_number
                FROM bookings b
                LEFT JOIN booking_rooms br ON br.booking_id = b.id
                LEFT JOIN rooms_new r ON r.id = br.room_id
                WHERE DATE(b.check_out_date) = ? AND b.status IN ('confirmed', 'checked-in')
            ");
            $dep_stmt->execute([$today]);
            $departures_list = $dep_stmt->fetchAll(PDO::FETCH_ASSOC);

            // 4. ARRIVALS LIST
            $arr_stmt = $this->db->prepare("
                SELECT b.booking_id, b.guest_name, rc.name AS category_name, r.room_number
                FROM bookings b
                LEFT JOIN booking_rooms br ON br.booking_id = b.id
                LEFT JOIN rooms_new r ON r.id = br.room_id
                LEFT JOIN room_categories rc ON rc.id = r.category_id
                WHERE DATE(b.check_in_date) = ? AND b.status = 'confirmed'
            ");
            $arr_stmt->execute([$today]);
            $arrivals_list = $arr_stmt->fetchAll(PDO::FETCH_ASSOC);

            // 5. CURRENT CHECK-INS LIST
            $ci_stmt = $this->db->prepare("
                SELECT b.booking_id, b.guest_name, r.room_number, b.check_in_date, b.check_out_date
                FROM bookings b
                JOIN booking_rooms br ON br.booking_id = b.id
                JOIN rooms_new r ON r.id = br.room_id
                WHERE b.status = 'checked-in'
            ");
            $ci_stmt->execute();
            $checked_in_list = $ci_stmt->fetchAll(PDO::FETCH_ASSOC);

            // 6. AVAILABLE ROOMS LIST
            $av_stmt = $this->db->prepare("
                SELECT r.room_number, r.room_name, rc.name AS category_name, r.status
                FROM rooms_new r
                LEFT JOIN room_categories rc ON rc.id = r.category_id
                WHERE r.status = 'Available'
                ORDER BY r.room_number ASC
            ");
            $av_stmt->execute();
            $available_rooms_list = $av_stmt->fetchAll(PDO::FETCH_ASSOC);

            // 7. OCCUPIED ROOMS LIST
            $oc_stmt = $this->db->prepare("
                SELECT r.room_number, r.room_name, rc.name AS category_name,
                       (SELECT b.guest_name FROM bookings b 
                        JOIN booking_rooms br ON br.booking_id = b.id 
                        WHERE br.room_id = r.id AND b.status = 'checked-in' LIMIT 1) AS guest_name,
                       (SELECT b.check_in_date FROM bookings b 
                        JOIN booking_rooms br ON br.booking_id = b.id 
                        WHERE br.room_id = r.id AND b.status = 'checked-in' LIMIT 1) AS check_in_date,
                       (SELECT b.check_out_date FROM bookings b 
                        JOIN booking_rooms br ON br.booking_id = b.id 
                        WHERE br.room_id = r.id AND b.status = 'checked-in' LIMIT 1) AS check_out_date
                FROM rooms_new r
                LEFT JOIN room_categories rc ON rc.id = r.category_id
                WHERE r.status = 'Occupied'
                ORDER BY r.room_number ASC
            ");
            $oc_stmt->execute();
            $occupied_rooms_list = $oc_stmt->fetchAll(PDO::FETCH_ASSOC);

            // 8. ROOM DISTRIBUTION
            $room_data = [
                ["name" => "Available", "value" => (int) $available, "color" => "#10b981"],
                ["name" => "Occupied", "value" => (int) $occupied, "color" => "#0b3a24"],
                ["name" => "Maintenance", "value" => (int) $maintenance, "color" => "#f59e0b"]
            ];

            $data = [
                "stats" => [
                    "arrivals" => (int) $arrivals,
                    "departures" => (int) $departures,
                    "checked_in" => (int) $checked_in,
                    "available" => (int) $available,
                    "occupied" => (int) $occupied,
                    "total_rooms" => (int) $total_rooms,
                    "today_created_bookings" => (int) $today_created
                ],
                "recent_bookings" => $recent_bookings,
                "departures_list" => $departures_list,
                "arrivals_list" => $arrivals_list,
                "checked_in_list" => $checked_in_list,
                "available_rooms_list" => $available_rooms_list,
                "occupied_rooms_list" => $occupied_rooms_list,
                "room_distribution" => $room_data
            ];

            echo json_encode(['status' => 'success', 'data' => $data]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }
}
