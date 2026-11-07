<?php
// backend/config/seed.php

include_once 'db.php';

$database = new Database();
$db = $database->getConnection();

// Seed Room Categories matching folder names in Room details
$categories = [
    [
        'name' => 'Deluxe',
        'description' => 'A comfortable and thoughtfully arranged air-conditioned room for a calm, restful stay. Ideal for up to 2 guests.',
        'full_description' => 'Designed for pilgrims and leisure travelers, the Deluxe Room at Subra Residency offers a peaceful sanctuary in the heart of Kumbakonam. Enjoy premium bedding, climate control air conditioning, modern attached bathroom with 24/7 hot water, high-speed Wi-Fi, smart LED TV, and attentive room service.',
        'highlights' => 'Climate Controlled AC • High-Speed Wi-Fi • 24/7 Hot Water • Daily Housekeeping • Smart TV',
        'price_12h' => 1000,
        'price_24h' => 1600,
        'adults' => 2,
        'children' => 1,
        'max_guests' => 3,
        'size' => '240',
        'bed_type' => 'Queen Size Bed',
        'category_tag' => 'Deluxe AC',
        'featured_image' => '/uploads/room_details/Deluxe/1.webp',
        'amenities' => [
            'Air Conditioning',
            'High-Speed Free Wi-Fi',
            '42-inch Smart TV',
            'Attached Modern Bathroom',
            '24/7 Hot Water',
            'Daily Housekeeping',
            'Room Service',
            'Electric Kettle / Coffee Maker',
            'Wardrobe',
            'Work Desk'
        ],
        // Exact order: Room images (1, 2) -> Properties Views (1..6) -> Facilities (1, 2) -> Dining (1..3)
        'images' => [
            '/uploads/room_details/Deluxe/1.webp',
            '/uploads/room_details/Deluxe/2.jpeg',
            '/uploads/room_details/Properties_Views/1.webp',
            '/uploads/room_details/Properties_Views/2.jpeg',
            '/uploads/room_details/Properties_Views/3.jpeg',
            '/uploads/room_details/Properties_Views/4.jpeg',
            '/uploads/room_details/Properties_Views/5.webp',
            '/uploads/room_details/Properties_Views/6.webp',
            '/uploads/room_details/Facilities/1.jpeg',
            '/uploads/room_details/Facilities/2.jpeg',
            '/uploads/room_details/Dining/1.jpg',
            '/uploads/room_details/Dining/2.jpeg',
            '/uploads/room_details/Dining/3.jpeg'
        ]
    ],
    [
        'name' => 'Super Deluxe',
        'description' => 'A spacious 1 BHK-style suite featuring a private balcony with town views, separate living area, and premium conveniences.',
        'full_description' => 'The Super Deluxe Suite (Executive 1 Bedroom Family Suite with Balcony) offers generous living space and refined comfort in Kumbakonam. Step out onto your private balcony to soak in morning temple town views. Complete with a master bedroom, inviting living zone, air conditioning, luxury bath fittings, and smart entertainment, this suite is the quintessential choice for families and devotees seeking extra privacy, comfort, and space.',
        'highlights' => 'Private Balcony with Town View • 1 BHK Layout with Living Area • Climate Control AC • High-Speed Wi-Fi • Rain Shower',
        'price_12h' => 1600,
        'price_24h' => 2600,
        'adults' => 3,
        'children' => 1,
        'max_guests' => 4,
        'size' => '420',
        'bed_type' => 'King Size Bed + Extra Bed',
        'category_tag' => 'Executive 1 BHK with Balcony',
        'featured_image' => '/uploads/room_details/Super_Deluxe/1.webp',
        'amenities' => [
            'Private Balcony',
            '1 BHK Living Area',
            'Air Conditioning',
            'High-Speed Free Wi-Fi',
            '43-inch Smart TV',
            'Attached Modern Bathroom',
            '24/7 Hot Water',
            'Mini Refrigerator',
            'Electric Kettle',
            'Daily Housekeeping',
            'Room Service',
            'Workstation & Sofa Seating'
        ],
        // Exact order: Room images (1..5) -> Properties Views (1..6) -> Facilities (1, 2) -> Dining (1..3)
        'images' => [
            '/uploads/room_details/Super_Deluxe/1.webp',
            '/uploads/room_details/Super_Deluxe/2.webp',
            '/uploads/room_details/Super_Deluxe/3.jpeg',
            '/uploads/room_details/Super_Deluxe/4.jpeg',
            '/uploads/room_details/Super_Deluxe/5.jpeg',
            '/uploads/room_details/Properties_Views/1.webp',
            '/uploads/room_details/Properties_Views/2.jpeg',
            '/uploads/room_details/Properties_Views/3.jpeg',
            '/uploads/room_details/Properties_Views/4.jpeg',
            '/uploads/room_details/Properties_Views/5.webp',
            '/uploads/room_details/Properties_Views/6.webp',
            '/uploads/room_details/Facilities/1.jpeg',
            '/uploads/room_details/Facilities/2.jpeg',
            '/uploads/room_details/Dining/1.jpg',
            '/uploads/room_details/Dining/2.jpeg',
            '/uploads/room_details/Dining/3.jpeg'
        ]
    ],
    [
        'name' => 'Suite',
        'description' => 'A lavish 2 BHK apartment suite with two private master bedrooms, spacious living hall, dining space, and panoramic views.',
        'full_description' => 'The Suite Room (Executive 2 Bedroom Apartment) is the premier luxury accommodation at Subra Residency, tailored for large families, group pilgrimages, and extended holidays. Featuring two expansive master bedrooms with plush King bedding, an independent central living hall, private balcony, and en-suite contemporary bathrooms. Revel in residential luxury, superior privacy, and premium amenities just moments away from Kumbakonam\'s sacred heritage and famous temples.',
        'highlights' => '2 BHK Apartment Layout • 2 Independent Master Bedrooms • Expansive Living Hall • Private Balconies • Luxury Rain Showers',
        'price_12h' => 2200,
        'price_24h' => 3600,
        'adults' => 5,
        'children' => 2,
        'max_guests' => 6,
        'size' => '650',
        'bed_type' => '2 King Size Beds',
        'category_tag' => 'Executive 2 BHK Apartment',
        'featured_image' => '/uploads/room_details/Suite/1.webp',
        'amenities' => [
            '2 Independent Master Bedrooms',
            '2 BHK Apartment Layout',
            'Private Balconies',
            'Central Air Conditioning',
            'High-Speed Free Wi-Fi',
            '55-inch Smart TV',
            'Spacious Living Hall',
            'Dining Table & Seating',
            '2 Attached Modern Bathrooms',
            '24/7 Hot Water',
            'Mini Refrigerator',
            'Electric Kettle & Tea Station',
            'Daily Housekeeping',
            'Room Service',
            'Dedicated Work Desk'
        ],
        // Exact order: Room images (1..6) -> Properties Views (1..6) -> Facilities (1, 2) -> Dining (1..3)
        'images' => [
            '/uploads/room_details/Suite/1.webp',
            '/uploads/room_details/Suite/2.webp',
            '/uploads/room_details/Suite/3.jpeg',
            '/uploads/room_details/Suite/4.jpeg',
            '/uploads/room_details/Suite/5.jpeg',
            '/uploads/room_details/Suite/6.webp',
            '/uploads/room_details/Properties_Views/1.webp',
            '/uploads/room_details/Properties_Views/2.jpeg',
            '/uploads/room_details/Properties_Views/3.jpeg',
            '/uploads/room_details/Properties_Views/4.jpeg',
            '/uploads/room_details/Properties_Views/5.webp',
            '/uploads/room_details/Properties_Views/6.webp',
            '/uploads/room_details/Facilities/1.jpeg',
            '/uploads/room_details/Facilities/2.jpeg',
            '/uploads/room_details/Dining/1.jpg',
            '/uploads/room_details/Dining/2.jpeg',
            '/uploads/room_details/Dining/3.jpeg'
        ]
    ]
];

foreach ($categories as $cat) {
    $stmt = $db->prepare("INSERT INTO room_categories (
        name, description, full_description, highlights,
        base_price_12h, base_price_24h, adults_count, children_count, max_guests,
        room_size, bed_type, category_tag, featured_image, amenities, show_on_website, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'Available')");
    $stmt->execute([
        $cat['name'],
        $cat['description'],
        $cat['full_description'],
        $cat['highlights'],
        $cat['price_12h'],
        $cat['price_24h'],
        $cat['adults'],
        $cat['children'],
        $cat['max_guests'],
        $cat['size'],
        $cat['bed_type'],
        $cat['category_tag'],
        $cat['featured_image'],
        json_encode($cat['amenities'])
    ]);
    $cat_id = $db->lastInsertId();

    // Gallery in room_images_new
    $sort = 1;
    foreach ($cat['images'] as $img) {
        $stmt_img = $db->prepare("INSERT INTO room_images_new (category_id, image_path, sort_order) VALUES (?, ?, ?)");
        $stmt_img->execute([$cat_id, $img, $sort]);
        $sort += 10;
    }

    // Amenities in room_amenities
    foreach ($cat['amenities'] as $amenity) {
        $stmt_am = $db->prepare("INSERT INTO room_amenities (category_id, amenity_name) VALUES (?, ?)");
        $stmt_am->execute([$cat_id, $amenity]);
    }

    // Create subrooms for this category
    for ($i = 1; $i <= 4; $i++) {
        $room_no = (100 * $cat_id) + $i;
        $stmt_room = $db->prepare("INSERT INTO rooms_new (
            room_name, room_number, room_code, category_id, floor_number,
            base_price, max_adults, max_children, max_guests,
            room_size, bed_type, short_description, full_description,
            highlights, status, show_on_website, featured_image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Available', 1, ?)");
        $stmt_room->execute([
            $cat['name'],
            (string)$room_no,
            'RM-' . $room_no,
            $cat_id,
            $cat_id,
            $cat['price_24h'],
            $cat['adults'],
            $cat['children'],
            $cat['max_guests'],
            $cat['size'],
            $cat['bed_type'],
            $cat['description'],
            $cat['full_description'],
            $cat['highlights'],
            $cat['featured_image']
        ]);
    }
}

echo "Seeding completed successfully with Deluxe, Super Deluxe, and Suite rooms.\n";
?>
