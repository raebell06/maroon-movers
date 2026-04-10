-- Payments table for Maroon Movers
-- This schema stores payment records linked to rides

CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ride_id INT NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  status VARCHAR(50) DEFAULT 'pending' COMMENT 'pending, succeeded, failed, canceled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  INDEX idx_ride_id (ride_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_stripe_pi (stripe_payment_intent_id)
);

-- Optional: Add receipts table for storing payment receipts
CREATE TABLE IF NOT EXISTS payment_receipts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  payment_id INT NOT NULL,
  receipt_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
  INDEX idx_payment_id (payment_id)
);
