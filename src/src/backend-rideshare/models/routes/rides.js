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

export default router
