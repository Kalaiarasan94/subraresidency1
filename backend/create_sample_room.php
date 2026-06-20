<?php
// create_sample_room.php

include_once 'config/db.php';

$database = new Database();
$db = $database->getConnection();

try {
    $db->beginTransaction();

    // 1. Insert Room
    $query = "INSERT INTO rooms_new (
        room_name, room_number, room_code, category_id, floor_number, 
        base_price, max_adults, max_children, max_guests, 
        room_size, bed_type, number_of_beds, 
        balcony, air_conditioning, smoking_allowed, 
        short_description, full_description, highlights, house_rules, 
        status, show_on_website, featured_image
    ) VALUES (
        'Royal Emerald Suite', '501', 'RE-501', 1, 5, 
        5500.00, 2, 1, 3, 
        '450', 'King Size Master', 1, 
        1, 1, 0, 
        'Experience ultimate luxury in our signature Royal Emerald Suite with panoramic temple views.',
        'The Royal Emerald Suite at Subra Residency offers an unparalleled blend of traditional elegance and modern luxury. Designed for discerning travelers, this suite features a spacious master bedroom, a private balcony overlooking the historic Kumbakonam skyline, and premium amenities including a walk-in rain shower and a dedicated workstation. Enjoy the comfort of climate control and the serenity of our soundproofed sanctuary.',
        'Private Balcony • Panoramic Views • Rain Shower • Premium Linens',
        'No loud music after 10 PM. Check-out by 11 AM.',
        'Available', 1, '/uploads/rooms/sample_featured.jpg'
    )";
    
    $db->exec($query);
    $room_id = $db->lastInsertId();

    // 2. Insert Amenities
    $amenities = ['High-speed Wi-Fi', 'Smart TV', 'Mini Fridge', 'Coffee Maker', 'Digital Safe', 'Rain Shower', '24/7 Room Service'];
    $stmt_amenity = $db->prepare("INSERT INTO room_amenities (room_id, amenity_name) VALUES (?, ?)");
    foreach ($amenities as $amenity) {
        $stmt_amenity->execute([$room_id, $amenity]);
    }

    // 3. Insert Gallery Images
    $gallery = [
        '/uploads/rooms/sample_1.jpg',
        '/uploads/rooms/sample_2.jpg',
        '/uploads/rooms/sample_3.jpg',
        '/uploads/rooms/sample_4.jpg'
    ];
    $stmt_gallery = $db->prepare("INSERT INTO room_images_new (room_id, image_path, sort_order) VALUES (?, ?, ?)");
    foreach ($gallery as $i => $path) {
        $stmt_gallery->execute([$room_id, $path, $i]);
    }

    $db->commit();
    echo "Sample Room 'Royal Emerald Suite' created successfully with ID: " . $room_id . "\n";

} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    echo "Error: " . $e->getMessage() . "\n";
}
?>
