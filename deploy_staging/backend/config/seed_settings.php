<?php
// backend/config/seed_settings.php

include_once 'db.php';

$database = new Database();
$db = $database->getConnection();

$settings = [
    // Website General
    'site_name' => 'Subra Residency',
    'site_email' => 'contact@subraresidency.com',
    'site_phone' => '+91 9876543210',
    'site_address' => '123 Temple Road, Kumbakonam, Tamil Nadu',
    'site_description' => 'A luxury stay near the heart of Kumbakonam.',
    
    // Social Links
    'social_facebook' => 'https://facebook.com/subraresidency',
    'social_instagram' => 'https://instagram.com/subraresidency',
    'social_twitter' => 'https://twitter.com/subraresidency',
    
    // SEO
    'seo_title' => 'Subra Residency | Best Hotel in Kumbakonam',
    'seo_keywords' => 'hotel, kumbakonam, residency, luxury stay, temple city',
    'seo_description' => 'Experience the spiritual essence of Kumbakonam with a comfortable stay at Subra Residency.',
    
    // Business Logic
    'check_in_time' => '12:00 PM',
    'check_out_time' => '11:00 AM',
    'tax_percentage' => '12',
    'currency_symbol' => '₹',
    'currency_code' => 'INR',
    
    // Features
    'enable_online_booking' => 'true',
    'enable_notifications' => 'true'
];

foreach ($settings as $key => $value) {
    // Use INSERT ... ON DUPLICATE KEY UPDATE or just check
    $stmt = $db->prepare("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?");
    $stmt->execute([$key, $value, $value]);
}

echo "Settings seeding completed successfully.";
?>
