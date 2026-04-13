import express from "express"
import bcrypt from "bcryptjs"
import db from "../db.js"
import { verifyToken } from "../../middleware/auth.js"

const router = express.Router()

// Get driver profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email, phone_number, car_make, car_model, car_year, license_plate, bank_account, role FROM users WHERE id = ? AND role = 'driver'",
      [req.user.id]
    )
    if (users.length === 0) {
      return res.status(403).json({ error: "Not a driver" })
    }
    res.json(users[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

// Update driver profile
router.put("/profile", verifyToken, async (req, res) => {
  const { name, password, phoneNumber, carMake, carModel, carYear, licensePlate, bankAccount } = req.body

  try {
    // Verify user is a driver
    const [users] = await db.query("SELECT role FROM users WHERE id = ? AND role = 'driver'", [req.user.id])
    if (users.length === 0) {
      return res.status(403).json({ error: "Not a driver" })
    }

    let updateQuery = "UPDATE users SET name = ?, phone_number = ?, car_make = ?, car_model = ?, car_year = ?, license_plate = ?, bank_account = ?"
    let params = [name, phoneNumber, carMake, carModel, carYear, licensePlate, bankAccount, req.user.id]

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      updateQuery += ", password_hash = ?"
      params = [name, phoneNumber, carMake, carModel, carYear, licensePlate, bankAccount, hashedPassword, req.user.id]
    }

    updateQuery += " WHERE id = ?"

    await db.query(updateQuery, params)

    const [updated] = await db.query(
      "SELECT id, name, email, phone_number, car_make, car_model, car_year, license_plate, bank_account FROM users WHERE id = ?",
      [req.user.id]
    )
    res.json({ message: "Profile updated", user: updated[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

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
