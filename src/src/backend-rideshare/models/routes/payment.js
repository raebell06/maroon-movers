import express from "express"
import stripe from "../../config/stripe.js"
import db from "../db.js"

const router = express.Router()

// Create payment intent for a ride
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { rideId, amount, userId } = req.body

    if (!rideId || !amount || !userId) {
      return res.status(400).json({
        error: "Missing required fields: rideId, amount, userId"
      })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Amount in cents
      currency: "usd",
      metadata: {
        rideId,
        userId
      }
    })

    // Save payment record to database
    const query = `
      INSERT INTO payments (ride_id, user_id, amount, stripe_payment_intent_id, status)
      VALUES (?, ?, ?, ?, ?)
    `
    db.query(query, [rideId, userId, amount, paymentIntent.id, "pending"], (err) => {
      if (err) console.error("Database error:", err)
    })

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })
  } catch (error) {
    console.error("Payment intent creation failed:", error)
    res.status(500).json({ error: error.message })
  }
})

// Confirm payment
router.post("/confirm-payment", async (req, res) => {
  try {
    const { paymentIntentId } = req.body

    if (!paymentIntentId) {
      return res.status(400).json({ error: "Payment intent ID is required" })
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    // Update payment status in database
    const query = `
      UPDATE payments SET status = ? WHERE stripe_payment_intent_id = ?
    `
    db.query(query, [paymentIntent.status, paymentIntentId], (err) => {
      if (err) console.error("Database error:", err)
    })

    res.json({
      status: paymentIntent.status,
      paymentIntentId: paymentIntent.id
    })
  } catch (error) {
    console.error("Payment confirmation failed:", error)
    res.status(500).json({ error: error.message })
  }
})

// Handle Stripe webhook
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"]

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object
        console.log("Payment succeeded:", paymentIntent.id)

        // Update database with successful payment
        const updateQuery = `
          UPDATE payments SET status = 'succeeded', updated_at = NOW() 
          WHERE stripe_payment_intent_id = ?
        `
        db.query(updateQuery, [paymentIntent.id], (err) => {
          if (err) console.error("Database error:", err)
        })
        break

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object
        console.log("Payment failed:", failedPayment.id)

        // Update database with failed payment
        const failQuery = `
          UPDATE payments SET status = 'failed', updated_at = NOW() 
          WHERE stripe_payment_intent_id = ?
        `
        db.query(failQuery, [failedPayment.id], (err) => {
          if (err) console.error("Database error:", err)
        })
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    res.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error.message)
    res.status(400).send(`Webhook Error: ${error.message}`)
  }
})

// Get payment status
router.get("/payment-status/:paymentIntentId", async (req, res) => {
  try {
    const { paymentIntentId } = req.params

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency
    })
  } catch (error) {
    console.error("Payment status retrieval failed:", error)
    res.status(500).json({ error: error.message })
  }
})

export default router
