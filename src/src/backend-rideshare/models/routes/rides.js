import express from "express";
import db from "../db.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

/* ===============
 SEARCH ADDRESSES (TomTom Autocomplete)
 =================*/
router.get("/search-address", async (req, res) => {
  const { query } = req.query;

  // Validate query
  if (!query || query.trim().length < 2) {
    return res.status(400).json({ error: "Query must be at least 2 characters" });
  }

  try {
    const response = await fetch(
      `https://api.tomtom.com/search/2/autocomplete.json?query=${encodeURIComponent(query)}&key=${process.env.TOMTOM_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error searching addresses:", error);
    res.status(500).json({ error: "Failed to search addresses" });
  }
});

/* ===============
 CREATE RIDE REQUEST
 =================*/
router.post("/create", async (req, res) => {
  const { rider_Anumber, pickup_location, dropoff_location, pickup_latitude, pickup_longitude, dropoff_latitude, dropoff_longitude } = req.body;

  if (!rider_Anumber || !pickup_location || !dropoff_location) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO rides (rider_Anumber, pickup_location, dropoff_location, pickup_latitude, pickup_longitude, dropoff_latitude, dropoff_longitude, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())",
      [rider_Anumber, pickup_location, dropoff_location, pickup_latitude, pickup_longitude, dropoff_latitude, dropoff_longitude]
    );

    res.status(201).json({
      message: "Ride request created",
      ride_id: result.insertId
    });
  } catch (error) {
    console.error("Error creating ride:", error);
    res.status(500).json({ error: "Failed to create ride request" });
  }
});

/* ===============
 SEARCH AVAILABLE RIDES
 =================*/
router.get("/search", async (req, res) => {
  const { pickup_location, dropoff_location } = req.query;

  if (!pickup_location || !dropoff_location) {
    return res.status(400).json({ error: "Please provide pickup and dropoff locations" });
  }

  try {
    // Search for pending rides matching the criteria
    const [rides] = await db.query(
      `SELECT r.ride_id, r.rider_Anumber, r.pickup_location, r.dropoff_location, 
              r.pickup_latitude, r.pickup_longitude, r.dropoff_latitude, r.dropoff_longitude,
              r.status, r.created_at, rider.firstname, rider.lastname, rider.email
       FROM rides r
       JOIN riders rider ON r.rider_Anumber = rider.rider_Anumber
       WHERE r.pickup_location LIKE ? AND r.dropoff_location LIKE ? AND r.status = 'pending'
       ORDER BY r.created_at DESC`,
      [`%${pickup_location}%`, `%${dropoff_location}%`]
    );

    res.json(rides);
  } catch (error) {
    console.error("Error searching rides:", error);
    res.status(500).json({ error: "Failed to search rides" });
  }
});

/* ===============
 DRIVER ACCEPTS RIDE
 =================*/
router.post("/:ride_id/accept", async (req, res) => {
  const { ride_id } = req.params;
  const { driver_Anumber } = req.body;

  if (!driver_Anumber) {
    return res.status(400).json({ error: "Missing driver_Anumber" });
  }

  try {
    const [result] = await db.query(
      "UPDATE rides SET driver_Anumber = ?, status = 'accepted', accepted_at = NOW() WHERE ride_id = ? AND status = 'pending'",
      [driver_Anumber, ride_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Ride not found or already accepted" });
    }

    res.json({ message: "Ride accepted successfully" });
  } catch (error) {
    console.error("Error accepting ride:", error);
    res.status(500).json({ error: "Failed to accept ride" });
  }
});

/* ===============
 GET RIDE DETAILS
 =================*/
router.get("/:ride_id", async (req, res) => {
  const { ride_id } = req.params;

  try {
    const [ride] = await db.query(
      `SELECT r.*, rider.firstname as rider_firstname, rider.lastname as rider_lastname, rider.email as rider_email,
              driver.firstname as driver_firstname, driver.lastname as driver_lastname, driver.email as driver_email, driver.phoneNO
       FROM rides r
       JOIN riders rider ON r.rider_Anumber = rider.rider_Anumber
       LEFT JOIN drivers driver ON r.driver_Anumber = driver.driver_Anumber
       WHERE r.ride_id = ?`,
      [ride_id]
    );

    if (ride.length === 0) {
      return res.status(404).json({ error: "Ride not found" });
    }

    res.json(ride[0]);
  } catch (error) {
    console.error("Error fetching ride:", error);
    res.status(500).json({ error: "Failed to fetch ride details" });
  }
});

/* ===============
 COMPLETE RIDE
 =================*/
router.post("/:ride_id/complete", async (req, res) => {
  const { ride_id } = req.params;

  try {
    const [result] = await db.query(
      "UPDATE rides SET status = 'completed', completed_at = NOW() WHERE ride_id = ? AND status = 'accepted'",
      [ride_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Ride not found or not in accepted status" });
    }

    res.json({ message: "Ride completed successfully" });
  } catch (error) {
    console.error("Error completing ride:", error);
    res.status(500).json({ error: "Failed to complete ride" });
  }
});

/* ===============
 GET RIDER'S RIDES
 =================*/
router.get("/rider/:rider_Anumber", async (req, res) => {
  const { rider_Anumber } = req.params;

  try {
    const [rides] = await db.query(
      `SELECT r.*, driver.firstname as driver_firstname, driver.lastname as driver_lastname, driver.phoneNO
       FROM rides r
       LEFT JOIN drivers driver ON r.driver_Anumber = driver.driver_Anumber
       WHERE r.rider_Anumber = ?
       ORDER BY r.created_at DESC`,
      [rider_Anumber]
    );

    res.json(rides);
  } catch (error) {
    console.error("Error fetching rider rides:", error);
    res.status(500).json({ error: "Failed to fetch rides" });
  }
});

export default router;
