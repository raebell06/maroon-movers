# Maroon Movers - Backend Setup Guide

## Overview

The backend is an Express.js server with MySQL for data storage and JWT for authentication. This guide will help you set up and run the backend locally.

## Prerequisites

- Node.js (v14+)
- MySQL Server (v5.7+)
- npm or yarn

## Database Setup

### 1. Create the database and tables

```sql
CREATE DATABASE IF NOT EXISTS maroon_movers;
USE maroon_movers;

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('rider', 'driver') DEFAULT 'rider',
  payment_method VARCHAR(255),
  driver_status ENUM('available', 'unavailable') DEFAULT 'unavailable',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Trips table
CREATE TABLE trips (
  id INT PRIMARY KEY AUTO_INCREMENT,
  rider_id INT NOT NULL,
  driver_id INT,
  pickup VARCHAR(255) NOT NULL,
  dropoff VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0,
  status ENUM('pending', 'accepted', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (rider_id) REFERENCES users(id),
  FOREIGN KEY (driver_id) REFERENCES users(id)
);

-- Payments table (optional)
CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  trip_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  provider_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id)
);
```

## Installation

### 1. Create a `.env` file

```bash
cd src/src/backend-rideshare
cp .env.example .env
```

Edit `.env` with your database credentials and JWT secret:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=maroon_movers
JWT_SECRET=your_super_secret_key_here
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the server

```bash
npm start
# or for development with auto-reload
npm install -D nodemon
npm run dev
```

The server should now be running on `http://localhost:5000`.

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register a new user
  ```json
  { "firstname": "John", "lastname": "Doe", "password": "pass123" }
  ```
- **POST** `/api/auth/login` - Login
  ```json
  { "email": "john.doe@bulldogs.aamu.edu", "password": "pass123" }
  ```

### Profile

- **GET** `/api/profile` - Get current user profile (requires Bearer token)
- **PUT** `/api/profile` - Update profile (requires Bearer token)
  ```json
  { "name": "Jane Doe", "email": "...", "payment_method": "..." }
  ```

### Rides

- **POST** `/api/rides/request` - Request a ride
  ```json
  { "pickup": "Campus Center", "dropoff": "Dorm A", "price": 5.0 }
  ```
- **GET** `/api/rides/nearby` - Get pending ride requests (for drivers)
- **GET** `/api/rides/?role=rider` - Get user's trips
- **POST** `/api/rides/:id/accept` - Accept a ride (driver)

### Driver

- **GET** `/api/driver/status` - Get driver status
- **PUT** `/api/driver/status` - Update status
  ```json
  { "status": "available" }
  ```

## Frontend Setup

The frontend is configured to call the backend at `http://localhost:5000` by default. To use a different API URL, set the `VITE_API_URL` environment variable:

```bash
# In the frontend root directory
echo "VITE_API_URL=http://localhost:5000" > .env.local
npm run dev
```

## Testing with Postman/cURL

### Register a user

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstname":"John","lastname":"Doe","password":"test123"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@bulldogs.aamu.edu","password":"test123"}'
```

Save the returned `token` and use it in subsequent requests:

```bash
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

**"Cannot connect to database"**

- Ensure MySQL is running: `mysql -u root -p`
- Verify .env credentials match your MySQL setup

**"JWT not found"**

- Always include `Authorization: Bearer <token>` header for protected routes

**CORS errors**

- The server allows requests from all origins by default. Adjust in `server.js` if needed.

## Next Steps

- Integrate Stripe for real payments
- Add rate limiting and input validation
- Set up logging and error tracking
- Deploy to production (Heroku, AWS, etc.)
