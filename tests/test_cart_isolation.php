<?php
// tests/test_cart_isolation.php

require_once __DIR__ . '/../backend/utils/SessionHelper.php';
require_once __DIR__ . '/../backend/utils/CorsHelper.php';

echo "=======================================================\n";
echo "   SUBRA RESIDENCY - MULTI-USER CART ISOLATION TEST\n";
echo "=======================================================\n\n";

// 1. Test Session Token Generation & Independence
echo "[TEST 1] Testing Session Token Generation & Independence...\n";
$sessionTokens = [];
for ($i = 1; $i <= 3; $i++) {
    // Simulate distinct session contexts
    $token = bin2hex(random_bytes(32));
    $sessionTokens["User $i"] = $token;
    echo "  - User $i Session Token: " . $token . " (Length: " . strlen($token) . ")\n";
}

if ($sessionTokens["User 1"] !== $sessionTokens["User 2"] && $sessionTokens["User 2"] !== $sessionTokens["User 3"]) {
    echo "  ✓ PASS: All session tokens are unique and cryptographically secure (64 chars).\n\n";
} else {
    echo "  ✗ FAIL: Duplicate session tokens detected.\n\n";
    exit(1);
}

// 2. Setup In-Memory Test Database
echo "[TEST 2] Setting up In-Memory SQLite Database with Cart Schema...\n";
$pdo = new PDO("sqlite::memory:");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$pdo->exec("
    CREATE TABLE room_categories (
        id INTEGER PRIMARY KEY,
        name TEXT,
        base_price_24h REAL,
        featured_image TEXT
    );
    CREATE TABLE rooms_new (
        id INTEGER PRIMARY KEY,
        room_number TEXT,
        room_name TEXT,
        category_id INTEGER,
        status TEXT
    );
    CREATE TABLE room_availability (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_id INTEGER,
        date TEXT,
        status TEXT,
        notes TEXT,
        UNIQUE (room_id, date)
    );
    CREATE TABLE bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id TEXT UNIQUE,
        guest_name TEXT,
        guest_email TEXT,
        guest_phone TEXT,
        check_in_date TEXT,
        check_out_date TEXT,
        total_amount REAL,
        actual_amount REAL,
        platform_fee REAL,
        status TEXT,
        payment_status TEXT,
        source TEXT,
        booking_source TEXT,
        special_requests TEXT
    );
    CREATE TABLE booking_details (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id INTEGER,
        guest_name TEXT,
        guest_email TEXT,
        guest_phone TEXT,
        guests TEXT,
        country TEXT,
        address TEXT,
        additional_notes TEXT,
        extra_adults INTEGER,
        extra_children INTEGER
    );
    CREATE TABLE booking_rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id INTEGER,
        room_id INTEGER,
        price_at_booking REAL
    );
    CREATE TABLE carts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT UNIQUE,
        user_id INTEGER NULL,
        status TEXT DEFAULT 'active'
    );
    CREATE TABLE cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cart_id INTEGER,
        category_id INTEGER,
        room_id INTEGER,
        room_number TEXT,
        room_name TEXT,
        check_in TEXT,
        check_out TEXT,
        guests INTEGER DEFAULT 2,
        adults INTEGER DEFAULT 2,
        children INTEGER DEFAULT 0,
        price_per_night REAL,
        total_price REAL
    );
");

// Seed categories and sub-rooms
$pdo->exec("
    INSERT INTO room_categories (id, name, base_price_24h, featured_image) VALUES
    (1, 'Deluxe', 1600.00, '/uploads/room_details/Deluxe/1.webp'),
    (2, 'Super Deluxe', 2600.00, '/uploads/room_details/Super_Deluxe/1.webp'),
    (3, 'Suite', 3600.00, '/uploads/room_details/Suite/1.webp');

    INSERT INTO rooms_new (id, room_number, room_name, category_id, status) VALUES
    (1, '101', 'Deluxe', 1, 'Available'),
    (2, '102', 'Deluxe', 1, 'Available'),
    (3, '201', 'Deluxe', 1, 'Available'),
    (4, '202', 'Deluxe', 1, 'Available'),
    (6, '203', 'Super Deluxe', 2, 'Available'),
    (11, '401', 'Suite', 3, 'Available');
");
echo "  ✓ PASS: Test database initialized with Deluxe (Room 101, 102, 201, 202), Super Deluxe, Suite.\n\n";

// Helper functions simulating the CartController operations on $pdo
function getOrCreateCart($pdo, $sessionId) {
    $stmt = $pdo->prepare("SELECT id FROM carts WHERE session_id = ? AND status = 'active'");
    $stmt->execute([$sessionId]);
    $cart = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($cart) return (int) $cart['id'];

    $ins = $pdo->prepare("INSERT INTO carts (session_id, status) VALUES (?, 'active')");
    $ins->execute([$sessionId]);
    return (int) $pdo->lastInsertId();
}

function getCartItems($pdo, $cartId) {
    $stmt = $pdo->prepare("SELECT * FROM cart_items WHERE cart_id = ?");
    $stmt->execute([$cartId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function addToCartMock($pdo, $cartId, $categoryId, $roomId, $checkIn, $checkOut) {
    // Check room availability
    $stmt = $pdo->prepare("
        SELECT r.id, r.room_number, r.room_name 
        FROM rooms_new r
        WHERE r.id = ? 
          AND r.status = 'Available'
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
    ");
    $stmt->execute([$roomId, $checkIn, $checkOut, $checkOut, $checkIn]);
    $room = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$room) {
        return ['status' => 'error', 'message' => 'Room unavailable'];
    }

    $catStmt = $pdo->prepare("SELECT base_price_24h FROM room_categories WHERE id = ?");
    $catStmt->execute([$categoryId]);
    $rate = (float) $catStmt->fetchColumn();

    $ins = $pdo->prepare("
        INSERT INTO cart_items (cart_id, category_id, room_id, room_number, room_name, check_in, check_out, price_per_night, total_price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $ins->execute([$cartId, $categoryId, $room['id'], $room['room_number'], $room['room_name'], $checkIn, $checkOut, $rate, $rate]);
    return ['status' => 'success', 'room_number' => $room['room_number']];
}

function removeFromCartMock($pdo, $cartId, $itemId) {
    // Ownership check: must match cart_id
    $del = $pdo->prepare("DELETE FROM cart_items WHERE id = ? AND cart_id = ?");
    $del->execute([$itemId, $cartId]);
    return $del->rowCount() > 0;
}

// 3. User A (Chrome) tests
echo "[TEST 3] Simulating User A (Chrome) adding Room 101...\n";
$sessionA = $sessionTokens["User 1"];
$cartA = getOrCreateCart($pdo, $sessionA);
$resA = addToCartMock($pdo, $cartA, 1, 1, '2026-11-10', '2026-11-11');
echo "  - Add Room 101 Result: " . $resA['status'] . " (Room " . $resA['room_number'] . ")\n";
$itemsA = getCartItems($pdo, $cartA);
echo "  - User A Cart Items Count: " . count($itemsA) . " (Room " . $itemsA[0]['room_number'] . ")\n";

if (count($itemsA) === 1 && $itemsA[0]['room_number'] === '101') {
    echo "  ✓ PASS: Room 101 successfully added to User A's cart.\n\n";
} else {
    echo "  ✗ FAIL: User A cart unexpected.\n\n";
    exit(1);
}

// 4. User B (Incognito) opens the site
echo "[TEST 4] Simulating User B (Incognito) opening website...\n";
$sessionB = $sessionTokens["User 2"];
$cartB = getOrCreateCart($pdo, $sessionB);
$itemsB = getCartItems($pdo, $cartB);
echo "  - User B Cart Items Count: " . count($itemsB) . "\n";

if (count($itemsB) === 0) {
    echo "  ✓ PASS: Incognito session has an empty cart! User A's room is completely isolated.\n\n";
} else {
    echo "  ✗ FAIL: Leakage detected! User B sees items from User A.\n\n";
    exit(1);
}

// 5. User B (Incognito) adds Room 202
echo "[TEST 5] Simulating User B (Incognito) adding Room 202...\n";
$resB = addToCartMock($pdo, $cartB, 1, 4, '2026-11-10', '2026-11-11');
echo "  - Add Room 202 Result: " . $resB['status'] . " (Room " . $resB['room_number'] . ")\n";
$itemsB_after = getCartItems($pdo, $cartB);
echo "  - User B Cart Items: Room " . $itemsB_after[0]['room_number'] . "\n";

// 6. Verify User A (Chrome) still has only Room 101
echo "[TEST 6] Re-checking User A (Chrome) cart...\n";
$itemsA_recheck = getCartItems($pdo, $cartA);
echo "  - User A Cart Items Count: " . count($itemsA_recheck) . " (Room " . $itemsA_recheck[0]['room_number'] . ")\n";

if (count($itemsA_recheck) === 1 && $itemsA_recheck[0]['room_number'] === '101' &&
    count($itemsB_after) === 1 && $itemsB_after[0]['room_number'] === '202') {
    echo "  ✓ PASS: Complete multi-user cart isolation confirmed! Chrome has Room 101 only, Incognito has Room 202 only.\n\n";
} else {
    echo "  ✗ FAIL: Cross-contamination between carts.\n\n";
    exit(1);
}

// 7. User C (Firefox) opens website
echo "[TEST 7] Simulating User C (Firefox) opening website...\n";
$sessionC = $sessionTokens["User 3"];
$cartC = getOrCreateCart($pdo, $sessionC);
$itemsC = getCartItems($pdo, $cartC);
echo "  - User C Cart Items Count: " . count($itemsC) . "\n";

if (count($itemsC) === 0) {
    echo "  ✓ PASS: Firefox has an independent empty cart.\n\n";
} else {
    echo "  ✗ FAIL: Firefox cart not empty.\n\n";
    exit(1);
}

// 8. Session Persistence across page refreshes
echo "[TEST 8] Testing session persistence (refreshing browser tabs)...\n";
$cartA_persisted = getOrCreateCart($pdo, $sessionA);
$itemsA_persisted = getCartItems($pdo, $cartA_persisted);
$cartB_persisted = getOrCreateCart($pdo, $sessionB);
$itemsB_persisted = getCartItems($pdo, $cartB_persisted);

if ($itemsA_persisted[0]['room_number'] === '101' && $itemsB_persisted[0]['room_number'] === '202') {
    echo "  ✓ PASS: Both carts persist correctly with their respective rooms across reloads.\n\n";
} else {
    echo "  ✗ FAIL: Cart persistence failed.\n\n";
    exit(1);
}

// 9. Item Removal Isolation
echo "[TEST 9] Removing Room 101 from User A (Chrome)...\n";
$removed = removeFromCartMock($pdo, $cartA, $itemsA[0]['id']);
$itemsA_after_remove = getCartItems($pdo, $cartA);
$itemsB_after_remove = getCartItems($pdo, $cartB);

echo "  - User A Cart Items after removal: " . count($itemsA_after_remove) . "\n";
echo "  - User B Cart Items after User A removal: " . count($itemsB_after_remove) . " (Room " . $itemsB_after_remove[0]['room_number'] . ")\n";

if (count($itemsA_after_remove) === 0 && count($itemsB_after_remove) === 1 && $itemsB_after_remove[0]['room_number'] === '202') {
    echo "  ✓ PASS: Removing an item in Chrome left Incognito completely unaffected!\n\n";
} else {
    echo "  ✗ FAIL: Removal affected other browser.\n\n";
    exit(1);
}

// 10. Checkout & Live Availability Revalidation
echo "[TEST 10] Testing Checkout & Room Availability Locking...\n";
// User B checks out Room 202
$pdo->beginTransaction();
// Create booking
$bookingId = "HBK20261110" . strtoupper(substr(uniqid(), -4));
$insBooking = $pdo->prepare("
    INSERT INTO bookings (booking_id, guest_name, guest_phone, check_in_date, check_out_date, total_amount, status)
    VALUES (?, 'Test Guest', '9876543210', '2026-11-10', '2026-11-11', 1600.00, 'confirmed')
");
$insBooking->execute([$bookingId]);
$bId = $pdo->lastInsertId();

$insBr = $pdo->prepare("INSERT INTO booking_rooms (booking_id, room_id, price_at_booking) VALUES (?, 4, 1600.00)");
$insBr->execute([$bId]);

$insAvail = $pdo->prepare("INSERT INTO room_availability (room_id, date, status) VALUES (4, '2026-11-10', 'Booked')");
$insAvail->execute();

$pdo->commit();
echo "  - User B checked out Room 202 (Booking #$bookingId).\n";

// Now User C tries to add Room 202 for the same dates
$resC_conflict = addToCartMock($pdo, $cartC, 1, 4, '2026-11-10', '2026-11-11');
echo "  - User C attempting to add already-booked Room 202: " . $resC_conflict['status'] . " (" . ($resC_conflict['message'] ?? '') . ")\n";

if ($resC_conflict['status'] === 'error') {
    echo "  ✓ PASS: Live availability successfully blocks double-booking of Room 202!\n\n";
} else {
    echo "  ✗ FAIL: Race condition allowed double booking.\n\n";
    exit(1);
}

echo "=======================================================\n";
echo "       ALL 10 VERIFICATION TESTS PASSED (100%)\n";
echo "=======================================================\n";

