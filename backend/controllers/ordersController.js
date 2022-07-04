// Handle the async requests to the API
const asyncHandler = require('express-async-handler')
// mongoDB model
const Orders = require('../models/ordersModel')
const Products = require('../models/productsModel')
const Coupons = require('../models/couponModel')

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

// validate the order total value
const validateOrder = async (products, coupon) => {
    let productsArray = []
    for (let index = 0; index < products.length; index++) {
        const product = await Products.findById(products[index].productID)
        productsArray.push(product.price * products[index].amount)
    }
    const orderTotal = parseFloat(productsArray.length > 0 ? productsArray.reduce((a, b) => a + b).toFixed(2) : 0)
    
    if (!coupon) return { totalValue: orderTotal }

    const data = await Coupons.findById(coupon)

    if (!data) return { error: `not a valid coupon` }
    if (data.validTill < Date.now()) return { error: `coupon expired` }
    if (!data.isActive) return { error: `invalid coupon` }
    if (orderTotal < data.minValue) return { error: `order value is low` }

    const discountValue = parseInt(data.value)
    const isPercentage = data.isPercentage

    const totalValue = (isPercentage ? orderTotal - (orderTotal * discountValue / 100) : orderTotal - discountValue).toFixed(2)

    return { totalValue }
}

// @desc    Add new order
// @route   POST /api/orders
// @access  private
const addOrder = asyncHandler(async (req, res) => {
    // check user privilege
    if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, account is not active` })

    const { userID, paymentMethod, transactionID, coupon, status, products } = req.body

    const orderValidation = await validateOrder(products, coupon)
    if (orderValidation.error) return res.status(400).json({ error: orderValidation.error })

    const newOrder = {
        userID,
        paymentMethod,
        transactionID,
        coupon,
        status,
        products,
        totalValue: orderValidation.totalValue
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
    if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, admin account is not active` })

    const { paymentMethod, transactionID, coupon, status, products, totalValue } = req.body
    const id = req.params.id

    // Check for order
    const doc = await Orders.findById(id)
    if (!doc) return res.status(400).json({ error: `invalid product id` })

    // update order
    const data = await Orders.findOneAndUpdate({ _id: id }, {
        paymentMethod,
        transactionID,
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