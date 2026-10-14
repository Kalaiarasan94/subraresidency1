-- ============================================================================
-- Subra Residency - Customer & Booking Data Cleanup Only
-- ============================================================================
-- Description: Deletes strictly customer data and booking transaction history.
-- 
-- PRESERVED DATA (UNTOUCHED):
--  - All Rooms and Room Statuses (`rooms_new`, `rooms`, `room_availability`)
--  - Room Categories & Pricing (`room_categories`)
--  - Room Images & Amenities (`room_images_new`, `room_images`, `room_amenities`)
--  - Admin credentials (`admins`)
--  - Receptionist credentials (`reception_users`)
--  - Tourism Attractions & Temples (`attractions`, `temples`)
--  - System Settings (`settings`)
-- ============================================================================

-- Disable foreign key checks to allow clearing customer tables safely
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Clear customer details & contact info (name, email, phone, address, notes)
DELETE FROM `booking_details`;
ALTER TABLE `booking_details` AUTO_INCREMENT = 1;

-- 2. Clear booking room links
DELETE FROM `booking_rooms`;
ALTER TABLE `booking_rooms` AUTO_INCREMENT = 1;

-- 3. Clear payment transaction history
DELETE FROM `payments`;
ALTER TABLE `payments` AUTO_INCREMENT = 1;

-- 4. Clear booking QR codes
DELETE FROM `qr_codes`;
ALTER TABLE `qr_codes` AUTO_INCREMENT = 1;

-- 5. Clear receptionist guest notifications & scan logs
DELETE FROM `receptionist_notifications`;
ALTER TABLE `receptionist_notifications` AUTO_INCREMENT = 1;

-- 6. Clear main customer booking records
DELETE FROM `bookings`;
ALTER TABLE `bookings` AUTO_INCREMENT = 1;

-- 7. Clear registered customer accounts (if any)
DELETE FROM `users`;
ALTER TABLE `users` AUTO_INCREMENT = 1;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- Customer & booking data cleared successfully. Rooms & credentials remain untouched.
-- ============================================================================
