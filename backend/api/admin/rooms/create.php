<?php
// backend/api/admin/rooms/create.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../../config/db.php';

$database = new Database();
$db = $database->getConnection();

try {
    // 1. Validate inputs based on POST data (multipart/form-data)
    $room_name = $_POST['room_name'] ?? '';
    $room_number = $_POST['room_number'] ?? '';
    $category_id = $_POST['category_id'] ?? null;
    $base_price = $_POST['base_price'] ?? null;
    $max_adults = $_POST['max_adults'] ?? null;

    if (empty($room_name) || empty($room_number) || empty($category_id) || empty($base_price) || empty($max_adults)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Required fields missing"]);
        exit;
    }

    // 2. Check duplicate room number
    $stmt = $db->prepare("SELECT id FROM rooms_new WHERE room_number = ?");
    $stmt->execute([$room_number]);
    if ($stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Room Number Already Exists"]);
        exit;
    }

    // 3. Upload featured image
    $featured_image_path = '';
    if (isset($_FILES['featured_image']) && $_FILES['featured_image']['error'] === UPLOAD_ERR_OK) {
        $ext = pathinfo($_FILES['featured_image']['name'], PATHINFO_EXTENSION);
        $filename = 'room_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
        $dest = '../../../uploads/rooms/' . $filename;
        if (!is_dir('../../../uploads/rooms/')) {
            mkdir('../../../uploads/rooms/', 0777, true);
        }
        if (move_uploaded_file($_FILES['featured_image']['tmp_name'], $dest)) {
            $featured_image_path = '/uploads/rooms/' . $filename;
        }
    }

    if (empty($featured_image_path)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Featured image is required"]);
        exit;
    }

    $db->beginTransaction();

    // 4. Insert Room
    $query = "INSERT INTO rooms_new (
        room_name, room_number, room_code, category_id, floor_number, 
        base_price, price_12_hours, price_24_hours, weekend_price, festival_price, extra_bed_price, 
        max_adults, max_children, max_guests, room_size, bed_type, number_of_beds, 
        balcony, air_conditioning, smoking_allowed, short_description, full_description, 
        highlights, house_rules, status, show_on_website, featured_image
    ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )";
    
    $stmt = $db->prepare($query);
    $stmt->execute([
        $room_name,
        $room_number,
        $_POST['room_code'] ?? '',
        $category_id,
        $_POST['floor_number'] ?? null,
        $base_price,
        $_POST['price_12_hours'] ?? null,
        $_POST['price_24_hours'] ?? null,
        $_POST['weekend_price'] ?? null,
        $_POST['festival_price'] ?? null,
        $_POST['extra_bed_price'] ?? null,
        $max_adults,
        $_POST['max_children'] ?? 0,
        $_POST['max_guests'] ?? 0,
        $_POST['room_size'] ?? '',
        $_POST['bed_type'] ?? '',
        $_POST['number_of_beds'] ?? 1,
        isset($_POST['balcony']) && $_POST['balcony'] === 'true' ? 1 : 0,
        isset($_POST['air_conditioning']) && $_POST['air_conditioning'] === 'true' ? 1 : 0,
        isset($_POST['smoking_allowed']) && $_POST['smoking_allowed'] === 'true' ? 1 : 0,
        $_POST['short_description'] ?? '',
        $_POST['full_description'] ?? '',
        $_POST['highlights'] ?? '',
        $_POST['house_rules'] ?? '',
        $_POST['status'] ?? 'Available',
        isset($_POST['show_on_website']) && $_POST['show_on_website'] === 'true' ? 1 : 0,
        $featured_image_path
    ]);

    $room_id = $db->lastInsertId();

    // 5. Insert Amenities
    if (!empty($_POST['amenities'])) {
        $amenities = is_array($_POST['amenities']) ? $_POST['amenities'] : explode(',', $_POST['amenities']);
        $stmt_amenity = $db->prepare("INSERT INTO room_amenities (room_id, amenity_name) VALUES (?, ?)");
        foreach ($amenities as $amenity) {
            $stmt_amenity->execute([$room_id, trim($amenity)]);
        }
    }

    // 6. Insert Gallery Images
    if (isset($_FILES['gallery_images'])) {
        $stmt_gallery = $db->prepare("INSERT INTO room_images_new (room_id, image_path, sort_order) VALUES (?, ?, ?)");
        $count = count($_FILES['gallery_images']['name']);
        for ($i = 0; $i < min($count, 10); $i++) {
            if ($_FILES['gallery_images']['error'][$i] === UPLOAD_ERR_OK) {
                $ext = pathinfo($_FILES['gallery_images']['name'][$i], PATHINFO_EXTENSION);
                $filename = 'gallery_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
                $dest = '../../../uploads/rooms/' . $filename;
                if (move_uploaded_file($_FILES['gallery_images']['tmp_name'][$i], $dest)) {
                    $stmt_gallery->execute([$room_id, '/uploads/rooms/' . $filename, $i + 1]);
                }
            }
        }
    }

    $db->commit();
    echo json_encode(["success" => true, "message" => "Room Created Successfully", "room_id" => $room_id]);

} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
