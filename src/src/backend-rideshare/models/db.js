import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, "..", "data")
const dataFile = path.join(dataDir, "store.json")

function createInitialStore() {
    return {
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
}

function ensureStoreFile() {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
    }

    if (!fs.existsSync(dataFile)) {
        fs.writeFileSync(dataFile, JSON.stringify(createInitialStore(), null, 2))
    }
}

function readStore() {
    ensureStoreFile()
    return JSON.parse(fs.readFileSync(dataFile, "utf-8"))
}

function writeStore(store) {
    fs.writeFileSync(dataFile, JSON.stringify(store, null, 2))
}

function nextId(store, key) {
    const id = store.counters[key]
    store.counters[key] += 1
    return id
}

function nowIso() {
    return new Date().toISOString()
}

function pickUser(user, fields) {
    const picked = {}
    for (const field of fields) {
        picked[field] = user[field] ?? null
    }
    return picked
}

function normalize(sql) {
    return sql.replace(/\s+/g, " ").trim().toLowerCase()
}

function queryInternal(sql, params = []) {
    const normalized = normalize(sql)
    const store = readStore()

    if (normalized === "select * from users where email = ?") {
        const [email] = params
        return [store.users.filter((user) => user.email === email), []]
    }

    if (normalized === "insert into users (name, email, password_hash, role, created_at) values (?, ?, ?, ?, now())") {
        const [name, email, passwordHash, role] = params
        const user = {
            id: nextId(store, "users"),
            name,
            email,
            password_hash: passwordHash,
            role,
            payment_method: null,
            driver_status: "unavailable",
            phone_number: null,
            car_make: null,
            car_model: null,
            car_year: null,
            license_plate: null,
            bank_account: null,
            created_at: nowIso(),
            updated_at: nowIso()
        }
        store.users.push(user)
        writeStore(store)
        return [{ insertId: user.id, affectedRows: 1 }, []]
    }

    if (normalized === "select id, name, email, role, payment_method from users where id = ?") {
        const [id] = params
        const user = store.users.find((entry) => entry.id === Number(id))
        return [[user ? pickUser(user, ["id", "name", "email", "role", "payment_method"]) : undefined].filter(Boolean), []]
    }

    if (normalized === "update users set name = ?, email = ?, payment_method = ? where id = ?") {
        const [name, email, paymentMethod, id] = params
        const user = store.users.find((entry) => entry.id === Number(id))
        if (!user) return [{ affectedRows: 0 }, []]
        user.name = name
        user.email = email
        user.payment_method = paymentMethod
        user.updated_at = nowIso()
        writeStore(store)
        return [{ affectedRows: 1 }, []]
    }

    if (normalized === "update users set name = ?, email = ?, password_hash = ?, payment_method = ? where id = ?") {
        const [name, email, passwordHash, paymentMethod, id] = params
        const user = store.users.find((entry) => entry.id === Number(id))
        if (!user) return [{ affectedRows: 0 }, []]
        user.name = name
        user.email = email
        user.password_hash = passwordHash
        user.payment_method = paymentMethod
        user.updated_at = nowIso()
        writeStore(store)
        return [{ affectedRows: 1 }, []]
    }

    if (normalized === "select id, name, email, phone_number, car_make, car_model, car_year, license_plate, bank_account, role from users where id = ? and role = 'driver'") {
        const [id] = params
        const user = store.users.find((entry) => entry.id === Number(id) && entry.role === "driver")
        return [[user ? pickUser(user, ["id", "name", "email", "phone_number", "car_make", "car_model", "car_year", "license_plate", "bank_account", "role"]) : undefined].filter(Boolean), []]
    }

    if (normalized === "select role from users where id = ? and role = 'driver'") {
        const [id] = params
        const user = store.users.find((entry) => entry.id === Number(id) && entry.role === "driver")
        return [[user ? { role: user.role } : undefined].filter(Boolean), []]
    }

    if (normalized === "update users set name = ?, phone_number = ?, car_make = ?, car_model = ?, car_year = ?, license_plate = ?, bank_account = ? where id = ?") {
        const [name, phoneNumber, carMake, carModel, carYear, licensePlate, bankAccount, id] = params
        const user = store.users.find((entry) => entry.id === Number(id))
        if (!user) return [{ affectedRows: 0 }, []]
        Object.assign(user, {
            name,
            phone_number: phoneNumber,
            car_make: carMake,
            car_model: carModel,
            car_year: carYear,
            license_plate: licensePlate,
            bank_account: bankAccount,
            updated_at: nowIso()
        })
        writeStore(store)
        return [{ affectedRows: 1 }, []]
    }

    if (normalized === "update users set name = ?, phone_number = ?, car_make = ?, car_model = ?, car_year = ?, license_plate = ?, bank_account = ?, password_hash = ? where id = ?") {
        const [name, phoneNumber, carMake, carModel, carYear, licensePlate, bankAccount, passwordHash, id] = params
        const user = store.users.find((entry) => entry.id === Number(id))
        if (!user) return [{ affectedRows: 0 }, []]
        Object.assign(user, {
            name,
            phone_number: phoneNumber,
            car_make: carMake,
            car_model: carModel,
            car_year: carYear,
            license_plate: licensePlate,
            bank_account: bankAccount,
            password_hash: passwordHash,
            updated_at: nowIso()
        })
        writeStore(store)
        return [{ affectedRows: 1 }, []]
    }

    if (normalized === "select id, name, email, phone_number, car_make, car_model, car_year, license_plate, bank_account from users where id = ?") {
        const [id] = params
        const user = store.users.find((entry) => entry.id === Number(id))
        return [[user ? pickUser(user, ["id", "name", "email", "phone_number", "car_make", "car_model", "car_year", "license_plate", "bank_account"]) : undefined].filter(Boolean), []]
    }

    if (normalized === "select id, name, driver_status from users where id = ? and role = 'driver'") {
        const [id] = params
        const user = store.users.find((entry) => entry.id === Number(id) && entry.role === "driver")
        return [[user ? pickUser(user, ["id", "name", "driver_status"]) : undefined].filter(Boolean), []]
    }

    if (normalized === "update users set driver_status = ? where id = ? and role = 'driver'") {
        const [status, id] = params
        const user = store.users.find((entry) => entry.id === Number(id) && entry.role === "driver")
        if (!user) return [{ affectedRows: 0 }, []]
        user.driver_status = status
        user.updated_at = nowIso()
        writeStore(store)
        return [{ affectedRows: 1 }, []]
    }

    if (normalized === "insert into trips (rider_id, pickup, dropoff, price, status, created_at) values (?, ?, ?, ?, 'pending', now())") {
        const [riderId, pickup, dropoff, price] = params
        const trip = {
            id: nextId(store, "trips"),
            rider_id: Number(riderId),
            driver_id: null,
            pickup,
            dropoff,
            price: Number(price || 0),
            status: "pending",
            created_at: nowIso()
        }
        store.trips.push(trip)
        writeStore(store)
        return [{ insertId: trip.id, affectedRows: 1 }, []]
    }

    if (normalized === "select t.*, u.name as rider_name from trips t join users u on t.rider_id = u.id where t.status = 'pending' and t.driver_id is null limit 10") {
        const trips = store.trips
            .filter((trip) => trip.status === "pending" && trip.driver_id == null)
            .slice(0, 10)
            .map((trip) => ({
                ...trip,
                rider_name: store.users.find((user) => user.id === trip.rider_id)?.name ?? null
            }))
        return [trips, []]
    }

    if (normalized === "update trips set driver_id = ?, status = 'accepted' where id = ?") {
        const [driverId, id] = params
        const trip = store.trips.find((entry) => entry.id === Number(id) && entry.driver_id == null)
        if (!trip) return [{ affectedRows: 0 }, []]
        trip.driver_id = Number(driverId)
        trip.status = "accepted"
        writeStore(store)
        return [{ affectedRows: 1 }, []]
    }

    if (normalized === "select t.*, u.name as other_user_name from trips t left join users u on t.rider_id = u.id where t.driver_id = ?") {
        const [driverId] = params
        const trips = store.trips
            .filter((trip) => trip.driver_id === Number(driverId))
            .map((trip) => ({
                ...trip,
                other_user_name: store.users.find((user) => user.id === trip.rider_id)?.name ?? null
            }))
        return [trips, []]
    }

    if (normalized === "select t.*, u.name as other_user_name from trips t left join users u on t.driver_id = u.id where t.rider_id = ?") {
        const [riderId] = params
        const trips = store.trips
            .filter((trip) => trip.rider_id === Number(riderId))
            .map((trip) => ({
                ...trip,
                other_user_name: store.users.find((user) => user.id === trip.driver_id)?.name ?? null
            }))
        return [trips, []]
    }

    if (normalized === "insert into rides (rider_id, departure_time, pickup, dropoff, available_seats, price_per_seat, total_price, status, created_at) values (?, ?, ?, ?, ?, ?, ?, 'pending', now())") {
        const [riderId, departureTime, pickup, dropoff, availableSeats, pricePerSeat, totalPrice] = params
        const ride = {
            id: nextId(store, "rides"),
            rider_id: Number(riderId),
            driver_id: Number(riderId),
            departure_time: departureTime,
            pickup,
            dropoff,
            departure: pickup,
            destination: dropoff,
            available_seats: Number(availableSeats),
            availableSeats: Number(availableSeats),
            price_per_seat: Number(pricePerSeat),
            pricePerSeat: Number(pricePerSeat),
            total_price: Number(totalPrice),
            totalPrice: Number(totalPrice),
            passengerCount: 0,
            status: "pending",
            created_at: nowIso()
        }
        store.rides.push(ride)
        writeStore(store)
        return [{ insertId: ride.id, affectedRows: 1 }, []]
    }

    if (normalized === "select * from rides where id = ? and (rider_id = ? or driver_id = ?)") {
        const [id, riderId, driverId] = params
        const ride = store.rides.find((entry) => entry.id === Number(id) && (entry.rider_id === Number(riderId) || entry.driver_id === Number(driverId)))
        return [ride ? [ride] : [], []]
    }

    if (normalized === "update rides set status = 'cancelled' where id = ?") {
        const [id] = params
        const ride = store.rides.find((entry) => entry.id === Number(id))
        if (!ride) return [{ affectedRows: 0 }, []]
        ride.status = "cancelled"
        writeStore(store)
        return [{ affectedRows: 1 }, []]
    }

    if (normalized.includes("insert into payments")) {
        const [rideId, userId, amount, stripePaymentIntentId, status] = params
        const payment = {
            id: nextId(store, "payments"),
            ride_id: rideId,
            user_id: userId,
            amount,
            stripe_payment_intent_id: stripePaymentIntentId,
            status,
            created_at: nowIso(),
            updated_at: nowIso()
        }
        store.payments.push(payment)
        writeStore(store)
        return [{ insertId: payment.id, affectedRows: 1 }, []]
    }

    if (normalized.includes("update payments set status = ? where stripe_payment_intent_id = ?")) {
        const [status, paymentIntentId] = params
        const payment = store.payments.find((entry) => entry.stripe_payment_intent_id === paymentIntentId)
        if (!payment) return [{ affectedRows: 0 }, []]
        payment.status = status
        payment.updated_at = nowIso()
        writeStore(store)
        return [{ affectedRows: 1 }, []]
    }

    if (normalized.includes("update payments set status = 'succeeded'")) {
        const [paymentIntentId] = params
        const payment = store.payments.find((entry) => entry.stripe_payment_intent_id === paymentIntentId)
        if (!payment) return [{ affectedRows: 0 }, []]
        payment.status = "succeeded"
        payment.updated_at = nowIso()
        writeStore(store)
        return [{ affectedRows: 1 }, []]
    }

    if (normalized.includes("update payments set status = 'failed'")) {
        const [paymentIntentId] = params
        const payment = store.payments.find((entry) => entry.stripe_payment_intent_id === paymentIntentId)
        if (!payment) return [{ affectedRows: 0 }, []]
        payment.status = "failed"
        payment.updated_at = nowIso()
        writeStore(store)
        return [{ affectedRows: 1 }, []]
    }

    throw new Error(`Unsupported local query: ${sql}`)
}

const db = {
    async query(sql, params = [], callback) {
        try {
            const result = queryInternal(sql, params)
            if (typeof callback === "function") {
                callback(null, result[0])
            }
            return result
        } catch (error) {
            if (typeof callback === "function") {
                callback(error)
                return undefined
            }
            throw error
        }
    }
}

export default db