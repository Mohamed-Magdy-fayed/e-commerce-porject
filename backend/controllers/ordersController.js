// Generate a token to auth users
const jwt = require('jsonwebtoken')
// Create hashed password to be saved in DB
const bcrypt = require('bcryptjs')
// Handle the async requests to the API
const asyncHandler = require('express-async-handler')

const Orders = require('../models/ordersModel')

// @desc    get all orders
// @route   GET /api/orders
// @access  private
const getOrders = asyncHandler(async (req, res) => {
    const userID = req.body.userID

    if (userID) {
        const data = await Orders.find({ userID: userID })
    }
    const data = await Orders.find(userID ? { userID: userID } : {})
    if (!data) {
        res.status(500)
        throw new Error('server or DB error please try again')
    } else {
        res.status(200).json(data)
    }
})

// @desc    get one order
// @route   GET /api/orders/:id
// @access  private
const getOrder = asyncHandler(async (req, res) => {
    const data = await Orders.findById(req.params.id)
    if (!data) {
        res.status(400)
        throw new Error('Invalid order ID')
    } else {
        res.status(200).json(data)
    }
})

// @desc    Add new order
// @route   POST /api/orders
// @access  private
const addOrder = asyncHandler(async (req, res) => {
    if (req.user.status === 'Active') {
        const { userID, paymentMethod, transactionIID, coupon, status, products, totalValue } = req.body

        const newOrder = {
            userID,
            paymentMethod,
            transactionIID,
            coupon,
            status,
            products,
            totalValue,
        }

        // create the order
        const data = await Orders.create(newOrder)
        if (data) {
            res.status(201).json(data)
        } else {
            res.status(500)
            throw new Error('unknowen server or DB error')
        }

    } else {
        res.status(401)
        throw new Error(`Unauthorized, no privilges`)
    }
})

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  private
const deleteOrder = asyncHandler(async (req, res) => {
    if (req.user.type === 'Admin' && req.user.status === 'Active') {
        const id = req.params.id

        // Check for product
        const doc = await Orders.findById(id)

        if (doc) {
            await Orders.deleteOne({ _id: id })
            res.status(200).json({
                id: doc._id
            })
        } else {
            res.status(400)
            throw new Error('Invalid order id')
        }
    } else {
        res.status(401)
        throw new Error(`Unauthorized, no privilges`)
    }
})

// @desc    Edit an order
// @route   PUT /api/orders/:id
// @access  private
const editOrder = asyncHandler(async (req, res) => {
    if (req.user.status === 'Active') {

        const { paymentMethod, transactionIID, coupon, status, products, totalValue } = req.body
        const id = req.params.id

        // Check for order
        const doc = await Orders.findById(id)

        if (doc) {
            const data = await Orders.findOneAndUpdate({ _id: id }, {
                paymentMethod,
                transactionIID,
                coupon,
                status,
                products,
                totalValue,
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
    getOrders,
    getOrder,
    addOrder,
    deleteOrder,
    editOrder,
}