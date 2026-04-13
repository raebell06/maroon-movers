<<<<<<< HEAD
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./models/routes/auth.js"
import profileRoutes from "./models/routes/profile.js"
import ridesRoutes from "./models/routes/rides.js"
import driverRoutes from "./models/routes/driver.js"
import paymentRoutes from "./models/routes/payment.js"
=======
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./models/routes/auth.js";
import ridesRoutes from "./models/routes/rides.js";
>>>>>>> 742b985922c86c7ed7799474e5b90905c3203bba

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/rides", ridesRoutes)
app.use("/api/driver", driverRoutes)
app.use("/api/payments", paymentRoutes)

<<<<<<< HEAD
// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})
=======
app.use("/api/auth", authRoutes);
app.use("/api/rides", ridesRoutes);
>>>>>>> 742b985922c86c7ed7799474e5b90905c3203bba

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: "Internal server error" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
