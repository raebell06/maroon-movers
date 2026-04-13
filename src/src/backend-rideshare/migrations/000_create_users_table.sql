-- Users table for Maroon Movers
-- Stores all user accounts (riders and drivers)

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('rider', 'driver') DEFAULT 'rider',
  payment_method VARCHAR(255),
  driver_status ENUM('available', 'unavailable') DEFAULT 'unavailable',
  phone_number VARCHAR(20),
  car_make VARCHAR(100),
  car_model VARCHAR(100),
  car_year VARCHAR(4),
  license_plate VARCHAR(50),
  bank_account VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_driver_status (driver_status)
);
