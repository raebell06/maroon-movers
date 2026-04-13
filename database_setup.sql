-- Create database
CREATE DATABASE IF NOT EXISTS maroon_movers;
USE maroon_movers;

-- Create riders table (if not exists)
CREATE TABLE IF NOT EXISTS riders (
  rider_Anumber VARCHAR(20) PRIMARY KEY,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Create drivers table (if not exists)
CREATE TABLE IF NOT EXISTS drivers (
  driver_Anumber VARCHAR(20) PRIMARY KEY,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phoneNO VARCHAR(20),
  password VARCHAR(255) NOT NULL
);

-- Create rides table
CREATE TABLE IF NOT EXISTS rides (
  ride_id INT AUTO_INCREMENT PRIMARY KEY,
  rider_Anumber VARCHAR(20) NOT NULL,
  driver_Anumber VARCHAR(20),
  pickup_location VARCHAR(255) NOT NULL,
  dropoff_location VARCHAR(255) NOT NULL,
  pickup_latitude DECIMAL(10, 8),
  pickup_longitude DECIMAL(11, 8),
  dropoff_latitude DECIMAL(10, 8),
  dropoff_longitude DECIMAL(11, 8),
  status ENUM('pending', 'accepted', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY (rider_Anumber) REFERENCES riders(rider_Anumber),
  FOREIGN KEY (driver_Anumber) REFERENCES drivers(driver_Anumber)
);

-- Insert sample data (optional)
INSERT IGNORE INTO riders (rider_Anumber, firstname, lastname, email, password) VALUES
('A12345678', 'John', 'Doe', 'john.doe@bulldogs.aamu.edu', 'hashed_password_here');

INSERT IGNORE INTO drivers (driver_Anumber, firstname, lastname, email, phoneNO, password) VALUES
('A87654321', 'Jane', 'Smith', 'jane.smith@bulldogs.aamu.edu', '256-555-0123', 'hashed_password_here');