// Generate a token to auth users
const jwt = require('jsonwebtoken')
// Create hashed password to be saved in DB
const bcrypt = require('bcryptjs')
// Handle the async requests to the API
const asyncHandler = require('express-async-handler')

const Product = require('../models/productsModel')

// @desc    get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const data = await Product.find()
    if (!data) {
        res.status(500)
        throw new Error('server error please try again')
    } else {
        res.status(200).json(data)
    }
})

// @desc    get one product
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
    const data = await Product.findById(req.params.id)
    if (!data) {
        res.status(500)
        throw new Error('server error please try again')
    } else {
        res.status(200).json(data)
    }
})

// @desc    Add new product
// @route   POST /api/products
// @access  private
const addProduct = asyncHandler(async (req, res) => {
    if (req.user.type === 'Admin' && req.user.status === 'Active') {
        const { category, images, age, pieces, isFeatured, features, highlights, details, name, price, brand, tags } = req.body
        const newProduct = {
            category,
            images,
            age,
            pieces,
            isFeatured,
            features,
            highlights,
            details,
            name,
            price,
            brand,
            reviews: [],
            tags,
        }

        // check if product exists
        const exists = await Product.findOne({ name: newProduct.name })
        if (exists) {
            res.status(400)
            throw new Error('already exists')
        } else {
            // create the product
            const data = await Product.create(newProduct)
            if (data) {
                res.status(201).json(data)
            } else {
                res.status(500)
                throw new Error('unknowen server or DB error')
            }
        }
    } else {
        res.status(401)
        throw new Error(`Unauthorized, no privilges`)
    }
})

// @desc    Remove a product
// @route   DELETE /api/products/:id
// @access  private
const deleteProduct = asyncHandler(async (req, res) => {
    if (req.user.type === 'Admin' && req.user.status === 'Active') {
        const id = req.params.id

        // Check for product
        const doc = await Product.findById(id)

        if (doc) {
            await Product.deleteOne({ _id: id })
            res.status(200).json({
                id: doc._id
            })
        } else {
            res.status(400)
            throw new Error('Invalid product id')
        }
    } else {
        res.status(401)
        throw new Error(`Unauthorized, no privilges`)
    }
})

// @desc    Edit a product
// @route   PUT /api/products/:id
// @access  private
const editProduct = asyncHandler(async (req, res) => {
    if (req.user.type === 'Admin' && req.user.status === 'Active') {

        const { category, images, age, pieces, isFeatured, features, highlights, details, name, price, brand, tags } = req.body
        const id = req.params.id

        // Check for product
        const doc = await Product.findById(id)

        if (doc) {
            const data = await Product.findOneAndUpdate({ _id: id }, {
                category,
                images,
                age,
                pieces,
                isFeatured,
                features,
                highlights,
                details,
                name,
                price,
                brand,
                tags,
            }, {
                new: true
            })
            res.status(200).json({
                updated: data
            })
        } else {
            res.status(400)
            throw new Error('Invalid product id')
        }
    } else {
        res.status(401)
        throw new Error(`Unauthorized, no privilges`)
    }
})

module.exports = {
    getProduct,
    getProducts,
    addProduct,
    deleteProduct,
    editProduct,
}