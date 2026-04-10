import express from "express"
import db from "../db.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// Create a ride request (rider)
router.post("/request", verifyToken, async (req, res) => {
  const { pickup, dropoff, price } = req.body

  if (!pickup || !dropoff) {
    return res.status(400).json({ error: "Pickup and dropoff are required" })
  }

  try {
    const [result] = await db.query(
      "INSERT INTO trips (rider_id, pickup, dropoff, price, status, created_at) VALUES (?, ?, ?, ?, 'pending', NOW())",
      [req.user.id, pickup, dropoff, price || 0]
    )

    res.json({ id: result.insertId, pickup, dropoff, price, status: "pending" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

// Get nearby ride requests (driver)
router.get("/nearby", verifyToken, async (req, res) => {
  try {
    const [trips] = await db.query(
      "SELECT t.*, u.name as rider_name FROM trips t JOIN users u ON t.rider_id = u.id WHERE t.status = 'pending' AND t.driver_id IS NULL LIMIT 10"
    )
    res.json(trips)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

// Accept a ride request (driver)
router.post("/:id/accept", verifyToken, async (req, res) => {
  try {
    const [result] = await db.query(
      "UPDATE trips SET driver_id = ?, status = 'accepted' WHERE id = ?",
      [req.user.id, req.params.id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Trip not found or already assigned" })
    }

    res.json({ message: "Trip accepted" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

// Get all trips for user (rider or driver)
router.get("/", verifyToken, async (req, res) => {
  try {
    let query = "SELECT t.*, u.name as other_user_name FROM trips t"
    let params = []

    if (req.query.role === "driver") {
      query += " LEFT JOIN users u ON t.rider_id = u.id WHERE t.driver_id = ?"
      params = [req.user.id]
    } else {
      query += " LEFT JOIN users u ON t.driver_id = u.id WHERE t.rider_id = ?"
      params = [req.user.id]
    }

    const [trips] = await db.query(query, params)
    res.json(trips)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

// Create a driver ride
router.post("/create", verifyToken, async (req, res) => {
  const { departure, destination, departureTime, availableSeats, pricePerSeat } = req.body

  if (!departure || !destination || !departureTime || !availableSeats || !pricePerSeat) {
    return res.status(400).json({ error: "All fields are required" })
  }

  try {
    // Verify user is a driver
    const [users] = await db.query("SELECT role FROM users WHERE id = ? AND role = 'driver'", [req.user.id])
    if (users.length === 0) {
      return res.status(403).json({ error: "Only drivers can create rides" })
    }

    const totalPrice = parseFloat(availableSeats) * parseFloat(pricePerSeat)

    const [result] = await db.query(
      "INSERT INTO rides (rider_id, departure_time, pickup, dropoff, available_seats, price_per_seat, total_price, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())",
      [req.user.id, departureTime, departure, destination, availableSeats, pricePerSeat, totalPrice]
    )

    res.json({
      id: result.insertId,
      departure,
      destination,
      departureTime,
      availableSeats,
      pricePerSeat,
      totalPrice,
      status: "pending"
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

// Cancel a ride
router.delete("/:id/cancel", verifyToken, async (req, res) => {
  try {
    // Check if ride exists and belongs to the user
    const [rides] = await db.query("SELECT * FROM rides WHERE id = ? AND (rider_id = ? OR driver_id = ?)", [req.params.id, req.user.id, req.user.id])

    if (rides.length === 0) {
      return res.status(404).json({ error: "Ride not found or unauthorized" })
    }

    await db.query("UPDATE rides SET status = 'cancelled' WHERE id = ?", [req.params.id])

    res.json({ message: "Ride cancelled successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

export default router
