import mysql from "mysql2"
import dotenv from "dotenv"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "maroon_movers"
})

async function runMigrations() {
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        console.error("❌ Database connection failed:", err.message)
        reject(err)
        return
      }

      console.log("✓ Connected to database")

      // Read migration files
      const migrationsDir = path.join(__dirname, "migrations")
      const files = fs.readdirSync(migrationsDir).sort()

      let completed = 0

      files.forEach((file) => {
        if (!file.endsWith(".sql")) return

        const filePath = path.join(migrationsDir, file)
        const sql = fs.readFileSync(filePath, "utf-8")

        // Split by semicolon and filter empty statements
        const statements = sql.split(";").filter((stmt) => stmt.trim())

        statements.forEach((statement) => {
          connection.query(statement, (err) => {
            if (err) {
              console.error(`❌ Migration error in ${file}:`, err.message)
            } else {
              console.log(`✓ Executed: ${file}`)
            }
            completed++

            if (completed === statements.length) {
              connection.end()
              console.log("\n✓ All migrations completed!")
              resolve()
            }
          })
        })
      })

      if (files.length === 0) {
        console.log("No migration files found")
        connection.end()
        resolve()
      }
    })
  })
}

runMigrations().catch((err) => {
  console.error("Migration failed:", err)
  process.exit(1)
})
