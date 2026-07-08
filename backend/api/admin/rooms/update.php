<?php
// backend/api/admin/rooms/update.php
// Updates a room CATEGORY's descriptive/pricing fields (id = room_categories.id).
// Sub-room management (adding/removing physical rooms) is handled separately.

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
    $id = $_POST['id'] ?? null;
    if (!$id) {
        throw new Exception("Category ID is required");
    }

    $room_name = $_POST['room_name'] ?? '';
    $base_price = $_POST['base_price'] ?? null;
    $max_adults = $_POST['max_adults'] ?? 2;

    if (empty($room_name)) {
        throw new Exception("Category name is required");
    }

    $db->beginTransaction();

    // 1. Update category descriptive/pricing fields
    $query = "UPDATE room_categories SET
        name = ?, base_price_24h = ?, base_price_12h = ?, room_size = ?,
        adults_count = ?, children_count = ?, max_guests = ?, bed_type = ?, number_of_beds = ?,
        balcony = ?, air_conditioning = ?, smoking_allowed = ?, description = ?, full_description = ?,
        highlights = ?, house_rules = ?, status = ?, show_on_website = ?
        WHERE id = ?";

    $stmt = $db->prepare($query);
    $stmt->execute([
        $room_name,
        $base_price,
        $_POST['price_12_hours'] ?? null,
        $_POST['room_size'] ?? '',
        $max_adults,
        $_POST['max_children'] ?? 0,
        $_POST['max_guests'] ?? 0,
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

    // Keep every physical sub-room's denormalized room_name in sync with the category name
    $db->prepare("UPDATE rooms_new SET room_name = ? WHERE category_id = ?")->execute([$room_name, $id]);

    // 2. Handle Featured Image Update (WebP)
    if (isset($_FILES['featured_image']) && $_FILES['featured_image']['error'] === UPLOAD_ERR_OK) {
        $filename = ImageUploader::saveAsWebp($_FILES['featured_image'], '../../../uploads/rooms/', 'category');
        if ($filename) {
            $path = '/uploads/rooms/' . $filename;
            $db->prepare("UPDATE room_categories SET featured_image = ? WHERE id = ?")->execute([$path, $id]);
        }
    }

    // 3. Update Amenities (Clear and Re-insert)
    $db->prepare("DELETE FROM room_amenities WHERE category_id = ?")->execute([$id]);
    if (!empty($_POST['amenities'])) {
        $amenities = is_array($_POST['amenities']) ? $_POST['amenities'] : explode(',', $_POST['amenities']);
        $stmt_amenity = $db->prepare("INSERT INTO room_amenities (category_id, amenity_name) VALUES (?, ?)");
        foreach ($amenities as $amenity) {
            if (trim($amenity)) {
                $stmt_amenity->execute([$id, trim($amenity)]);
            }
        }
    }

    // 4. Handle Gallery Images (Append new ones, WebP)
    if (isset($_FILES['gallery_images'])) {
        $stmt_gallery = $db->prepare("INSERT INTO room_images_new (category_id, image_path, sort_order) VALUES (?, ?, ?)");
        $count = count($_FILES['gallery_images']['name']);
        for ($i = 0; $i < $count; $i++) {
            if ($_FILES['gallery_images']['error'][$i] === UPLOAD_ERR_OK) {
                $file = [
                    'tmp_name' => $_FILES['gallery_images']['tmp_name'][$i],
                    'name' => $_FILES['gallery_images']['name'][$i],
                ];
                $filename = ImageUploader::saveAsWebp($file, '../../../uploads/rooms/', 'gallery');
                if ($filename) {
                    $stmt_gallery->execute([$id, '/uploads/rooms/' . $filename, $i + 10]);
                }
            }
        }
    }

    $db->commit();
    echo json_encode(["success" => true, "message" => "Category Updated Successfully"]);

} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
