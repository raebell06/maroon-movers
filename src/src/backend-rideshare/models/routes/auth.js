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
  const { firstname, lastname, password } = req.body

  // Validate fields
  if (!firstname || !lastname || !password) {
    return res.status(400).json({ error: "Please fill in all fields." })
  }

  // AAMU email
  const email = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@bulldogs.aamu.edu`

  try {
    // Check if user has created an account before
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email])
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "User already exists." })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new user
    await db.query("INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, NOW())", [
      `${firstname} ${lastname}`,
      email,
      hashedPassword,
      "rider"
    ])

    // Generate JWT
    const token = jwt.sign({ email, role: "rider" }, process.env.JWT_SECRET, { expiresIn: "24h" })

    res.json({
      message: `Account created successfully for ${email}`,
      token,
      user: { email, name: `${firstname} ${lastname}`, role: "rider" }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

// Login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body

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