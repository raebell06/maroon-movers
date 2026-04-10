-- Rides/Trips table for Maroon Movers
-- Stores all ride requests and assignments

CREATE TABLE IF NOT EXISTS rides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rider_id INT NOT NULL,
  driver_id INT,
  pickup VARCHAR(255) NOT NULL,
  dropoff VARCHAR(255) NOT NULL,
  departure_time DATETIME,
  available_seats INT DEFAULT 1,
  price_per_seat DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2),
  status ENUM('pending', 'accepted', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (rider_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE SET NULL,
  
  INDEX idx_rider_id (rider_id),
  INDEX idx_driver_id (driver_id),
  INDEX idx_status (status),
  INDEX idx_pickup (pickup),
  INDEX idx_dropoff (dropoff)
);

-- Legacy trips table name (for backward compatibility)
CREATE TABLE IF NOT EXISTS trips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rider_id INT NOT NULL,
  driver_id INT,
  pickup VARCHAR(255) NOT NULL,
  dropoff VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'accepted', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (rider_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE SET NULL,
  
  INDEX idx_rider_id (rider_id),
  INDEX idx_driver_id (driver_id),
  INDEX idx_status (status)
);
