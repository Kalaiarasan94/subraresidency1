<?php
// seed_rooms.php
include_once 'config/db.php';
$database = new Database();
$db = $database->getConnection();

try {
    $db->beginTransaction();

    $rooms = [
        [
            'name' => 'Deluxe',
            'number' => 'DEL-101',
            'category_id' => 1,
            'price' => 1600,
            'image' => '/uploads/room_details/Deluxe/1.webp',
            'desc' => 'A comfortable and thoughtfully arranged air-conditioned room for a calm, restful stay. Ideal for up to 2 guests.',
            'full_desc' => 'Designed for pilgrims and leisure travelers, the Deluxe Room at Subra Residency offers a peaceful sanctuary in the heart of Kumbakonam. Enjoy premium bedding, climate control air conditioning, modern attached bathroom with 24/7 hot water, high-speed Wi-Fi, smart LED TV, and attentive room service.',
            'highlights' => 'Climate Controlled AC • High-Speed Wi-Fi • 24/7 Hot Water • Daily Housekeeping • Smart TV',
            'amenities' => ['Air Conditioning', 'High-Speed Free Wi-Fi', '42-inch Smart TV', 'Attached Modern Bathroom', '24/7 Hot Water', 'Daily Housekeeping', 'Room Service']
        ],
        [
            'name' => 'Super Deluxe',
            'number' => 'SD-201',
            'category_id' => 2,
            'price' => 2600,
            'image' => '/uploads/room_details/Super_Deluxe/1.webp',
            'desc' => 'A spacious 1 BHK-style suite featuring a private balcony with town views, separate living area, and premium conveniences.',
            'full_desc' => 'The Super Deluxe Suite (Executive 1 Bedroom Family Suite with Balcony) offers generous living space and refined comfort in Kumbakonam. Step out onto your private balcony to soak in morning temple town views. Complete with a master bedroom, inviting living zone, air conditioning, luxury bath fittings, and smart entertainment.',
            'highlights' => 'Private Balcony with Town View • 1 BHK Layout with Living Area • Climate Control AC • High-Speed Wi-Fi • Rain Shower',
            'amenities' => ['Private Balcony', '1 BHK Living Area', 'Air Conditioning', 'High-Speed Free Wi-Fi', '43-inch Smart TV', 'Attached Modern Bathroom', '24/7 Hot Water', 'Mini Refrigerator']
        ],
        [
            'name' => 'Suite',
            'number' => 'ST-301',
            'category_id' => 3,
            'price' => 3600,
            'image' => '/uploads/room_details/Suite/1.webp',
            'desc' => 'A lavish 2 BHK apartment suite with two private master bedrooms, spacious living hall, dining space, and panoramic views.',
            'full_desc' => 'The Suite Room (Executive 2 Bedroom Apartment) is the premier luxury accommodation at Subra Residency, tailored for large families, group pilgrimages, and extended holidays. Featuring two expansive master bedrooms with plush King bedding, an independent central living hall, private balcony, and en-suite contemporary bathrooms.',
            'highlights' => '2 BHK Apartment Layout • 2 Independent Master Bedrooms • Expansive Living Hall • Private Balconies • Luxury Rain Showers',
            'amenities' => ['2 Independent Master Bedrooms', '2 BHK Apartment Layout', 'Private Balconies', 'Central Air Conditioning', 'High-Speed Free Wi-Fi', '55-inch Smart TV', 'Spacious Living Hall']
        ]
    ];

    foreach ($rooms as $room) {
        $query = "INSERT INTO rooms_new (
            room_name, room_number, room_code, category_id, floor_number, 
            base_price, max_adults, max_children, max_guests, 
            room_size, bed_type, number_of_beds, 
            balcony, air_conditioning, smoking_allowed, 
            short_description, full_description, highlights, house_rules, 
            status, show_on_website, featured_image
        ) VALUES (
            ?, ?, ?, ?, 2, 
            ?, 2, 1, 3, 
            '350', 'King Size', 1, 
            1, 1, 0, 
            ?, ?, ?, 'No loud music. Check-out by 11 AM.', 
            'Available', 1, ?
        )";
        
        $stmt = $db->prepare($query);
        $stmt->execute([
            $room['name'],
            $room['number'],
            str_replace(' ', '', $room['name']),
            $room['category_id'],
            $room['price'],
            $room['desc'],
            $room['full_desc'],
            $room['highlights'],
            $room['image']
        ]);
        
        $room_id = $db->lastInsertId();
        
        // Amenities
        $stmt_amenity = $db->prepare("INSERT INTO room_amenities (room_id, category_id, amenity_name) VALUES (?, ?, ?)");
        foreach ($room['amenities'] as $amenity) {
            $stmt_amenity->execute([$room_id, $room['category_id'], $amenity]);
        }
        
        // Gallery
        $db->prepare("INSERT INTO room_images_new (room_id, category_id, image_path, sort_order) VALUES (?, ?, ?, 0)")->execute([$room_id, $room['category_id'], $room['image']]);
    }

    $db->commit();
    echo "Seed successful: Deluxe, Super Deluxe, Suite Rooms created.\n";

} catch (Exception $e) {
    if ($db->inTransaction()) $db->rollBack();
    echo "Error: " . $e->getMessage() . "\n";
}
?>