// Handle the async requests to the API
const asyncHandler = require('express-async-handler')
// mongoDB model
const Orders = require('../models/ordersModel')

// @desc    get all the orders
// @route   GET /api/orders
// @access  private
const getOrders = asyncHandler(async (req, res) => {
    // check user privilege
    if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, admin account is not active` })
    if (req.user.type !== 'Admin') return res.status(401).json({ error: `access denied, not an admin` })

    // get the data
    const data = await Orders.find()
    if (!data) return res.status(500).json({ error: `server or DB error please try again` })

    res.status(200).json(data)
})

// @desc    get one order
// @route   GET /api/orders/:id
// @access  private
const getUserOrders = asyncHandler(async (req, res) => {
    // check user privilege
    if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, account is not active` })

    // get the orders
    const userID = req.params.id
    const data = await Orders.find({ userID: userID })
    if (!data) return res.status(500).json({ error: `server or DB error please try again` })

    res.status(200).json(data)
})

// @desc    Add new order
// @route   POST /api/orders
// @access  private
const addOrder = asyncHandler(async (req, res) => {
    // check user privilege
    if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, account is not active` })

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
    if (!data) return res.status(500).json({ error: `unknowen server or DB error` })

    res.status(201).json(data)
})

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  private
const deleteOrder = asyncHandler(async (req, res) => {
    // check user privilege
    if (req.user.type !== 'Admin') return res.status(401).json({ error: `access denied, not an admin` })
    if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, admin account is not active` })

    const id = req.params.id

    // Check for order
    const doc = await Orders.findById(id)
    if (!doc) return res.status(400).json({ error: `invalid order id` })

    // delete the order
    const deleted = await Orders.deleteOne({ _id: id })
    if (!deleted) return res.status(500).json({ error: `unknowen server or DB error` })

    res.status(200).json({ id: doc._id })
})

// @desc    Edit an order
// @route   PUT /api/orders/:id
// @access  private
const editOrder = asyncHandler(async (req, res) => {
    // check user privilege
    if (req.user.type !== 'Admin') return res.status(401).json({ error: `access denied, not an admin` })
    if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, admin account is not active` })

    const { paymentMethod, transactionIID, coupon, status, products, totalValue } = req.body
    const id = req.params.id

    // Check for order
    const doc = await Orders.findById(id)
    if (!doc) return res.status(400).json({ error: `invalid product id` })

    // update order
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
    if (!data) return res.status(500).json({ error: `unknowen server or DB error` })

    res.status(200).json({ updated: data })
})

module.exports = {
    getOrders,
    getUserOrders,
    addOrder,
    deleteOrder,
    editOrder,
}