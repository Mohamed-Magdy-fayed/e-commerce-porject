// Handle the async requests to the API
const asyncHandler = require('express-async-handler')
// mongoDB model
const Carousel = require('../models/carouselModel')

// @desc    get all carousel images
// @route   GET /api/carousel
// @access  Public
const getImages = asyncHandler(async (req, res) => {
    const data = await Carousel.find()
    if (!data) return res.status(500).json({ message: 'server or DB error please try again' })

    res.status(200).json(data)
})

// @desc    Add new image to the carousel
// @route   POST /api/carousel
// @access  private
const addImage = asyncHandler(async (req, res) => {
    // check user privilege
    if (req.user.type !== 'Admin') return res.status(401).json({ error: `access denied, not an admin` })
    // if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, admin account is not active` })

    const {
        imageURL,
        productURL,
        isActive,
    } = req.body

    const newImage = {
        imageURL,
        productURL: productURL ? productURL : '',
        isActive,
    }

    // check if image exists
    const exists = await Carousel.findOne({ imageURL: newImage.imageURL })
    if (exists) return res.status(400).json({ error: `image already exists` })

    // create the image
    const data = await Carousel.create(newImage)
    if (!data) return res.status(401).json({ error: `unknowen server or DB error` })

    res.status(201).json(data)
})

// @desc    Remove an image from carousel
// @route   DELETE /api/carousel/:id
// @access  private
const deleteImage = asyncHandler(async (req, res) => {
    // check user privilege
    if (req.user.type !== 'Admin') return res.status(401).json({ error: `access denied, not an admin` })
    // if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, admin account is not active` })

    const id = req.params.id

    // Check for image
    const doc = await Carousel.findById(id)
    if (!doc) return res.status(404).json({ error: `Invalid image id` })

    // delete the image
    const deleted = await Carousel.deleteOne({ _id: id })
    if (!deleted) return res.status(500).json({ error: `unknowen server or DB error` })

    res.status(200).json({ deletedID: doc.id })
})

// @desc    Edit an image
// @route   PUT /api/carousel/:id
// @access  private
const editImage = asyncHandler(async (req, res) => {
    // check user privilege
    if (req.user.type !== 'Admin') return res.status(401).json({ error: `access denied, not an admin` })
    // if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, admin account is not active` })

    const {
        imageURL,
        productURL,
        isActive,
    } = req.body
    const id = req.params.id

    // Check for image
    const doc = await Carousel.findById(id)
    if (!doc) return res.status(404).json({ error: `Invalid image id` })

    // update the image
    const data = await Carousel.findOneAndUpdate({ _id: id }, {
        imageURL,
        productURL,
        isActive,
    }, {
        new: true
    })
    if (!data) return res.status(500).json({ error: `unknowen server or DB error` })

    res.status(200).json({ updated: data })
})

module.exports = {
    getImages,
    addImage,
    deleteImage,
    editImage,
}