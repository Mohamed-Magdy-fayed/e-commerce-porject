// Generate a token to auth users
const jwt = require('jsonwebtoken')
// Create hashed password to be saved in DB
const bcrypt = require('bcryptjs')
// Handle the async requests to the API
const asyncHandler = require('express-async-handler')

const Carousel = require('../models/carouselModel')

// @desc    get all images
// @route   GET /api/carousel
// @access  Public
const getImages = asyncHandler(async (req, res) => {
    const data = await Carousel.find()
    if (!data) {
        res.status(500).json({ message: 'server or DB error please try again' })
        return
    } else {
        res.status(200).json(data)
    }
})

// @desc    Add new image
// @route   POST /api/carousel
// @access  private
const addImage = asyncHandler(async (req, res) => {
    if (req.user.type === 'Admin' && req.user.status === 'Active') {
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
        if (exists) {
            res.status(400)
            throw new Error('image already exists')
        } else {
            // create the image
            const data = await Carousel.create(newImage)
            if (data) {
                res.status(201).json(data)
            } else {
                res.status(401)
                throw new Error('unknowen server or DB error')
            }
        }
    } else {
        res.status(401)
        throw new Error(`Unauthorized, no privilges`)
    }
})

// @desc    Remove an image
// @route   DELETE /api/carousel/:id
// @access  private
const deleteImage = asyncHandler(async (req, res) => {
    if (req.user.type === 'Admin' && req.user.status === 'Active') {
        const id = req.params.id

        // Check for image
        const doc = await Carousel.findById(id)

        if (doc) {
            await Carousel.deleteOne({ _id: id })
            res.status(200).json({
                id: doc.id
            })
        } else {
            res.status(400)
            throw new Error('Invalid image id')
        }
    } else {
        res.status(401)
        throw new Error(`Unauthorized, no privilges`)
    }
})

// @desc    Edit an image
// @route   PUT /api/carousel/:id
// @access  private
const editImage = asyncHandler(async (req, res) => {
    if (req.user.type === 'Admin' && req.user.status === 'Active') {
        const {
            imageURL,
            productURL,
            isActive,
        } = req.body
        const id = req.params.id

        // Check for image
        const doc = await Carousel.findById(id)

        if (doc) {
            const data = await Carousel.findOneAndUpdate({ _id: id }, {
                imageURL,
                productURL,
                isActive,
            }, {
                new: true
            })
            res.status(200).json({
                updated: data
            })
        } else {
            res.status(400)
            throw new Error('Invalid image id')
        }
    } else {
        res.status(401)
        throw new Error(`Unauthorized, no privilges`)
    }
})

module.exports = {
    getImages,
    addImage,
    deleteImage,
    editImage,
}