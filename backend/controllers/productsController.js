// Handle the async requests to the API
const asyncHandler = require('express-async-handler')
// mongoDB model
const Product = require('../models/productsModel')

// @desc    get all products
// @route   GET /api/products
// @access  private
const getProducts = asyncHandler(async (req, res) => {
    // check user privilege
    if (req.user.type !== 'Admin') return res.status(401).json({ error: `access denied, not an admin` })
    // if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, admin account is not active` })

    const data = await Product.find()
    if (!data) return res.status(500).json({ error: `server error please try again` })

    res.status(200).json(data)
})

// @desc    get one product
// @route   GET /api/products/one/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
    const data = await Product.findById(req.params.id)
    if (!data) return res.status(500).json({ error: `server error please try again` })

    res.status(200).json(data)
})

// @desc    search products
// @route   GET /api/products/search/:query
// @access  Public
const searchProducts = asyncHandler(async (req, res) => {
    const query = req.params.query

    // search the products
    const data = query !== 'undefined' ? await Product.find({ name: { $regex: query, $options: 'i' } }) : await Product.find()
    if (!data) return res.status(500).json({ error: `server error please try again` })

    res.status(200).json(data)
})

// @desc    Add new product
// @route   POST /api/products
// @access  private
const addProduct = asyncHandler(async (req, res) => {
    // check user privilege
    if (req.user.type !== 'Admin') return res.status(401).json({ error: `access denied, not an admin` })
    // if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, admin account is not active` })

    const { category, images, age, pieces, isFeatured, features, details, name, price, brand } = req.body
    const newProduct = {
        category,
        images,
        age,
        pieces,
        isFeatured,
        features,
        details,
        name,
        price,
        brand,
        reviews: [],
    }

    // check if product exists
    const exists = await Product.findOne({ name: newProduct.name })
    if (exists) return res.status(400).json({ error: `already exists` })

    // create the product
    const data = await Product.create(newProduct)
    if (!data) return res.status(500).json({ error: `unknowen server or DB error` })

    res.status(201).json(data)
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  private
const deleteProduct = asyncHandler(async (req, res) => {
    // check user privilege
    if (req.user.status === 'Suspended') return res.status(401).json({ error: `access denied, demo admin account` })
    if (req.user.type !== 'Admin') return res.status(401).json({ error: `access denied, not an admin` })
    if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, admin account is not active` })

    const id = req.params.id
    // Check for product
    const doc = await Product.findById(id)

    if (!doc) return res.status(400).json({ error: `invalid product id` })
    const deleted = await Product.deleteOne({ _id: id })
    if (!deleted) return res.status(500).json({ error: `unknowen server or DB error` })

    res.status(200).json({ id: doc._id })
})

// @desc    Edit a product
// @route   PUT /api/products/:id
// @access  private
const editProduct = asyncHandler(async (req, res) => {
    // check user privilege
    if (req.user.type !== 'Admin') return res.status(401).json({ error: `access denied, not an admin` })
    // if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, admin account is not active` })

    const { category, images, age, pieces, isFeatured, features, details, name, price, brand } = req.body
    const id = req.params.id

    // Check for product
    const doc = await Product.findById(id)
    if (!doc) return res.status(400).json({ error: `invalid product id` })

    const data = await Product.findOneAndUpdate({ _id: id }, {
        category,
        images,
        age,
        pieces,
        isFeatured,
        features,
        details,
        name,
        price,
        brand,
    }, {
        new: true
    })
    if (!data) return res.status(500).json({ error: `unknowen server or DB error` })

    res.status(200).json({ updated: data })
})

module.exports = {
    getProduct,
    getProducts,
    searchProducts,
    addProduct,
    deleteProduct,
    editProduct,
}