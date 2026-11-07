<?php
include 'config/db.php';
$db = (new Database())->getConnection();

$tables = ['payments', 'bookings', 'rooms_new'];
foreach ($tables as $t) {
    echo "=== $t ===\n";
    $st = $db->query("SHOW FULL COLUMNS FROM `$t`");
    while ($r = $st->fetch(PDO::FETCH_ASSOC)) {
        echo $r['Field'] . "\n";
    }
    echo "\n";
}
