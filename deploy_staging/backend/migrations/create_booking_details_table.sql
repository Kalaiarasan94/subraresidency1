-- Create booking_details table
CREATE TABLE IF NOT EXISTS booking_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT,
  guest_name VARCHAR(255),
  guest_email VARCHAR(255),
  guest_phone VARCHAR(50),
  guests VARCHAR(50),
  additional_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);
