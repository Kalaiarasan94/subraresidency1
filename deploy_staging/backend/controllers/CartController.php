<?php
// backend/controllers/CartController.php

include_once __DIR__ . '/../utils/CorsHelper.php';
include_once __DIR__ . '/../utils/SessionHelper.php';
include_once __DIR__ . '/../config/db.php';

class CartController {
    private $db;
    private $sessionId;
    private $userId;
    private $cartId;

    public function __construct() {
        CorsHelper::handle();
        
        $database = new Database();
        $this->db = $database->getConnection();

        // Ensure database tables exist automatically
        $this->ensureSchema();

        // Get validated session identifier (cryptographically secure guest token)
        $this->sessionId = SessionHelper::getValidatedSessionId();
        $this->userId = SessionHelper::getAuthenticatedUserId($this->db);

        // Resolve or create visitor's isolated cart
        $this->cartId = $this->getOrCreateCartId();
    }

    /**
     * Creates tables if they don't already exist.
     */
    private function ensureSchema() {
        if (!$this->db) return;
        try {
            $this->db->exec("
                CREATE TABLE IF NOT EXISTS `carts` (
                    `id` INT AUTO_INCREMENT PRIMARY KEY,
                    `session_id` VARCHAR(128) NOT NULL,
                    `user_id` INT NULL,
                    `status` ENUM('active', 'converted', 'abandoned') DEFAULT 'active',
                    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    UNIQUE KEY `uniq_session` (`session_id`),
                    KEY `idx_user` (`user_id`),
                    KEY `idx_status` (`status`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ");

            $this->db->exec("
                CREATE TABLE IF NOT EXISTS `cart_items` (
                    `id` INT AUTO_INCREMENT PRIMARY KEY,
                    `cart_id` INT NOT NULL,
                    `category_id` INT NOT NULL,
                    `room_id` INT NULL,
                    `room_number` VARCHAR(50) NULL,
                    `room_name` VARCHAR(150) NULL,
                    `check_in` DATE NOT NULL,
                    `check_out` DATE NOT NULL,
                    `guests` INT DEFAULT 2,
                    `adults` INT DEFAULT 2,
                    `children` INT DEFAULT 0,
                    `price_per_night` DECIMAL(10,2) NOT NULL,
                    `total_price` DECIMAL(10,2) NOT NULL,
                    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    KEY `idx_cart` (`cart_id`),
                    KEY `idx_category` (`category_id`),
                    KEY `idx_room` (`room_id`),
                    KEY `idx_dates` (`check_in`, `check_out`),
                    CONSTRAINT `fk_cart_items_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ");
        } catch (Exception $e) {
            error_log('Cart schema ensure error: ' . $e->getMessage());
        }
    }

    /**
     * Resolves or creates an active cart strictly isolated to the visitor's session or user ID.
     */
    private function getOrCreateCartId() {
        if (!$this->db) return 0;

        // If user is authenticated, check if they have a cart by user_id
        if ($this->userId) {
            $stmt = $this->db->prepare("SELECT id FROM carts WHERE user_id = ? AND status = 'active' LIMIT 1");
            $stmt->execute([$this->userId]);
            $cart = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($cart) {
                // Keep session_id in sync
                $updateStmt = $this->db->prepare("UPDATE carts SET session_id = ? WHERE id = ?");
                $updateStmt->execute([$this->sessionId, $cart['id']]);
                return (int) $cart['id'];
            }
        }

        // Check by session_id
        $stmt = $this->db->prepare("SELECT id, user_id FROM carts WHERE session_id = ? AND status = 'active' LIMIT 1");
        $stmt->execute([$this->sessionId]);
        $cart = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($cart) {
            // If user logged in and cart had no user_id, associate it
            if ($this->userId && empty($cart['user_id'])) {
                $linkStmt = $this->db->prepare("UPDATE carts SET user_id = ? WHERE id = ?");
                $linkStmt->execute([$this->userId, $cart['id']]);
            }
            return (int) $cart['id'];
        }

        // Create new active cart record for this session
        $insert = $this->db->prepare("INSERT INTO carts (session_id, user_id, status) VALUES (?, ?, 'active')");
        $insert->execute([$this->sessionId, $this->userId]);
        return (int) $this->db->lastInsertId();
    }

    /**
     * Helper to get full cart data with formatted totals, images and room metadata.
     */
    private function getFullCart($cartId) {
        if (!$this->db || !$cartId) {
            return [
                'id' => 0,
                'items' => [],
                'total_items' => 0,
                'subtotal' => 0.00,
                'total_amount' => 0.00
            ];
        }

        $stmt = $this->db->prepare("
            SELECT ci.*, 
                   rc.name as category_name, 
                   rc.featured_image,
                   rc.base_price_24h,
                   rn.room_number as live_room_number,
                   rn.room_name as live_room_name
            FROM cart_items ci
            JOIN room_categories rc ON rc.id = ci.category_id
            LEFT JOIN rooms_new rn ON rn.id = ci.room_id
            WHERE ci.cart_id = ?
            ORDER BY ci.id ASC
        ");
        $stmt->execute([$cartId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $items = [];
        $subtotal = 0.00;

        foreach ($rows as $row) {
            $inTs = strtotime($row['check_in']);
            $outTs = strtotime($row['check_out']);
            $nights = max(1, (int) round(($outTs - $inTs) / 86400));
            $itemTotal = floatval($row['total_price']);
            $subtotal += $itemTotal;

            $items[] = [
                'id' => (int) $row['id'],
                'category_id' => (int) $row['category_id'],
                'category_name' => $row['category_name'],
                'room_id' => $row['room_id'] ? (int) $row['room_id'] : null,
                'room_number' => $row['room_number'] ?? $row['live_room_number'] ?? 'Assigned at Check-in',
                'room_name' => $row['room_name'] ?? $row['live_room_name'] ?? $row['category_name'],
                'featured_image' => $row['featured_image'],
                'check_in' => $row['check_in'],
                'check_out' => $row['check_out'],
                'nights' => $nights,
                'guests' => (int) $row['guests'],
                'adults' => (int) $row['adults'],
                'children' => (int) $row['children'],
                'price_per_night' => floatval($row['price_per_night']),
                'total_price' => $itemTotal,
                'created_at' => $row['created_at']
            ];
        }

        return [
            'id' => $cartId,
            'items' => $items,
            'total_items' => count($items),
            'subtotal' => $subtotal,
            'total_amount' => $subtotal
        ];
    }

    /**
     * GET /cart - Retrieve caller's cart.
     */
    public function get() {
        $cart = $this->getFullCart($this->cartId);
        echo json_encode([
            'status' => 'success',
            'cart' => $cart
        ]);
        exit();
    }

    /**
     * Checks if a room/category is available for the given dates.
     */
    private function checkRoomAvailability($categoryId, $roomId, $checkIn, $checkOut) {
        $today_str = date('Y-m-d');
        $is_today = ($checkIn <= $today_str && $checkOut > $today_str);
        $statusExclusions = "'Maintenance', 'Inactive'";
        if ($is_today) {
            $statusExclusions .= ", 'Occupied'";
        }

        if ($roomId) {
            $stmt = $this->db->prepare("
                SELECT r.id, r.room_number, r.room_name, r.category_id 
                FROM rooms_new r
                WHERE r.id = ? 
                  AND r.status NOT IN ($statusExclusions)
                  AND r.id NOT IN (
                      SELECT ra.room_id FROM room_availability ra 
                      WHERE ra.status IN ('Booked', 'Maintenance')
                        AND ra.date >= ? AND ra.date < ?
                  )
                  AND r.id NOT IN (
                      SELECT br.room_id FROM booking_rooms br
                      JOIN bookings b ON b.id = br.booking_id
                      WHERE b.status IN ('confirmed', 'checked-in')
                        AND b.check_in_date < ? 
                        AND b.check_out_date > ?
                  )
                LIMIT 1
            ");
            $stmt->execute([$roomId, $checkIn, $checkOut, $checkOut, $checkIn]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            // Find any free room in category
            $stmt = $this->db->prepare("
                SELECT r.id, r.room_number, r.room_name, r.category_id 
                FROM rooms_new r
                WHERE r.category_id = ? 
                  AND r.status NOT IN ($statusExclusions)
                  AND r.id NOT IN (
                      SELECT ra.room_id FROM room_availability ra 
                      WHERE ra.status IN ('Booked', 'Maintenance')
                        AND ra.date >= ? AND ra.date < ?
                  )
                  AND r.id NOT IN (
                      SELECT br.room_id FROM booking_rooms br
                      JOIN bookings b ON b.id = br.booking_id
                      WHERE b.status IN ('confirmed', 'checked-in')
                        AND b.check_in_date < ? 
                        AND b.check_out_date > ?
                  )
                ORDER BY r.room_number ASC
                LIMIT 1
            ");
            $stmt->execute([$categoryId, $checkIn, $checkOut, $checkOut, $checkIn]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
    }

    /**
     * POST /cart/add - Add item to caller's cart.
     */
    public function add() {
        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input) {
            $input = $_POST;
        }

        $categoryId = isset($input['category_id']) ? (int) $input['category_id'] : 0;
        $roomId = !empty($input['room_id']) ? (int) $input['room_id'] : null;
        $roomNumber = !empty($input['room_number']) ? trim($input['room_number']) : null;
        $checkIn = !empty($input['check_in']) ? trim($input['check_in']) : date('Y-m-d');
        $checkOut = !empty($input['check_out']) ? trim($input['check_out']) : date('Y-m-d', strtotime('+1 day'));
        $guests = isset($input['guests']) ? max(1, (int) $input['guests']) : 2;
        $adults = isset($input['adults']) ? max(1, (int) $input['adults']) : 2;
        $children = isset($input['children']) ? max(0, (int) $input['children']) : 0;

        if ($categoryId <= 0) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Valid room category is required.']);
            exit();
        }

        if (strtotime($checkIn) >= strtotime($checkOut)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Check-out date must be after check-in date.']);
            exit();
        }

        // Fetch category details
        $catStmt = $this->db->prepare("SELECT id, name, base_price_24h, featured_image FROM room_categories WHERE id = ?");
        $catStmt->execute([$categoryId]);
        $cat = $catStmt->fetch(PDO::FETCH_ASSOC);

        if (!$cat) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Room category not found.']);
            exit();
        }

        // Check availability
        $availRoom = $this->checkRoomAvailability($categoryId, $roomId, $checkIn, $checkOut);
        if (!$availRoom) {
            http_response_code(409);
            echo json_encode(['status' => 'error', 'message' => 'The selected room is not available for these dates. Please choose another room or date range.']);
            exit();
        }

        $assignedRoomId = (int) $availRoom['id'];
        $assignedRoomNumber = $availRoom['room_number'] ?? $roomNumber;
        $assignedRoomName = $availRoom['room_name'] ?? $cat['name'];

        $nights = max(1, (int) round((strtotime($checkOut) - strtotime($checkIn)) / 86400));
        $pricePerNight = floatval($cat['base_price_24h']);
        $totalPrice = $pricePerNight * $nights;

        // Check if this room is already in the caller's cart
        $checkCart = $this->db->prepare("
            SELECT id FROM cart_items 
            WHERE cart_id = ? AND category_id = ? AND (room_id = ? OR (room_id IS NULL AND ? IS NULL))
        ");
        $checkCart->execute([$this->cartId, $categoryId, $assignedRoomId, $assignedRoomId]);
        $existing = $checkCart->fetch(PDO::FETCH_ASSOC);

        if ($existing) {
            // Update existing entry in user's cart
            $update = $this->db->prepare("
                UPDATE cart_items 
                SET check_in = ?, check_out = ?, guests = ?, adults = ?, children = ?, 
                    price_per_night = ?, total_price = ?, room_number = ?, room_name = ?
                WHERE id = ? AND cart_id = ?
            ");
            $update->execute([
                $checkIn, $checkOut, $guests, $adults, $children, 
                $pricePerNight, $totalPrice, $assignedRoomNumber, $assignedRoomName,
                $existing['id'], $this->cartId
            ]);
        } else {
            // Insert new item into user's cart
            $insert = $this->db->prepare("
                INSERT INTO cart_items (cart_id, category_id, room_id, room_number, room_name, check_in, check_out, guests, adults, children, price_per_night, total_price)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $insert->execute([
                $this->cartId, $categoryId, $assignedRoomId, $assignedRoomNumber, $assignedRoomName,
                $checkIn, $checkOut, $guests, $adults, $children, $pricePerNight, $totalPrice
            ]);
        }

        echo json_encode([
            'status' => 'success',
            'message' => "Room {$assignedRoomNumber} ({$cat['name']}) added to cart.",
            'cart' => $this->getFullCart($this->cartId)
        ]);
        exit();
    }

    /**
     * POST /cart/update - Update an item in caller's cart.
     */
    public function update() {
        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input) $input = $_POST;

        $itemId = isset($input['item_id']) ? (int) $input['item_id'] : 0;
        if ($itemId <= 0) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Item ID is required.']);
            exit();
        }

        // Verify ownership: Item MUST belong to current caller's cart_id!
        $stmt = $this->db->prepare("SELECT * FROM cart_items WHERE id = ? AND cart_id = ?");
        $stmt->execute([$itemId, $this->cartId]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$item) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Cart item not found or unauthorized access.']);
            exit();
        }

        $checkIn = !empty($input['check_in']) ? trim($input['check_in']) : $item['check_in'];
        $checkOut = !empty($input['check_out']) ? trim($input['check_out']) : $item['check_out'];
        $guests = isset($input['guests']) ? max(1, (int) $input['guests']) : (int) $item['guests'];
        $adults = isset($input['adults']) ? max(1, (int) $input['adults']) : (int) $item['adults'];
        $children = isset($input['children']) ? max(0, (int) $input['children']) : (int) $item['children'];
        $roomId = isset($input['room_id']) ? (int) $input['room_id'] : (int) $item['room_id'];

        if (strtotime($checkIn) >= strtotime($checkOut)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Check-out date must be after check-in date.']);
            exit();
        }

        // Revalidate availability for new parameters
        $avail = $this->checkRoomAvailability($item['category_id'], $roomId, $checkIn, $checkOut);
        if (!$avail) {
            http_response_code(409);
            echo json_encode(['status' => 'error', 'message' => 'Room is not available for the updated dates.']);
            exit();
        }

        $nights = max(1, (int) round((strtotime($checkOut) - strtotime($checkIn)) / 86400));
        $pricePerNight = floatval($item['price_per_night']);
        $totalPrice = $pricePerNight * $nights;

        $updateStmt = $this->db->prepare("
            UPDATE cart_items 
            SET room_id = ?, room_number = ?, check_in = ?, check_out = ?, guests = ?, adults = ?, children = ?, total_price = ?
            WHERE id = ? AND cart_id = ?
        ");
        $updateStmt->execute([
            $avail['id'], $avail['room_number'], $checkIn, $checkOut, $guests, $adults, $children, $totalPrice,
            $itemId, $this->cartId
        ]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Cart item updated successfully.',
            'cart' => $this->getFullCart($this->cartId)
        ]);
        exit();
    }

    /**
     * POST /cart/remove - Remove an item from caller's cart.
     */
    public function remove() {
        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input) $input = $_POST;

        $itemId = isset($input['item_id']) ? (int) $input['item_id'] : (isset($_GET['item_id']) ? (int) $_GET['item_id'] : 0);
        if ($itemId <= 0) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Valid item ID required.']);
            exit();
        }

        // Strictly verify that item belongs to caller's cart_id before deleting!
        $del = $this->db->prepare("DELETE FROM cart_items WHERE id = ? AND cart_id = ?");
        $del->execute([$itemId, $this->cartId]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Item removed from cart.',
            'cart' => $this->getFullCart($this->cartId)
        ]);
        exit();
    }

    /**
     * POST /cart/clear - Clear all items from caller's cart.
     */
    public function clear() {
        $del = $this->db->prepare("DELETE FROM cart_items WHERE cart_id = ?");
        $del->execute([$this->cartId]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Cart cleared.',
            'cart' => $this->getFullCart($this->cartId)
        ]);
        exit();
    }

    /**
     * POST /cart/checkout - Converts cart items into verified bookings.
     * Prevents duplicate bookings by revalidating room availability inside a transaction.
     */
    public function checkout() {
        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input) $input = $_POST;

        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $address = trim($input['address'] ?? '');
        $country = trim($input['country'] ?? 'India');
        $specialRequests = trim($input['special_requests'] ?? $input['notes'] ?? '');
        $paymentMethod = trim($input['payment_method'] ?? 'cash');

        if (empty($name) || empty($phone)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Guest name and phone number are required for checkout.']);
            exit();
        }

        // Fetch current cart items
        $cart = $this->getFullCart($this->cartId);
        if (empty($cart['items'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Your cart is empty. Please add a room first.']);
            exit();
        }

        try {
            $this->db->beginTransaction();

            $dateStr = date('Ymd');
            $createdBookingIds = [];
            $totalCharged = 0.00;

            // Revalidate availability for EVERY item in cart inside transaction
            foreach ($cart['items'] as $item) {
                $avail = $this->checkRoomAvailability($item['category_id'], $item['room_id'], $item['check_in'], $item['check_out']);
                if (!$avail) {
                    $this->db->rollBack();
                    http_response_code(409);
                    $roomLabel = $item['room_number'] ?? $item['category_name'];
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Room {$roomLabel} is no longer available for {$item['check_in']} to {$item['check_out']}. Please select another date or room."
                    ]);
                    exit();
                }

                $bookingId = "HBK" . $dateStr . strtoupper(substr(uniqid(), -4));
                $amount = floatval($item['total_price']);
                $totalCharged += $amount;

                // Create booking record
                $insertBooking = $this->db->prepare("
                    INSERT INTO bookings (booking_id, guest_name, guest_email, guest_phone, check_in_date, check_out_date, total_amount, actual_amount, platform_fee, status, payment_status, source, booking_source, special_requests)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0.00, 'confirmed', 'pending', 'website', 'Online', ?)
                ");
                $insertBooking->execute([
                    $bookingId, $name, $email, $phone, $item['check_in'], $item['check_out'], $amount, $amount, $specialRequests
                ]);
                $dbBookingId = (int) $this->db->lastInsertId();

                // Insert booking details
                $bdStmt = $this->db->prepare("
                    INSERT INTO booking_details (booking_id, guest_name, guest_email, guest_phone, guests, country, address, additional_notes, extra_adults, extra_children)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");
                $bdStmt->execute([
                    $dbBookingId, $name, $email, $phone, $item['guests'] . ' Guests', $country, $address, $specialRequests, $item['adults'], $item['children']
                ]);

                // Allocate room
                $brStmt = $this->db->prepare("INSERT INTO booking_rooms (booking_id, room_id, price_at_booking) VALUES (?, ?, ?)");
                $brStmt->execute([$dbBookingId, $avail['id'], $amount]);

                // Sync room_availability dates to prevent race condition
                $startTs = strtotime($item['check_in']);
                $endTs = strtotime($item['check_out']);
                $availInsert = $this->db->prepare("
                    INSERT INTO room_availability (room_id, date, status, notes)
                    VALUES (?, ?, 'Booked', ?)
                    ON DUPLICATE KEY UPDATE status = 'Booked', notes = VALUES(notes)
                ");
                for ($curr = $startTs; $curr < $endTs; $curr += 86400) {
                    $dStr = date('Y-m-d', $curr);
                    $availInsert->execute([$avail['id'], $dStr, 'Booking #' . $bookingId]);
                }

                $createdBookingIds[] = $bookingId;
            }

            // Clear caller's cart items
            $this->db->prepare("DELETE FROM cart_items WHERE cart_id = ?")->execute([$this->cartId]);
            // Mark cart as converted
            $this->db->prepare("UPDATE carts SET status = 'converted' WHERE id = ?")->execute([$this->cartId]);

            $this->db->commit();

            echo json_encode([
                'status' => 'success',
                'booking_id' => $createdBookingIds[0] ?? '',
                'booking_ids' => $createdBookingIds,
                'total_amount' => $totalCharged,
                'message' => 'Checkout completed and room booked successfully!'
            ]);
            exit();

        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            error_log('Checkout error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Checkout failed: ' . $e->getMessage()]);
            exit();
        }
    }
}

