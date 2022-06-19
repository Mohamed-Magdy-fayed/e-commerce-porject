const express = require('express')

const router = express.Router()
// Get all the actions from the controller
const {
  getImages,
  addImage,
  deleteImage,
  editImage,
} = require('../controllers/carouselController')

// Protect the needed routes
const { protect } = require('../middleware/authMiddleware')

// Define all the routes for /api/carousel
router.get('/', getImages)
router.post('/', protect, addImage)
router.delete('/:id', protect, deleteImage)
router.put('/:id', protect, editImage)

module.exports = router
