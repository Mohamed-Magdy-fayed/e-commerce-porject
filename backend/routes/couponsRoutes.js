const express = require('express')

const router = express.Router()
// Get all the actions (testAPI) from the controller
const {
    getCoupons,
    getCoupon,
    addCoupon,
    deleteCoupon,
    editCoupon,
} = require('../controllers/couponsController')

// Protect the needed routes
const { protect } = require('../middleware/authMiddleware')

// Define all the routes for /api/users
router.get('/', protect, getCoupons)
router.get('/:name', protect, getCoupon)
router.post('/', protect, addCoupon)
router.delete('/:id', protect, deleteCoupon)
router.put('/:id', protect, editCoupon)

module.exports = router
