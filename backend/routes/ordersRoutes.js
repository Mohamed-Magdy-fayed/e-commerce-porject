const express = require('express')

const router = express.Router()
// Get all the actions (testAPI) from the controller
const {
    getOrders,
    getOrder,
    addOrder,
    deleteOrder,
    editOrder,
} = require('../controllers/ordersController')

// Protect the needed routes
const { protect } = require('../middleware/authMiddleware')

// Define all the routes for /api/users
router.get('/', protect, getOrders)
router.get('/:id', protect, getOrder)
router.post('/', protect, addOrder)
router.delete('/:id', protect, deleteOrder)
router.put('/:id', protect, editOrder)

module.exports = router
