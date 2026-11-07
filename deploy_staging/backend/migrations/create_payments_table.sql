-- Create payments table if it doesn't exist
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT,
  transaction_id VARCHAR(100),
  amount DECIMAL(10,2),
  payment_method VARCHAR(50),
  status ENUM('pending','success','failed') DEFAULT 'pending',
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);
