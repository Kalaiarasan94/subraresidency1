<?php
// backend/api/admin/rooms/create.php
// Creates a new room CATEGORY (e.g. "Super Deluxe") plus its physical sub-rooms.

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../../config/db.php';
include_once '../../../utils/ImageUploader.php';

$database = new Database();
$db = $database->getConnection();

try {
    $room_name = $_POST['room_name'] ?? '';
    $base_price = $_POST['base_price'] ?? null;
    $max_adults = $_POST['max_adults'] ?? null;
    $room_numbers = isset($_POST['room_numbers']) ? json_decode($_POST['room_numbers'], true) : [];
    $room_numbers = is_array($room_numbers) ? array_values(array_filter(array_map('trim', $room_numbers))) : [];

    if (empty($room_name) || empty($base_price) || empty($max_adults) || empty($room_numbers)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Required fields missing (name, base price, max adults, and at least one room number)"]);
        exit;
    }

    // Check duplicate room numbers against existing physical rooms
    $checkStmt = $db->prepare("SELECT room_number FROM rooms_new WHERE room_number IN (" . implode(',', array_fill(0, count($room_numbers), '?')) . ")");
    $checkStmt->execute($room_numbers);
    $dupes = $checkStmt->fetchAll(PDO::FETCH_COLUMN);
    if (!empty($dupes)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Room number(s) already exist: " . implode(', ', $dupes)]);
        exit;
    }

    // Upload featured image (converted to WebP)
    $featured_image_path = '';
    if (isset($_FILES['featured_image']) && $_FILES['featured_image']['error'] === UPLOAD_ERR_OK) {
        $filename = ImageUploader::saveAsWebp($_FILES['featured_image'], '../../../uploads/rooms/', 'category');
        if ($filename) {
            $featured_image_path = '/uploads/rooms/' . $filename;
        }
    }

    if (empty($featured_image_path)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Featured image is required"]);
        exit;
    }

    $db->beginTransaction();

    // 1. Insert the category
    $query = "INSERT INTO room_categories (
        name, description, base_price_12h, base_price_24h, adults_count, children_count, room_size,
        featured_image, full_description, highlights, house_rules, bed_type, number_of_beds,
        balcony, air_conditioning, smoking_allowed, max_guests, show_on_website, status, sub_room_count
    ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )";

    $stmt = $db->prepare($query);
    $stmt->execute([
        $room_name,
        $_POST['short_description'] ?? '',
        $_POST['price_12_hours'] ?? null,
        $_POST['price_24_hours'] ?? $base_price,
        $max_adults,
        $_POST['max_children'] ?? 0,
        $_POST['room_size'] ?? '',
        $featured_image_path,
        $_POST['full_description'] ?? '',
        $_POST['highlights'] ?? '',
        $_POST['house_rules'] ?? '',
        $_POST['bed_type'] ?? '',
        $_POST['number_of_beds'] ?? 1,
        isset($_POST['balcony']) && $_POST['balcony'] === 'true' ? 1 : 0,
        isset($_POST['air_conditioning']) && $_POST['air_conditioning'] === 'true' ? 1 : 0,
        isset($_POST['smoking_allowed']) && $_POST['smoking_allowed'] === 'true' ? 1 : 0,
        $_POST['max_guests'] ?? 0,
        isset($_POST['show_on_website']) && $_POST['show_on_website'] === 'true' ? 1 : 0,
        'Available',
        count($room_numbers),
    ]);

    $category_id = $db->lastInsertId();

    // 2. Insert Amenities
    if (!empty($_POST['amenities'])) {
        $amenities = is_array($_POST['amenities']) ? $_POST['amenities'] : explode(',', $_POST['amenities']);
        $stmt_amenity = $db->prepare("INSERT INTO room_amenities (category_id, amenity_name) VALUES (?, ?)");
        foreach ($amenities as $amenity) {
            if (trim($amenity)) $stmt_amenity->execute([$category_id, trim($amenity)]);
        }
    }

    // 3. Insert Gallery Images (converted to WebP)
    if (isset($_FILES['gallery_images'])) {
        $stmt_gallery = $db->prepare("INSERT INTO room_images_new (category_id, image_path, sort_order) VALUES (?, ?, ?)");
        $count = count($_FILES['gallery_images']['name']);
        for ($i = 0; $i < min($count, 10); $i++) {
            if ($_FILES['gallery_images']['error'][$i] === UPLOAD_ERR_OK) {
                $file = [
                    'tmp_name' => $_FILES['gallery_images']['tmp_name'][$i],
                    'name' => $_FILES['gallery_images']['name'][$i],
                ];
                $filename = ImageUploader::saveAsWebp($file, '../../../uploads/rooms/', 'gallery');
                if ($filename) {
                    $stmt_gallery->execute([$category_id, '/uploads/rooms/' . $filename, $i + 1]);
                }
            }
        }
    }

    // 4. Insert the physical sub-rooms
    $stmt_room = $db->prepare("INSERT INTO rooms_new (room_name, room_number, category_id, floor_number, status) VALUES (?, ?, ?, ?, 'Available')");
    foreach ($room_numbers as $roomNumber) {
        $stmt_room->execute([$room_name, $roomNumber, $category_id, $_POST['floor_number'] ?? null]);
    }

    $db->commit();
    echo json_encode(["success" => true, "message" => "Category Created Successfully", "category_id" => $category_id, "room_id" => $category_id]);

} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
