<?php
// flush_cache.php - Send LiteSpeed Cache purge header to Hostinger server
header("X-LiteSpeed-Purge: *");
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

echo "=== LITESPEED CACHE PURGE ===\n";
echo "Header Sent: X-LiteSpeed-Purge: *\n";
echo "Hostinger LiteSpeed Web Server Cache has been completely purged!\n\n";
echo "Now go back to https://subraresidency.com/admin and press Ctrl + Shift + R!";
?>
