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

                // Insert into bookings
                $query = "INSERT INTO bookings (booking_id, guest_name, guest_email, guest_phone, check_in_date, check_out_date, total_amount, status, payment_status, source) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed', 'success', 'website')";
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

                // Assign a room (simple logic: take first available in category)
                // In a real app we'd check availability for dates
                $room_query = "SELECT id FROM rooms WHERE status = 'available' LIMIT 1";
                $room_stmt = $this->db->query($room_query);
                if ($room_row = $room_stmt->fetch(PDO::FETCH_ASSOC)) {
                    $room_id = $room_row['id'];
                    $db_room_query = "INSERT INTO booking_rooms (booking_id, room_id, price_at_booking) VALUES (?, ?, ?)";
                    $this->db->prepare($db_room_query)->execute([$db_booking_id, $room_id, $data->amount ?? 3500.00]);
                    
                    // Update room status
                    $update_room = "UPDATE rooms SET status = 'booked' WHERE id = ?";
                    $this->db->prepare($update_room)->execute([$room_id]);
                }

                $this->db->commit();

                // Send Confirmation Email
                include_once '../utils/Mailer.php';
                $emailSent = Mailer::sendBookingConfirmation(
                    $data->email,
                    $data->name,
                    $booking_id,
                    $data->checkIn,
                    $data->checkOut,
                    $data->amount ?? 3500.00
                );

                http_response_code(201);
                echo json_encode(array(
                    "status" => "success",
                    "message" => "Booking created successfully" . ($emailSent ? " and email sent." : " but failed to send email."),
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
