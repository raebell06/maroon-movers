import express from "express"
import db from "../db.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// Get driver availability status
router.get("/status", verifyToken, async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, name, driver_status FROM users WHERE id = ? AND role = 'driver'", [req.user.id])
    if (users.length === 0) {
      return res.status(403).json({ error: "Not a driver" })
    }
    res.json({ status: users[0].driver_status || "unavailable" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

// Update driver availability status
router.put("/status", verifyToken, async (req, res) => {
  const { status } = req.body

  if (!["available", "unavailable"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" })
  }

  try {
    await db.query("UPDATE users SET driver_status = ? WHERE id = ? AND role = 'driver'", [status, req.user.id])
    res.json({ message: "Status updated", status })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

export default router
