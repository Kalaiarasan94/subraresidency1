<?php
// backend/controllers/BookingController.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../config/db.php';

class BookingController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function create() {
        $data = json_decode(file_get_contents("php://input"));

        if (!empty($data->name) && !empty($data->checkIn) && !empty($data->checkOut)) {
            try {
                $this->db->beginTransaction();

                $source = $data->source ?? 'website';
                $status = $data->status ?? 'pending';
                $payment_status = $data->payment_status ?? 'pending';
                $payment_method = $data->payment_method ?? null;
                $room_id = $data->room_id ?? null;
                $email = $data->email ?? '';

                // Generate Booking ID: HBKYYYYMMDDXXXX
                $date_str = date('Ymd');
                $booking_id = "HBK" . $date_str . strtoupper(substr(uniqid(), -4));

                // Map source to booking_source enum
                $booking_source = 'Online';
                if ($source === 'reception' || $source === 'walk-in' || $source === 'manual' || $source === 'other') $booking_source = 'Walk-in';

                // Insert into bookings
                $query = "INSERT INTO bookings (booking_id, guest_name, guest_email, guest_phone, check_in_date, check_out_date, total_amount, status, payment_status, source, booking_source, special_requests) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                $stmt = $this->db->prepare($query);
                $stmt->execute([
                    $booking_id, 
                    $data->name, 
                    $email, 
                    $data->phone ?? '', 
                    $data->checkIn, 
                    $data->checkOut, 
                    $data->amount ?? 3500.00,
                    $status,
                    $payment_status,
                    $source,
                    $booking_source,
                    $data->notes ?? $data->specialRequests ?? ''
                ]);
                $db_booking_id = $this->db->lastInsertId();

                // Save booking details into booking_details table for easy retrieval
                try {
                    $bdStmt = $this->db->prepare("INSERT INTO booking_details (booking_id, guest_name, guest_email, guest_phone, guests, country, address, additional_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                    $bdStmt->execute([
                        $db_booking_id, 
                        $data->name, 
                        $email, 
                        $data->phone ?? '', 
                        $data->guests ?? '', 
                        $data->country ?? '', 
                        $data->address ?? '', 
                        $data->notes ?? $data->specialRequests ?? ''
                    ]);
                } catch (Exception $e) {
                    error_log('Failed to insert booking_details: ' . $e->getMessage());
                }

                // Clean query to find the first room in rooms_new matching the category that is not already occupied/booked for these dates
                $checkIn = $data->checkIn;
                $checkOut = $data->checkOut;
                $category_id = $data->category_id ?? null;

                if (!$room_id) {
                    if ($category_id && $checkIn && $checkOut) {
                        $availStmt = $this->db->prepare("
                            SELECT r.id FROM rooms_new r
                            WHERE r.category_id = ? AND r.status != 'Maintenance'
                            AND r.id NOT IN (
                                SELECT ra.room_id FROM room_availability ra 
                                WHERE ra.status IN ('Booked', 'Maintenance')
                                AND ra.date >= ? AND ra.date < ?
                            )
                            AND r.id NOT IN (
                                SELECT br.room_id FROM booking_rooms br
                                JOIN bookings b ON b.id = br.booking_id
                                WHERE b.status = 'pending'
                                  AND b.payment_status = 'pending'
                                  AND b.created_at >= NOW() - INTERVAL 15 MINUTE
                                  AND b.check_in_date < ? 
                                  AND b.check_out_date > ?
                            )
                            ORDER BY r.room_number ASC
                            LIMIT 1
                        ");
                        $availStmt->execute([$category_id, $checkIn, $checkOut, $checkOut, $checkIn]);
                        if ($room_row = $availStmt->fetch(PDO::FETCH_ASSOC)) {
                            $room_id = $room_row['id'];
                        }
                    }

                    if (!$room_id) {
                        // Fallback to any available room in rooms_new for these dates
                        $availStmtFallback = $this->db->prepare("
                            SELECT r.id FROM rooms_new r
                            WHERE r.status != 'Maintenance'
                            AND r.id NOT IN (
                                SELECT ra.room_id FROM room_availability ra 
                                WHERE ra.status IN ('Booked', 'Maintenance')
                                AND ra.date >= ? AND ra.date < ?
                            )
                            AND r.id NOT IN (
                                SELECT br.room_id FROM booking_rooms br
                                JOIN bookings b ON b.id = br.booking_id
                                WHERE b.status = 'pending'
                                  AND b.payment_status = 'pending'
                                  AND b.created_at >= NOW() - INTERVAL 15 MINUTE
                                  AND b.check_in_date < ? 
                                  AND b.check_out_date > ?
                            )
                            ORDER BY r.room_number ASC
                            LIMIT 1
                        ");
                        $availStmtFallback->execute([$checkIn, $checkOut, $checkOut, $checkIn]);
                        if ($room_row = $availStmtFallback->fetch(PDO::FETCH_ASSOC)) {
                            $room_id = $room_row['id'];
                        }
                    }
                }

                if (!$room_id) {
                    throw new Exception("Full House: No rooms are currently available in this category for the selected dates.");
                }

                $db_room_query = "INSERT INTO booking_rooms (booking_id, room_id, price_at_booking) VALUES (?, ?, ?)";
                $this->db->prepare($db_room_query)->execute([$db_booking_id, $room_id, $data->amount ?? 3500.00]);

                if ($payment_status === 'success') {
                    // Record payment
                    $payStmt = $this->db->prepare("INSERT INTO payments (booking_id, transaction_id, amount, payment_method, status) VALUES (?, ?, ?, ?, 'success')");
                    $txnId = 'TXN_OFFLINE_' . strtoupper(substr(uniqid(), -8));
                    $payStmt->execute([$db_booking_id, $txnId, $data->amount ?? 3500.00, $payment_method ?? 'cash']);

                    // Update room status
                    $this->db->prepare("UPDATE rooms_new SET status = 'Occupied' WHERE id = ?")->execute([$room_id]);

                    // Sync availability dates
                    $startTs = strtotime($checkIn);
                    $endTs = strtotime($checkOut);
                    $upsert = $this->db->prepare("INSERT INTO room_availability (room_id, `date`, status, note) VALUES (?, ?, 'Booked', ?) ON DUPLICATE KEY UPDATE status = VALUES(status), note = VALUES(note)");
                    for ($ts = $startTs; $ts < $endTs; $ts += 86400) {
                        $d = date('Y-m-d', $ts);
                        $upsert->execute([$room_id, $d, 'booking:' . $booking_id]);
                    }
                }

                $this->db->commit();

                // Send email confirmation non-blocking
                try {
                    $detailsQuery = $this->db->prepare("
                        SELECT rc.name as room_category_name
                        FROM booking_rooms br
                        JOIN rooms_new r ON r.id = br.room_id
                        JOIN room_categories rc ON rc.id = r.category_id
                        WHERE br.booking_id = ?
                        LIMIT 1
                    ");
                    $detailsQuery->execute([$db_booking_id]);
                    $roomDetails = $detailsQuery->fetch(PDO::FETCH_ASSOC);
                    $roomCategoryName = $roomDetails['room_category_name'] ?? 'Luxury Sanctuary';

                    include_once __DIR__ . '/../utils/Mailer.php';
                    Mailer::sendBookingConfirmation(
                        $email,
                        $data->name,
                        $booking_id,
                        $checkIn,
                        $checkOut,
                        $data->amount ?? 3500.00,
                        $roomCategoryName
                    );
                } catch (Exception $mailEx) {
                    error_log("[BookingController] Auto-mail failed: " . $mailEx->getMessage());
                }

                http_response_code(201);
                echo json_encode(array(
                    "status" => "success",
                    "message" => "Booking created successfully",
                    "booking_id" => $booking_id
                ));
            } catch (Exception $e) {
                $this->db->rollBack();
                http_response_code(500);
                echo json_encode(array("status" => "error", "message" => "Booking failed: " . $e->getMessage()));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("status" => "error", "message" => "Data incomplete"));
        }
    }

    public function sendConfirmation() {
        $bookingId = $_GET['booking_id'] ?? null;
        if (!$bookingId) {
            http_response_code(400);
            echo json_encode(array("status" => "error", "message" => "booking_id is required"));
            return;
        }

        try {
            // Find booking info
            $stmt = $this->db->prepare("SELECT guest_name, guest_email, check_in_date, check_out_date, total_amount, id FROM bookings WHERE booking_id = ?");
            $stmt->execute([$bookingId]);
            $booking = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$booking) {
                http_response_code(404);
                echo json_encode(array("status" => "error", "message" => "Booking not found"));
                return;
            }

            // Find category name
            $detailsQuery = $this->db->prepare("
                SELECT rc.name as room_category_name
                FROM booking_rooms br
                JOIN rooms_new r ON r.id = br.room_id
                JOIN room_categories rc ON rc.id = r.category_id
                WHERE br.booking_id = ?
                LIMIT 1
            ");
            $detailsQuery->execute([$booking['id']]);
            $roomDetails = $detailsQuery->fetch(PDO::FETCH_ASSOC);
            $roomCategoryName = $roomDetails['room_category_name'] ?? 'Luxury Sanctuary';

            include_once __DIR__ . '/../utils/Mailer.php';
            $emailSent = Mailer::sendBookingConfirmation(
                $booking['guest_email'],
                $booking['guest_name'],
                $bookingId,
                $booking['check_in_date'],
                $booking['check_out_date'],
                $booking['total_amount'],
                $roomCategoryName
            );

            if ($emailSent) {
                echo json_encode(array("status" => "success", "message" => "Email sent successfully"));
            } else {
                http_response_code(500);
                echo json_encode(array("status" => "error", "message" => "Email failed to send. Please check your Brevo config or SMTP token."));
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(array("status" => "error", "message" => $e->getMessage()));
        }
    }
}
?>
