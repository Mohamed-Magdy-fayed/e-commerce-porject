const express = require('express')

const router = express.Router()
// Get all the actions (testAPI) from the controller
const {
  getProduct,
  getProducts,
  addProduct,
  deleteProduct,
  editProduct,
} = require('../controllers/productsController')

// Protect the needed routes
const { protect } = require('../middleware/authMiddleware')

// Define all the routes for /api/users
router.get('/', getProducts)
router.get('/:id', getProduct)
router.post('/', protect, addProduct)
router.delete('/:id', protect, deleteProduct)
router.put('/:id', protect, editProduct)

module.exports = router
