import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import db from "../db.js"

const router = express.Router()

/* ===============
 AUTH BACKEND
 =================*/

// Register endpoint
router.post("/register", async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body

  // Validate fields
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ error: "Please fill in all fields." })
  }

  const normalizedEmail = email.trim().toLowerCase()
  if (!/^[a-z0-9._%+-]+@bulldogs\.aamu\.edu$/.test(normalizedEmail)) {
    return res.status(400).json({ error: "Use your Alabama A&M email." })
  }

  const userRole = role === 'driver' ? 'driver' : 'rider'

  try {
    // Check if user has created an account before
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [normalizedEmail])
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "User already exists." })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new user
    const [result] = await db.query("INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, NOW())", [
      `${firstname} ${lastname}`,
      normalizedEmail,
      hashedPassword,
      userRole
    ])

    // Generate JWT
    const token = jwt.sign({ id: result.insertId, email: normalizedEmail, role: userRole }, process.env.JWT_SECRET, { expiresIn: "24h" })

    res.json({
      message: `Account created successfully for ${normalizedEmail}`,
      token,
      user: { id: result.insertId, email: normalizedEmail, name: `${firstname} ${lastname}`, role: userRole }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

// Login endpoint
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body

  // Validate fields
  if (!email || !password) {
    return res.status(400).json({ error: "Please fill in all fields." })
  }

  try {
    // Check if user exists
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email])
    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." })
    }

    const user = users[0]

    // Check if user role matches requested role
    if (role && user.role !== role) {
      return res.status(401).json({ error: `User is not registered as a ${role}` })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password." })
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" })

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

export default router