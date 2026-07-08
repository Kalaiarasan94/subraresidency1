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
                      LEFT JOIN booking_rooms br ON b.id = br.booking_id
                      LEFT JOIN rooms_new r ON br.room_id = r.id
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

    // POST /management/updatePaymentStatus
    public function updatePaymentStatus() {
        try {
            $data = json_decode(file_get_contents("php://input"));
            if (empty($data->payment_id) && empty($data->booking_id)) {
                throw new Exception("payment_id or booking_id is required");
            }
            if (empty($data->status)) {
                throw new Exception("status is required");
            }
            
            $this->db->beginTransaction();
            
            $bId = null;
            $paymentId = $data->payment_id ?? null;
            $bookingIdString = $data->booking_id ?? null;

            if ($paymentId) {
                // Get booking auto-increment ID linked to payment
                $getBooking = $this->db->prepare("SELECT booking_id FROM payments WHERE id = ?");
                $getBooking->execute([$paymentId]);
                $bId = $getBooking->fetchColumn();
                
                // Update payment status
                $stmt = $this->db->prepare("UPDATE payments SET status = ? WHERE id = ?");
                $stmt->execute([$data->status, $paymentId]);
            } elseif ($bookingIdString) {
                // Find booking by human-readable booking_id or auto-increment ID
                $getBooking = $this->db->prepare("SELECT id, total_amount, payment_status FROM bookings WHERE booking_id = ? OR id = ?");
                $getBooking->execute([$bookingIdString, $bookingIdString]);
                $booking = $getBooking->fetch(PDO::FETCH_ASSOC);
                
                if ($booking) {
                    $bId = $booking['id'];
                    // Query if payment row exists
                    $payStmt = $this->db->prepare("SELECT id FROM payments WHERE booking_id = ?");
                    $payStmt->execute([$bId]);
                    $pId = $payStmt->fetchColumn();
                    
                    if ($pId) {
                        $stmt = $this->db->prepare("UPDATE payments SET status = ? WHERE id = ?");
                        $stmt->execute([$data->status, $pId]);
                    } else {
                        // Create one since it is missing
                        $txnId = 'TXN_MANUAL_' . strtoupper(substr(uniqid(), -8));
                        $ins = $this->db->prepare("INSERT INTO payments (booking_id, transaction_id, amount, payment_method, status) VALUES (?, ?, ?, 'Cash', ?)");
                        $ins->execute([$bId, $txnId, $booking['total_amount'], $data->status]);
                    }
                }
            }

            if ($bId) {
                $payStatus = ($data->status === 'success') ? 'success' : 'pending';
                $bookingStatus = ($data->status === 'success') ? 'confirmed' : 'pending';
                
                $upBooking = $this->db->prepare("UPDATE bookings SET payment_status = ?, status = ? WHERE id = ?");
                $upBooking->execute([$payStatus, $bookingStatus, $bId]);
            }

            $this->db->commit();
            echo json_encode(["status" => "success", "message" => "Payment status updated successfully"]);
        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }

    // POST /management/deletePayment
    public function deletePayment() {
        try {
            $data = json_decode(file_get_contents("php://input"));
            if (empty($data->payment_id) && empty($data->booking_id)) {
                throw new Exception("payment_id or booking_id is required");
            }

            $this->db->beginTransaction();

            $paymentId = $data->payment_id ?? null;
            $bookingIdString = $data->booking_id ?? null;
            $bId = null;

            if ($paymentId) {
                // Get booking
                $getBooking = $this->db->prepare("SELECT booking_id FROM payments WHERE id = ?");
                $getBooking->execute([$paymentId]);
                $bId = $getBooking->fetchColumn();

                // Delete payment
                $stmt = $this->db->prepare("DELETE FROM payments WHERE id = ?");
                $stmt->execute([$paymentId]);
            } elseif ($bookingIdString) {
                // Find booking
                $getBooking = $this->db->prepare("SELECT id FROM bookings WHERE booking_id = ? OR id = ?");
                $getBooking->execute([$bookingIdString, $bookingIdString]);
                $bId = $getBooking->fetchColumn();

                if ($bId) {
                    // Try to delete payments
                    $stmt = $this->db->prepare("DELETE FROM payments WHERE booking_id = ?");
                    $stmt->execute([$bId]);
                }
            }

            $bookingForEmail = null;
            if ($bId) {
                // Snapshot guest/booking details before cancelling, for the notification email
                $snapStmt = $this->db->prepare("SELECT booking_id, guest_name, guest_email, check_in_date, check_out_date, total_amount FROM bookings WHERE id = ?");
                $snapStmt->execute([$bId]);
                $bookingForEmail = $snapStmt->fetch(PDO::FETCH_ASSOC);

                // Cancel booking
                $upBooking = $this->db->prepare("UPDATE bookings SET payment_status = 'failed', status = 'cancelled' WHERE id = ?");
                $upBooking->execute([$bId]);

                // Release room availability if blocked
                $releaseAvail = $this->db->prepare("DELETE FROM room_availability WHERE note LIKE ?");
                $releaseAvail->execute(['booking:%']);
            }

            $this->db->commit();

            // Notify guest by email (non-breaking)
            $emailSent = false;
            if ($bookingForEmail && !empty($bookingForEmail['guest_email'])) {
                try {
                    $catStmt = $this->db->prepare("
                        SELECT rc.name as room_category_name
                        FROM booking_rooms br
                        JOIN rooms_new r ON r.id = br.room_id
                        JOIN room_categories rc ON rc.id = r.category_id
                        WHERE br.booking_id = ?
                        LIMIT 1
                    ");
                    $catStmt->execute([$bId]);
                    $catRow = $catStmt->fetch(PDO::FETCH_ASSOC);
                    $roomCategoryName = $catRow['room_category_name'] ?? 'Luxury Sanctuary';

                    include_once __DIR__ . '/../utils/Mailer.php';
                    $emailSent = Mailer::sendBookingCancellation(
                        $bookingForEmail['guest_email'],
                        $bookingForEmail['guest_name'],
                        $bookingForEmail['booking_id'],
                        $bookingForEmail['check_in_date'],
                        $bookingForEmail['check_out_date'],
                        $bookingForEmail['total_amount'],
                        $roomCategoryName
                    );
                } catch (Exception $mailEx) {
                    error_log("[ManagementController] Cancellation email failed: " . $mailEx->getMessage());
                }
            }

            echo json_encode(["status" => "success", "message" => "Payment & booking records updated/cancelled successfully", "email_status" => $emailSent ? 'sent' : 'failed']);
        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }
}


