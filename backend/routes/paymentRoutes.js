const express = require('express')

const router = express.Router()
// Get all the actions from the controller
const {
    getPublishableKey,
    createPaymentIntent,
    webhook,
} = require('../controllers/paymentController')

// Protect the needed routes
const { protect } = require('../middleware/authMiddleware')

// Define all the routes for /api/users
router.get("/public-key", protect, getPublishableKey);

router.post("/create-payment-intent", protect, createPaymentIntent);

// Webhook handler for asynchronous events.
router.post("/webhook", protect, webhook);

module.exports = router
