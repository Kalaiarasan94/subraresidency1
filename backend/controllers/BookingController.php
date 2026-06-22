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

        if (!empty($data->name) && !empty($data->email) && !empty($data->checkIn) && !empty($data->checkOut)) {
            try {
                $this->db->beginTransaction();

                // Generate Booking ID: HBKYYYYMMDDXXXX
                $date_str = date('Ymd');
                $booking_id = "HBK" . $date_str . strtoupper(substr(uniqid(), -4));

                // Insert into bookings as pending payment
                $query = "INSERT INTO bookings (booking_id, guest_name, guest_email, guest_phone, check_in_date, check_out_date, total_amount, status, payment_status, source) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'pending', 'website')";
                $stmt = $this->db->prepare($query);
                $stmt->execute([
                    $booking_id, 
                    $data->name, 
                    $data->email, 
                    $data->phone, 
                    $data->checkIn, 
                    $data->checkOut, 
                    $data->amount ?? 3500.00
                ]);
                $db_booking_id = $this->db->lastInsertId();

                // Save booking details into booking_details table for easy retrieval
                try {
                    $bdStmt = $this->db->prepare("INSERT INTO booking_details (booking_id, guest_name, guest_email, guest_phone, guests, country, address, additional_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                    $bdStmt->execute([
                        $db_booking_id, 
                        $data->name, 
                        $data->email, 
                        $data->phone, 
                        $data->guests ?? '', 
                        $data->country ?? '', 
                        $data->address ?? '', 
                        $data->notes ?? $data->specialRequests ?? ''
                    ]);
                } catch (Exception $e) {
                    error_log('Failed to insert booking_details: ' . $e->getMessage());
                }

                // Assign a room (simple logic: take first available in category)
                // In a real app we'd check availability for dates
                $room_query = "SELECT id FROM rooms WHERE status = 'available' LIMIT 1";
                $room_stmt = $this->db->query($room_query);
                if ($room_row = $room_stmt->fetch(PDO::FETCH_ASSOC)) {
                    $room_id = $room_row['id'];
                    $db_room_query = "INSERT INTO booking_rooms (booking_id, room_id, price_at_booking) VALUES (?, ?, ?)";
                    $this->db->prepare($db_room_query)->execute([$db_booking_id, $room_id, $data->amount ?? 3500.00]);
                    
                    // Do NOT mark room as booked yet. Wait for payment confirmation.
                    
                    // --- Sync into room_availability: mark each date in [checkIn, checkOut) as Booked ---
                    try {
                        $checkIn = $data->checkIn; // expected YYYY-MM-DD
                        $checkOut = $data->checkOut; // expected YYYY-MM-DD
                        if ($checkIn && $checkOut) {
                            $startTs = strtotime($checkIn);
                            $endTs = strtotime($checkOut);
                            if ($endTs > $startTs) {
                                $upsert = $this->db->prepare("INSERT INTO room_availability (room_id, `date`, status, note) VALUES (?, ?, 'Booked', ?) ON DUPLICATE KEY UPDATE status = VALUES(status), note = VALUES(note)");
                                for ($ts = $startTs; $ts < $endTs; $ts += 86400) {
                                    $d = date('Y-m-d', $ts);
                                    // store booking reference in note for traceability
                                    $note = 'booking:' . $booking_id;
                                    try {
                                        $upsert->execute([$room_id, $d, $note]);
                                    } catch (Exception $e) {
                                        // ignore FK issues or other issues but continue
                                        error_log('Availability sync failed for ' . $room_id . ' on ' . $d . ': ' . $e->getMessage());
                                    }
                                }
                            }
                        }
                    } catch (Exception $e) {
                        error_log('Failed to sync availability: ' . $e->getMessage());
                    }
                }

                $this->db->commit();

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
}
?>
