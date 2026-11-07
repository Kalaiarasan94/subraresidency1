<?php
// backend/migrate_categories.php
// One-time migration: turns each existing rooms_new row into a real room_categories
// row with N auto-generated physical sub-rooms underneath it. Idempotent — safe to
// re-run; the data migration step is skipped once room_categories has any rows.

include 'config/db.php';
$db = (new Database())->getConnection();

function columnExists($db, $table, $column) {
    $stmt = $db->prepare("SHOW COLUMNS FROM `$table` LIKE ?");
    $stmt->execute([$column]);
    return $stmt->rowCount() > 0;
}

try {
    // 1. Schema additions (idempotent)
    $categoryColumns = [
        'featured_image'    => "VARCHAR(255) DEFAULT NULL",
        'full_description'  => "TEXT DEFAULT NULL",
        'highlights'        => "TEXT DEFAULT NULL",
        'house_rules'       => "TEXT DEFAULT NULL",
        'bed_type'          => "VARCHAR(50) DEFAULT NULL",
        'number_of_beds'    => "INT DEFAULT NULL",
        'balcony'           => "TINYINT(1) DEFAULT 0",
        'air_conditioning'  => "TINYINT(1) DEFAULT 1",
        'smoking_allowed'   => "TINYINT(1) DEFAULT 0",
        'max_guests'        => "INT DEFAULT NULL",
        'show_on_website'   => "TINYINT(1) DEFAULT 1",
        'status'            => "ENUM('Available','Inactive') DEFAULT 'Available'",
        'sub_room_count'    => "INT DEFAULT 5",
    ];
    foreach ($categoryColumns as $col => $def) {
        if (!columnExists($db, 'room_categories', $col)) {
            $db->exec("ALTER TABLE room_categories ADD COLUMN `$col` $def");
            echo "Added room_categories.$col\n";
        }
    }
    if (!columnExists($db, 'room_images_new', 'category_id')) {
        $db->exec("ALTER TABLE room_images_new ADD COLUMN category_id INT NULL");
        echo "Added room_images_new.category_id\n";
    }
    if (!columnExists($db, 'room_amenities', 'category_id')) {
        $db->exec("ALTER TABLE room_amenities ADD COLUMN category_id INT NULL");
        echo "Added room_amenities.category_id\n";
    }

    // 2. Data migration — guarded: only run while room_categories is still empty
    $existingCount = (int)$db->query("SELECT COUNT(*) FROM room_categories")->fetchColumn();
    if ($existingCount > 0) {
        echo "room_categories already has $existingCount row(s) — skipping data migration.\n";
    } else {
        $rooms = $db->query("SELECT * FROM rooms_new ORDER BY id ASC")->fetchAll(PDO::FETCH_ASSOC);
        $subRoomsPerCategory = 5;

        foreach ($rooms as $room) {
            $insertCat = $db->prepare("INSERT INTO room_categories
                (name, description, base_price_12h, base_price_24h, adults_count, children_count, room_size,
                 featured_image, full_description, highlights, house_rules, bed_type, number_of_beds,
                 balcony, air_conditioning, smoking_allowed, max_guests, show_on_website, status, sub_room_count)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $insertCat->execute([
                $room['room_name'],
                $room['short_description'],
                $room['price_12_hours'],
                $room['base_price'],
                $room['max_adults'] ?: 2,
                $room['max_children'] ?: 0,
                $room['room_size'],
                $room['featured_image'],
                $room['full_description'],
                $room['highlights'],
                $room['house_rules'],
                $room['bed_type'],
                $room['number_of_beds'],
                $room['balcony'],
                $room['air_conditioning'],
                $room['smoking_allowed'],
                $room['max_guests'],
                $room['show_on_website'],
                $room['status'] === 'Inactive' ? 'Inactive' : 'Available',
                $subRoomsPerCategory,
            ]);
            $categoryId = $db->lastInsertId();

            // The existing physical row becomes sub-room #1 of the new category
            $db->prepare("UPDATE rooms_new SET category_id = ? WHERE id = ?")->execute([$categoryId, $room['id']]);

            // Gallery/amenities were keyed by room_id — now also reachable by category_id
            $db->prepare("UPDATE room_images_new SET category_id = ? WHERE room_id = ?")->execute([$categoryId, $room['id']]);
            $db->prepare("UPDATE room_amenities SET category_id = ? WHERE room_id = ?")->execute([$categoryId, $room['id']]);

            // Auto-generate the remaining sub-rooms
            $baseNumber = $room['room_number'];
            for ($i = 2; $i <= $subRoomsPerCategory; $i++) {
                $newNumber = $baseNumber . '-' . str_pad((string)$i, 2, '0', STR_PAD_LEFT);
                $insertRoom = $db->prepare("INSERT INTO rooms_new (room_name, room_number, category_id, floor_number, status) VALUES (?, ?, ?, ?, 'Available')");
                $insertRoom->execute([$room['room_name'], $newNumber, $categoryId, $room['floor_number']]);
            }
            echo "Migrated '{$room['room_name']}' -> category #$categoryId with $subRoomsPerCategory sub-rooms\n";
        }
        echo "Data migration complete.\n";
    }

    // 3. Best-effort FK from rooms_new.category_id -> room_categories.id (non-fatal if it already exists)
    try {
        $fkExists = $db->query("
            SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
            WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'rooms_new' AND CONSTRAINT_NAME = 'fk_rooms_new_category'
        ")->fetchColumn();
        if (!$fkExists) {
            $db->exec("ALTER TABLE rooms_new ADD CONSTRAINT fk_rooms_new_category FOREIGN KEY (category_id) REFERENCES room_categories(id) ON DELETE SET NULL");
            echo "Added FK rooms_new.category_id -> room_categories.id\n";
        }
    } catch (Exception $fkEx) {
        echo "FK step skipped: " . $fkEx->getMessage() . "\n";
    }

    echo "Done.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
