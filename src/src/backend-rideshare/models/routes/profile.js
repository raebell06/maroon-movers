import express from "express"
import bcrypt from "bcryptjs"
import db from "../db.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// Get user profile
router.get("/", verifyToken, async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, name, email, role, payment_method FROM users WHERE id = ?", [req.user.id])
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" })
    }
    res.json(users[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

// Update user profile
router.put("/", verifyToken, async (req, res) => {
  const { name, email, password, payment_method } = req.body

  try {
    let updateQuery = "UPDATE users SET name = ?, email = ?, payment_method = ?"
    let params = [name, email, payment_method, req.user.id]

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      updateQuery = "UPDATE users SET name = ?, email = ?, password_hash = ?, payment_method = ? WHERE id = ?"
      params = [name, email, hashedPassword, payment_method, req.user.id]
    } else {
      updateQuery += " WHERE id = ?"
    }

    await db.query(updateQuery, params)

    const [users] = await db.query("SELECT id, name, email, role, payment_method FROM users WHERE id = ?", [req.user.id])
    res.json({ message: "Profile updated", user: users[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

export default router
