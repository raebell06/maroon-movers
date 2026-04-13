# Stripe Payment Setup Guide

This document explains how to set up and configure Stripe payments for the Maroon Movers rideshare application.

## Installation

The Stripe dependency has been added to `package.json`. Install it with:

```bash
npm install
```

## Configuration

### 1. Get Stripe Credentials

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign in or create an account
3. Navigate to **Developers** → **API Keys**
4. Copy your:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and add your Stripe keys:

```bash
# Copy the file
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 3. Create Database Tables

Run the migration file to set up the payments tables:

```bash
mysql -u root -p maroon_movers < migrations/001_create_payments_table.sql
```

Or execute the SQL commands directly in your MySQL client.

### 4. Set Up Stripe Webhook (For Production/Testing)

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your endpoint URL: `https://your-domain.com/api/payments/webhook`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing Secret** and add it to `.env` as `STRIPE_WEBHOOK_SECRET`

## API Endpoints

### Create Payment Intent

**POST** `/api/payments/create-payment-intent`

Request body:
```json
{
  "rideId": 123,
  "amount": 25.50,
  "userId": 456
}
```

Response:
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### Confirm Payment

**POST** `/api/payments/confirm-payment`

Request body:
```json
{
  "paymentIntentId": "pi_xxx"
}
```

Response:
```json
{
  "status": "succeeded",
  "paymentIntentId": "pi_xxx"
}
```

### Get Payment Status

**GET** `/api/payments/payment-status/:paymentIntentId`

Response:
```json
{
  "status": "succeeded",
  "amount": 25.50,
  "currency": "usd"
}
```

### Webhook Handler

**POST** `/api/payments/webhook`

Automatically handles:
- `payment_intent.succeeded` - Updates payment status to succeeded
- `payment_intent.payment_failed` - Updates payment status to failed

## Frontend Integration

On the frontend, you'll need to use `@stripe/react-stripe-js` or similar. Example:

```javascript
import { loadStripe } from "@stripe/stripe-js"

const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)

// Use stripe.confirmPayment() with the clientSecret from your backend
```

## Testing

### Test Card Numbers

- **Visa**: 4242 4242 4242 4242
- **Visa (debit)**: 4000 0566 5566 5556
- **Mastercard**: 5555 5555 5555 4444
- **Failed payment**: 4000 0000 0000 0002

Use any future expiration date and any 3-digit CVC.

## Troubleshooting

### Webhook Not Receiving Events

- Ensure `STRIPE_WEBHOOK_SECRET` is correctly set
- Check Stripe Dashboard → Developers → Webhooks for delivery logs
- Verify your endpoint URL is publicly accessible

### Payment Intent Creation Fails

- Verify `STRIPE_SECRET_KEY` is correct
- Check that amount is in the correct format (in cents for the API)
- Ensure database connection is working

### Database Errors

- Run the migration: `npm run migrate` (if configured)
- Verify your MySQL credentials in `.env`

## Files Added

- `config/stripe.js` - Stripe SDK initialization
- `models/routes/payment.js` - Payment endpoints
- `migrations/001_create_payments_table.sql` - Database schema
- This README file

## Next Steps

1. Install dependencies: `npm install`
2. Configure environment variables in `.env`
3. Run database migrations
4. Update frontend with Stripe Elements/Payment Element
5. Test with Stripe test card numbers
6. Go live with production keys
