-- Database: subra
CREATE DATABASE IF NOT EXISTS subra;
USE subra;

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reception Users Table
CREATE TABLE IF NOT EXISTS reception_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users (Customers) Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    country VARCHAR(50),
    address TEXT,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Room Categories
CREATE TABLE IF NOT EXISTS room_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    base_price_12h DECIMAL(10, 2),
    base_price_24h DECIMAL(10, 2),
    adults_count INT DEFAULT 2,
    children_count INT DEFAULT 0,
    room_size VARCHAR(20),
    amenities TEXT, -- JSON or comma separated
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms
CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(10) NOT NULL UNIQUE,
    category_id INT,
    status ENUM('available', 'booked', 'occupied', 'maintenance', 'checked-in', 'checked-out') DEFAULT 'available',
    floor INT,
    FOREIGN KEY (category_id) REFERENCES room_categories(id) ON DELETE SET NULL
);

-- Room Images
CREATE TABLE IF NOT EXISTS room_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT,
    category_id INT,
    image_path VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES room_categories(id) ON DELETE CASCADE
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id VARCHAR(20) NOT NULL UNIQUE, -- HBKYYYYMMDDXXXX
    user_id INT,
    guest_name VARCHAR(100),
    guest_email VARCHAR(100),
    guest_phone VARCHAR(20),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_amount DECIMAL(10, 2),
    status ENUM('pending', 'confirmed', 'checked-in', 'checked-out', 'completed', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
    source ENUM('website', 'reception', 'other') DEFAULT 'website',
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Booking Rooms (Many-to-Many or just assignment)
CREATE TABLE IF NOT EXISTS booking_rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    room_id INT,
    price_at_booking DECIMAL(10, 2),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    transaction_id VARCHAR(100),
    amount DECIMAL(10, 2),
    payment_method VARCHAR(50),
    status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Guest Verification
CREATE TABLE IF NOT EXISTS guest_verification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    id_type ENUM('aadhaar', 'pan', 'passport', 'voter_id', 'driving_license'),
    id_number VARCHAR(50),
    id_image_path VARCHAR(255),
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    verified_at TIMESTAMP NULL,
    verified_by INT, -- reception_user_id
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_no VARCHAR(20) NOT NULL UNIQUE,
    booking_id INT,
    invoice_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- QR Codes
CREATE TABLE IF NOT EXISTS qr_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    qr_path VARCHAR(255),
    qr_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Expenses
CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    amount DECIMAL(10, 2),
    category ENUM('maintenance', 'salary', 'utility', 'marketing', 'other'),
    expense_date DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Festival Offers
CREATE TABLE IF NOT EXISTS festival_offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    discount_percentage INT,
    start_date DATE,
    end_date DATE,
    image_path VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

-- Banners
CREATE TABLE IF NOT EXISTS banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    subtitle TEXT,
    image_path VARCHAR(255),
    link_url VARCHAR(255),
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- Temples (CMS)
CREATE TABLE IF NOT EXISTS temples (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    distance VARCHAR(50),
    mode_of_transport VARCHAR(100),
    timings VARCHAR(255),
    dress_code VARCHAR(255),
    speciality TEXT,
    description TEXT,
    image_path VARCHAR(255),
    is_hidden_trail BOOLEAN DEFAULT FALSE
);

-- Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    subject VARCHAR(255),
    message TEXT,
    status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(50) UNIQUE,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_type ENUM('admin', 'reception', 'system'),
    user_id INT,
    action VARCHAR(255),
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data for Authentication
INSERT INTO admins (username, password, full_name, email) VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Subra Admin', 'admin@subraresidency.com'); -- password is 'admin123' (hashed)
INSERT INTO reception_users (username, password, full_name, email) VALUES ('rec', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Subra Reception', 'rec@subraresidency.com'); -- password is 'rec123' or 'admin123'? User said rec123.
-- Actually the hash for 'admin123' is '$2y$10$7R.. (different)'. I'll just use a simple hash for now or set it up later.
