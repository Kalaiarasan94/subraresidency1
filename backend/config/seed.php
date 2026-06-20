<?php
// backend/config/seed.php

include_once 'db.php';

$database = new Database();
$db = $database->getConnection();

// Seed Room Categories
$categories = [
    [
        'name' => 'Deluxe Room',
        'description' => 'A comfortable and thoughtfully arranged room for a calm, restful stay. Ideal for up to 2 guests. (Kids can be allowed if any).',
        'price_12h' => 2000,
        'price_24h' => 3500,
        'adults' => 2,
        'children' => 1,
        'size' => '240 sq ft',
        'amenities' => json_encode(['Free Wi-Fi', 'Breakfast', 'AC', 'TV', 'Room Service', 'Attached Bathroom']),
        'images' => ['assets/hotel/rooms/room1.png', 'assets/hotel/rooms/room4.png']
    ],
    [
        'name' => 'Super Deluxe Room',
        'description' => 'A spacious 1 BHK-style stay with added living comfort. Suitable for 2 or 3 guests.',
        'price_12h' => 3000,
        'price_24h' => 4500,
        'adults' => 3,
        'children' => 1,
        'size' => '320 sq ft',
        'amenities' => json_encode(['Free Wi-Fi', 'Breakfast', 'AC', 'TV', 'Room Service', 'King Bed', 'Live Living Area']),
        'images' => ['assets/hotel/rooms/room2.png', 'assets/hotel/rooms/room5.png']
    ],
    [
        'name' => 'Executive Family Suite Room',
        'description' => 'A premium family stay with spacious interiors and enhanced comfort. Suitable for 4 to 6 guests.',
        'price_12h' => 5000,
        'price_24h' => 7500,
        'adults' => 6,
        'children' => 2,
        'size' => '450 sq ft',
        'amenities' => json_encode(['Free Wi-Fi', 'Breakfast', 'AC', 'TV', 'Room Service', '2 King Beds', 'Kitchenette']),
        'images' => ['assets/hotel/rooms/room3.png', 'assets/hotel/rooms/room6.png']
    ]
];

foreach ($categories as $cat) {
    $stmt = $db->prepare("INSERT INTO room_categories (name, description, base_price_12h, base_price_24h, adults_count, children_count, room_size, amenities) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$cat['name'], $cat['description'], $cat['price_12h'], $cat['price_24h'], $cat['adults'], $cat['children'], $cat['size'], $cat['amenities']]);
    $cat_id = $db->lastInsertId();

    foreach ($cat['images'] as $img) {
        $stmt_img = $db->prepare("INSERT INTO room_images (category_id, image_path) VALUES (?, ?)");
        $stmt_img->execute([$cat_id, $img]);
    }

    // Create some rooms for this category
    for ($i = 1; $i <= 5; $i++) {
        $room_no = (100 * $cat_id) + $i;
        $stmt_room = $db->prepare("INSERT INTO rooms (room_number, category_id, status) VALUES (?, ?, 'available')");
        $stmt_room->execute([$room_no, $cat_id]);
    }
}

// Seed Users
$admin_pass = password_hash('admin123', PASSWORD_BCRYPT);
$rec_pass = password_hash('rec123', PASSWORD_BCRYPT);

$db->prepare("INSERT INTO admins (username, password, full_name, email) VALUES ('admin', ?, 'Subra Admin', 'admin@subra.com')")->execute([$admin_pass]);
$db->prepare("INSERT INTO reception_users (username, password, full_name, email) VALUES ('rec', ?, 'Subra Reception', 'rec@subra.com')")->execute([$rec_pass]);

echo "Seeding completed successfully.";
?>
