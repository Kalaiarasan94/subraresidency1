<?php
// backend/api/admin/rooms/update.php

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
    $id = $_POST['id'] ?? null;
    if (!$id) {
        throw new Exception("Room ID is required");
    }

    $room_name = $_POST['room_name'] ?? '';
    $room_number = $_POST['room_number'] ?? '';
    $category_id = $_POST['category_id'] ?? null;
    $base_price = $_POST['base_price'] ?? null;
    $max_adults = $_POST['max_adults'] ?? 2;

    if (empty($room_name) || empty($room_number)) {
        throw new Exception("Required fields missing");
    }

    $db->beginTransaction();

    // 1. Update Room Basic Info
    $query = "UPDATE rooms_new SET 
        room_name = ?, room_number = ?, room_code = ?, category_id = ?, floor_number = ?, 
        base_price = ?, price_12_hours = ?, price_24_hours = ?, weekend_price = ?, festival_price = ?, extra_bed_price = ?, 
        max_adults = ?, max_children = ?, max_guests = ?, room_size = ?, bed_type = ?, number_of_beds = ?, 
        balcony = ?, air_conditioning = ?, smoking_allowed = ?, short_description = ?, full_description = ?, 
        highlights = ?, house_rules = ?, status = ?, show_on_website = ?
        WHERE id = ?";
    
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
        isset($_POST['balcony']) && ($_POST['balcony'] === 'true' || $_POST['balcony'] == 1) ? 1 : 0,
        isset($_POST['air_conditioning']) && ($_POST['air_conditioning'] === 'true' || $_POST['air_conditioning'] == 1) ? 1 : 0,
        isset($_POST['smoking_allowed']) && ($_POST['smoking_allowed'] === 'true' || $_POST['smoking_allowed'] == 1) ? 1 : 0,
        $_POST['short_description'] ?? '',
        $_POST['full_description'] ?? '',
        $_POST['highlights'] ?? '',
        $_POST['house_rules'] ?? '',
        $_POST['status'] ?? 'Available',
        isset($_POST['show_on_website']) && ($_POST['show_on_website'] === 'true' || $_POST['show_on_website'] == 1) ? 1 : 0,
        $id
    ]);

    // 2. Handle Featured Image Update
    if (isset($_FILES['featured_image']) && $_FILES['featured_image']['error'] === UPLOAD_ERR_OK) {
        $ext = pathinfo($_FILES['featured_image']['name'], PATHINFO_EXTENSION);
        $filename = 'room_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
        $dest = '../../../uploads/rooms/' . $filename;
        
        if (move_uploaded_file($_FILES['featured_image']['tmp_name'], $dest)) {
            $path = '/uploads/rooms/' . $filename;
            $db->prepare("UPDATE rooms_new SET featured_image = ? WHERE id = ?")->execute([$path, $id]);
        }
    }

    // 3. Update Amenities (Clear and Re-insert)
    $db->prepare("DELETE FROM room_amenities WHERE room_id = ?")->execute([$id]);
    if (!empty($_POST['amenities'])) {
        $amenities = is_array($_POST['amenities']) ? $_POST['amenities'] : explode(',', $_POST['amenities']);
        $stmt_amenity = $db->prepare("INSERT INTO room_amenities (room_id, amenity_name) VALUES (?, ?)");
        foreach ($amenities as $amenity) {
            if (trim($amenity)) {
                $stmt_amenity->execute([$id, trim($amenity)]);
            }
        }
    }

    // 4. Handle Gallery Images (Append new ones)
    if (isset($_FILES['gallery_images'])) {
        $stmt_gallery = $db->prepare("INSERT INTO room_images_new (room_id, image_path, sort_order) VALUES (?, ?, ?)");
        $count = count($_FILES['gallery_images']['name']);
        for ($i = 0; $i < $count; $i++) {
            if ($_FILES['gallery_images']['error'][$i] === UPLOAD_ERR_OK) {
                $ext = pathinfo($_FILES['gallery_images']['name'][$i], PATHINFO_EXTENSION);
                $filename = 'gallery_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
                $dest = '../../../uploads/rooms/' . $filename;
                if (move_uploaded_file($_FILES['gallery_images']['tmp_name'][$i], $dest)) {
                    $stmt_gallery->execute([$id, '/uploads/rooms/' . $filename, $i + 10]); // Offset sort order
                }
            }
        }
    }

    $db->commit();
    echo json_encode(["success" => true, "message" => "Room Updated Successfully"]);

} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
