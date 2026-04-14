import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, "data")
const dataFile = path.join(dataDir, "store.json")

const initialStore = {
  counters: {
    users: 1,
    trips: 1,
    rides: 1,
    payments: 1
  },
  users: [],
  trips: [],
  rides: [],
  payments: []
}

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify(initialStore, null, 2))
  console.log("Created local data store at data/store.json")
} else {
  console.log("Local data store already exists at data/store.json")
}

console.log("Local backend storage is ready.")
