const express = require('express')

const router = express.Router()
// Get all the actions from the controller
const {
    retrieveSession,
    createPayment,
} = require('../controllers/paymentController')

// Protect the needed routes
const { protect } = require('../middleware/authMiddleware')

// Define all the routes for /api/users
router.get("/retrieve/:id", protect, retrieveSession);
router.post("/create", protect, createPayment);

module.exports = router
