<?php
// backend/controllers/AccountsController.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Cache-Control, cache-control, Pragma, Expires, *");
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once __DIR__ . '/../config/db.php';

class AccountsController
{
    private $db;

    public function __construct()
    {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    // GET /accounts/summary?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
    public function getSummary()
    {
        try {
            $startDate = $_GET['start_date'] ?? null;
            $endDate = $_GET['end_date'] ?? null;

            // Date filtering clause
            $bookingDateFilter = "";
            $expenseDateFilter = "";
            $paramsBookings = [];
            $paramsExpenses = [];

            if (!empty($startDate) && !empty($endDate)) {
                $bookingDateFilter = "AND DATE(b.created_at) BETWEEN ? AND ?";
                $paramsBookings = [$startDate, $endDate];

                $expenseDateFilter = "WHERE expense_date BETWEEN ? AND ?";
                $paramsExpenses = [$startDate, $endDate];
            } elseif (!empty($startDate)) {
                $bookingDateFilter = "AND DATE(b.created_at) >= ?";
                $paramsBookings = [$startDate];

                $expenseDateFilter = "WHERE expense_date >= ?";
                $paramsExpenses = [$startDate];
            } elseif (!empty($endDate)) {
                $bookingDateFilter = "AND DATE(b.created_at) <= ?";
                $paramsBookings = [$endDate];

                $expenseDateFilter = "WHERE expense_date <= ?";
                $paramsExpenses = [$endDate];
            }

            // 1. Fetch all eligible bookings (not cancelled)
            $bookingSql = "SELECT 
                            b.id,
                            b.booking_id,
                            b.guest_name,
                            b.guest_phone,
                            b.check_in_date,
                            b.check_out_date,
                            b.created_at,
                            b.status,
                            b.payment_status,
                            COALESCE(b.booking_source, 'Online') AS booking_source,
                            COALESCE(b.total_amount, 0) AS total_amount,
                            COALESCE(b.actual_amount, b.total_amount - COALESCE(b.platform_fee, 0), b.total_amount) AS actual_amount,
                            COALESCE(b.platform_fee, 0) AS platform_fee,
                            COALESCE(p.payment_method, 'Online (Razorpay)') AS payment_method,
                            p.transaction_id,
                            r.room_number,
                            rc.name AS category_label
                           FROM bookings b
                           LEFT JOIN payments p ON p.booking_id = b.id
                           LEFT JOIN booking_rooms br ON br.booking_id = b.id
                           LEFT JOIN rooms_new r ON r.id = br.room_id
                           LEFT JOIN room_categories rc ON rc.id = COALESCE(r.category_id, br.room_id)
                           WHERE b.status != 'cancelled' $bookingDateFilter
                           GROUP BY b.id
                           ORDER BY b.created_at DESC";

            $stmt = $this->db->prepare($bookingSql);
            $stmt->execute($paramsBookings);
            $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $totalGrossRevenue = 0.0;
            $totalNetRevenue = 0.0;
            $totalPlatformFees = 0.0;
            $totalBookingsCount = count($bookings);

            // Channel aggregation
            $channelStats = [
                'Walk-in' => ['label' => 'Walk-in / Front Desk', 'count' => 0, 'gross' => 0.0, 'platform_fee' => 0.0, 'net' => 0.0, 'color' => '#10b981'],
                'Online'  => ['label' => 'Direct Website', 'count' => 0, 'gross' => 0.0, 'platform_fee' => 0.0, 'net' => 0.0, 'color' => '#3b82f6'],
                'Booking.com' => ['label' => 'Booking.com', 'count' => 0, 'gross' => 0.0, 'platform_fee' => 0.0, 'net' => 0.0, 'color' => '#003580'],
                'Agoda' => ['label' => 'Agoda', 'count' => 0, 'gross' => 0.0, 'platform_fee' => 0.0, 'net' => 0.0, 'color' => '#e65100'],
                'MakeMyTrip' => ['label' => 'MakeMyTrip / Goibibo', 'count' => 0, 'gross' => 0.0, 'platform_fee' => 0.0, 'net' => 0.0, 'color' => '#ef4444'],
                'Other' => ['label' => 'Other / Offline Agents', 'count' => 0, 'gross' => 0.0, 'platform_fee' => 0.0, 'net' => 0.0, 'color' => '#8b5cf6'],
            ];

            foreach ($bookings as $b) {
                $gross = (float)$b['total_amount'];
                $fee = (float)$b['platform_fee'];
                $net = (float)$b['actual_amount'];

                // Safety fix if net was 0 or not calculated
                if ($net <= 0 && $gross > 0) {
                    $net = max(0, $gross - $fee);
                }

                $totalGrossRevenue += $gross;
                $totalPlatformFees += $fee;
                $totalNetRevenue += $net;

                $src = trim($b['booking_source']);
                // Normalize channel key
                $matchedKey = 'Other';
                foreach (array_keys($channelStats) as $k) {
                    if (strcasecmp($src, $k) === 0 || stripos($src, $k) !== false) {
                        $matchedKey = $k;
                        break;
                    }
                }
                if (stripos($src, 'reception') !== false || stripos($src, 'walk') !== false) {
                    $matchedKey = 'Walk-in';
                } elseif (stripos($src, 'web') !== false || stripos($src, 'online') !== false) {
                    $matchedKey = 'Online';
                }

                if (!isset($channelStats[$matchedKey])) {
                    $channelStats[$matchedKey] = [
                        'label' => $src,
                        'count' => 0,
                        'gross' => 0.0,
                        'platform_fee' => 0.0,
                        'net' => 0.0,
                        'color' => '#64748b'
                    ];
                }

                $channelStats[$matchedKey]['count']++;
                $channelStats[$matchedKey]['gross'] += $gross;
                $channelStats[$matchedKey]['platform_fee'] += $fee;
                $channelStats[$matchedKey]['net'] += $net;
            }

            // 2. Fetch Expenses in Date Range
            $expSql = "SELECT * FROM expenses $expenseDateFilter ORDER BY expense_date DESC, id DESC";
            $expStmt = $this->db->prepare($expSql);
            $expStmt->execute($paramsExpenses);
            $expenses = $expStmt->fetchAll(PDO::FETCH_ASSOC);

            $totalExpenses = 0.0;
            $expensesByCategory = [];

            foreach ($expenses as $e) {
                $amt = (float)$e['amount'];
                $totalExpenses += $amt;
                $cat = trim($e['category'] ?: 'Miscellaneous');
                if (!isset($expensesByCategory[$cat])) {
                    $expensesByCategory[$cat] = [
                        'category' => $cat,
                        'amount' => 0.0,
                        'count' => 0
                    ];
                }
                $expensesByCategory[$cat]['amount'] += $amt;
                $expensesByCategory[$cat]['count']++;
            }

            // Calculate Net Operating Profit
            $netOperatingProfit = $totalNetRevenue - $totalExpenses;

            // Format Channel Breakdown Array
            $channelBreakdown = [];
            foreach ($channelStats as $key => $data) {
                if ($data['count'] > 0 || $totalBookingsCount === 0) {
                    $percentage = $totalGrossRevenue > 0 ? round(($data['gross'] / $totalGrossRevenue) * 100, 1) : 0;
                    $channelBreakdown[] = array_merge(['source' => $key, 'percentage' => $percentage], $data);
                }
            }

            echo json_encode([
                "status" => "success",
                "data" => [
                    "summary" => [
                        "total_bookings" => $totalBookingsCount,
                        "gross_revenue" => round($totalGrossRevenue, 2),
                        "platform_fees" => round($totalPlatformFees, 2),
                        "net_hotel_revenue" => round($totalNetRevenue, 2),
                        "total_expenses" => round($totalExpenses, 2),
                        "net_operating_profit" => round($netOperatingProfit, 2),
                        "date_range" => [
                            "start_date" => $startDate,
                            "end_date" => $endDate
                        ]
                    ],
                    "channels" => $channelBreakdown,
                    "expenses_by_category" => array_values($expensesByCategory),
                    "all_bookings" => $bookings,
                    "recent_bookings" => $bookings,
                    "expenses" => $expenses
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }

    // GET /expenses/list
    public function getExpenses()
    {
        try {
            $startDate = $_GET['start_date'] ?? null;
            $endDate = $_GET['end_date'] ?? null;
            $category = $_GET['category'] ?? null;
            $search = $_GET['search'] ?? null;

            $where = [];
            $params = [];

            if (!empty($startDate) && !empty($endDate)) {
                $where[] = "expense_date BETWEEN ? AND ?";
                $params[] = $startDate;
                $params[] = $endDate;
            } elseif (!empty($startDate)) {
                $where[] = "expense_date >= ?";
                $params[] = $startDate;
            } elseif (!empty($endDate)) {
                $where[] = "expense_date <= ?";
                $params[] = $endDate;
            }

            if (!empty($category) && $category !== 'All') {
                $where[] = "category = ?";
                $params[] = $category;
            }

            if (!empty($search)) {
                $where[] = "(title LIKE ? OR paid_to LIKE ? OR notes LIKE ?)";
                $s = "%$search%";
                $params[] = $s;
                $params[] = $s;
                $params[] = $s;
            }

            $whereClause = count($where) > 0 ? "WHERE " . implode(" AND ", $where) : "";
            $sql = "SELECT * FROM expenses $whereClause ORDER BY expense_date DESC, id DESC";

            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            $expenses = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Total sum
            $totalAmount = 0.0;
            foreach ($expenses as $exp) {
                $totalAmount += (float)$exp['amount'];
            }

            echo json_encode([
                "status" => "success",
                "total_amount" => round($totalAmount, 2),
                "count" => count($expenses),
                "data" => $expenses
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }

    // POST /expenses/create
    public function createExpense()
    {
        try {
            $data = json_decode(file_get_contents("php://input"));
            if (empty($data->title) || empty($data->amount) || empty($data->category)) {
                throw new Exception("Title, Category, and Amount are required fields.");
            }

            $title = trim($data->title);
            $category = trim($data->category);
            $amount = (float)$data->amount;
            $expenseDate = !empty($data->expense_date) ? $data->expense_date : date('Y-m-d');
            $paymentMode = !empty($data->payment_mode) ? trim($data->payment_mode) : 'Cash';
            $paidTo = !empty($data->paid_to) ? trim($data->paid_to) : null;
            $notes = !empty($data->notes) ? trim($data->notes) : null;
            $receiptPath = !empty($data->receipt_path) ? trim($data->receipt_path) : null;

            if ($amount <= 0) {
                throw new Exception("Amount must be greater than zero.");
            }

            $stmt = $this->db->prepare("INSERT INTO expenses 
                (title, category, amount, expense_date, payment_mode, paid_to, notes, receipt_path) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $category, $amount, $expenseDate, $paymentMode, $paidTo, $notes, $receiptPath]);

            $id = $this->db->lastInsertId();

            echo json_encode([
                "status" => "success",
                "message" => "Expense recorded successfully",
                "expense_id" => $id
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }

    // POST /expenses/update
    public function updateExpense()
    {
        try {
            $data = json_decode(file_get_contents("php://input"));
            if (empty($data->id)) {
                throw new Exception("Expense ID is required.");
            }

            $id = (int)$data->id;
            $title = trim($data->title);
            $category = trim($data->category);
            $amount = (float)$data->amount;
            $expenseDate = !empty($data->expense_date) ? $data->expense_date : date('Y-m-d');
            $paymentMode = !empty($data->payment_mode) ? trim($data->payment_mode) : 'Cash';
            $paidTo = !empty($data->paid_to) ? trim($data->paid_to) : null;
            $notes = !empty($data->notes) ? trim($data->notes) : null;

            $stmt = $this->db->prepare("UPDATE expenses SET 
                title = ?, category = ?, amount = ?, expense_date = ?, payment_mode = ?, paid_to = ?, notes = ?
                WHERE id = ?");
            $stmt->execute([$title, $category, $amount, $expenseDate, $paymentMode, $paidTo, $notes, $id]);

            echo json_encode([
                "status" => "success",
                "message" => "Expense updated successfully"
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }

    // POST /expenses/delete
    public function deleteExpense()
    {
        try {
            $data = json_decode(file_get_contents("php://input"));
            if (empty($data->id)) {
                throw new Exception("Expense ID is required.");
            }

            $stmt = $this->db->prepare("DELETE FROM expenses WHERE id = ?");
            $stmt->execute([(int)$data->id]);

            echo json_encode([
                "status" => "success",
                "message" => "Expense deleted successfully"
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }
}
