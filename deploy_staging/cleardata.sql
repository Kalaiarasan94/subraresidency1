-- ============================================================================
-- Subra Residency - Complete Customer & Booking Data Reset
-- ============================================================================
-- Note: In phpMyAdmin, click your database name on the LEFT sidebar FIRST, 
-- then click the SQL tab at the top and paste this query.
-- ============================================================================

-- Disable Foreign Key checks for safe deletion
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Clear Guest Details & Contact Info (Guest Directory)
DELETE FROM `booking_details`;
ALTER TABLE `booking_details` AUTO_INCREMENT = 1;

-- 2. Clear Booking Room Allocations
DELETE FROM `booking_rooms`;
ALTER TABLE `booking_rooms` AUTO_INCREMENT = 1;

-- 3. Clear Payments, Accounts & Financial Settlements History
DELETE FROM `payments`;
ALTER TABLE `payments` AUTO_INCREMENT = 1;

-- 4. Clear Booking QR Codes
DELETE FROM `qr_codes`;
ALTER TABLE `qr_codes` AUTO_INCREMENT = 1;

-- 5. Clear Receptionist Scan Logs & Notifications (Stay Logs)
DELETE FROM `receptionist_notifications`;
ALTER TABLE `receptionist_notifications` AUTO_INCREMENT = 1;

-- 6. Clear Custom Date-Wise Room Availability Overrides (Live Inventory Reset)
DELETE FROM `room_availability`;
ALTER TABLE `room_availability` AUTO_INCREMENT = 1;

-- 7. Clear Main Customer Booking Records (Total, Cancelled, Recent, Online Bookings & Reports)
DELETE FROM `bookings`;
ALTER TABLE `bookings` AUTO_INCREMENT = 1;

-- 8. Clear Registered Website Customer Accounts
DELETE FROM `users`;
ALTER TABLE `users` AUTO_INCREMENT = 1;

-- 9. Clear Operational Expenses & Audit Entries
DELETE FROM `expenses`;
ALTER TABLE `expenses` AUTO_INCREMENT = 1;

-- 10. Reset Occupied Rooms Back to Available in Live Inventory
UPDATE `rooms_new` SET `status` = 'Available' WHERE `status` = 'Occupied';
UPDATE `rooms` SET `status` = 'available' WHERE `status` = 'occupied';

-- Re-enable Foreign Key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- Customer & booking data cleared successfully. Rooms & credentials remain untouched.
-- ============================================================================
