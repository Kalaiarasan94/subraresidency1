<?php
// seed_rooms.php
include_once 'config/db.php';
$database = new Database();
$db = $database->getConnection();

try {
    $db->beginTransaction();
    
    // Clear existing for clean start (optional, but good for debugging empty state)
    // $db->exec("DELETE FROM room_images_new");
    // $db->exec("DELETE FROM room_amenities");
    // $db->exec("DELETE FROM rooms_new");

    $rooms = [
        [
            'name' => 'Royal Heritage Suite',
            'number' => 'SH-501',
            'price' => 5500,
            'image' => '/uploads/rooms/room_1.png',
            'desc' => 'A masterclass in tradition and luxury, featuring hand-carved teak wood interiors and panoramic temple views.',
            'full_desc' => 'Welcome to our signature Royal Heritage Suite. This room is a tribute to the architectural brilliance of Kumbakonam, blending centuries-old design with 21st-century comfort. Relax on a custom-made King bed surrounded by artisanal woodwork, or enjoy a private sunset on the balcony with a view of the grand gopurams.',
            'highlights' => 'Panoramic Temple View • Hand-Carved Teak Wood • Private Balcony • Rain Shower',
            'amenities' => ['High-Speed WiFi', 'Smart TV', 'Mini Fridge', 'Room Service', 'Workspace', 'Temple View']
        ],
        [
            'name' => 'Executive Garden Room',
            'number' => 'SH-204',
            'price' => 3800,
            'image' => '/uploads/rooms/room_2.png',
            'desc' => 'Premium executive room with twin beds and a serene view of our lush internal courtyards.',
            'full_desc' => 'Perfect for business travelers and heritage seekers alike, the Executive Garden Room offers a tranquil escape from the bustling city. Featuring ergonomic workspaces, twin beds with premium linens, and floor-to-ceiling windows overlooking our botanical gardens.',
            'highlights' => 'Garden View • Twin Beds • Ergonomic Workspace • Soundproof Glazing',
            'amenities' => ['WiFi', 'Workspace', 'City View', 'Room Service', 'Mini Fridge']
        ],
        [
            'name' => 'Legacy Gold Suite',
            'number' => 'SH-305',
            'price' => 4500,
            'image' => '/uploads/rooms/room_3.png',
            'desc' => 'A beautifully appointed suite with golden-hour balcony views and traditional South Indian charm.',
            'full_desc' => 'The Legacy Gold Suite captures the essence of South Indian hospitality. With golden-hour views from your private balcony and pillars inspired by ancient temple architecture, this suite is designed for those who appreciate the finer details of heritage living.',
            'highlights' => 'Golden Hour Balcony • Pillar Architecture • Luxury Spa Bathtub • Premium Linens',
            'amenities' => ['WiFi', 'Bathtub', 'Temple View', 'Room Service', 'Smart TV']
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
            ?, ?, ?, 1, 3, 
            ?, 2, 1, 3, 
            '450', 'King Size', 1, 
            1, 1, 0, 
            ?, ?, ?, 'No loud music. Check-out by 11 AM.', 
            'Available', 1, ?
        )";
        
        $stmt = $db->prepare($query);
        $stmt->execute([
            $room['name'],
            $room['number'],
            str_replace(' ', '', $room['name']),
            $room['price'],
            $room['desc'],
            $room['full_desc'],
            $room['highlights'],
            $room['image']
        ]);
        
        $room_id = $db->lastInsertId();
        
        // Amenities
        $stmt_amenity = $db->prepare("INSERT INTO room_amenities (room_id, amenity_name) VALUES (?, ?)");
        foreach ($room['amenities'] as $amenity) {
            $stmt_amenity->execute([$room_id, $amenity]);
        }
        
        // Gallery (Use the same featured as first gallery item)
        $db->prepare("INSERT INTO room_images_new (room_id, image_path, sort_order) VALUES (?, ?, 0)")->execute([$room_id, $room['image']]);
    }

    $db->commit();
    echo "Seed successful: 3 Professional Rooms created.\n";

} catch (Exception $e) {
    if ($db->inTransaction()) $db->rollBack();
    echo "Error: " . $e->getMessage() . "\n";
}
?>
