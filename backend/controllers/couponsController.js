// Handle the async requests to the API
const asyncHandler = require('express-async-handler')
// mongoDB model
const Coupons = require('../models/couponModel')

// @desc    get all coupons
// @route   GET /api/coupons
// @access  private
const getCoupons = asyncHandler(async (req, res) => {
    // check user privilege
    if (req.user.type !== 'Admin') return res.status(401).json({ error: `access denied, not an admin` })
    // if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, admin account is not active` })

    // get the data
    const data = await Coupons.find()
    if (!data) return res.status(500).json({ error: `server or DB error please try again` })

    res.status(200).json(data)
})

// @desc    get one coupon
// @route   GET /api/coupons/:name
// @access  private
const getCoupon = asyncHandler(async (req, res) => {
    // check user privilege
    // if (req.user.status !== 'Active') return res.status(401).json({ error: `account is inactive, please contact support!` })

    const name = req.params.name

    // get the data
    const data = await Coupons.find({ name: name })
    if (!data) return res.status(400).json({ error: `Invalid coupon name` })

    res.status(200).json(data)
})

// @desc    Add new coupon
// @route   POST /api/coupons
// @access  private
const addCoupon = asyncHandler(async (req, res) => {
    // check user privilege
    if (req.user.type !== 'Admin') return res.status(401).json({ error: `access denied, not an admin` })
    // if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, admin account is not active` })

    const { name, validTill, applyOnCash, isPercentage, value, isActive, minValue } = req.body

    const newCoupon = {
        name,
        validTill,
        applyOnCash,
        isPercentage,
        value,
        isActive,
        minValue,
    }

    // create the coupon
    const data = await Coupons.create(newCoupon)
    if (!data) return res.status(500).json({ error: `unknowen server or DB error` })

    res.status(201).json(data)
})

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  private
const deleteCoupon = asyncHandler(async (req, res) => {
    // check user privilege
    if (req.user.type !== 'Admin') return res.status(401).json({ error: `access denied, not an admin` })
    // if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, admin account is not active` })

    const id = req.params.id

    // Check for product
    const doc = await Coupons.findById(id)
    if (!doc) return res.status(400).json({ error: `Invalid coupon id` })

    // delete the coupon
    const deleted = await Coupons.deleteOne({ _id: id })
    if (!deleted) return res.status(500).json({ error: `unknowen server or DB error` })

    res.status(200).json({ id: doc._id })
})

// @desc    Edit a coupon
// @route   PUT /api/coupons/:id
// @access  private
const editCoupon = asyncHandler(async (req, res) => {
    // check user privilege
    if (req.user.type !== 'Admin') return res.status(401).json({ error: `access denied, not an admin` })
    // if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, admin account is not active` })

    const { name, validTill, applyOnCash, isPercentage, value, isActive, minValue } = req.body
    const id = req.params.id

    // Check for coupon
    const doc = await Coupons.findById(id)
    if (!doc) return res.status(400).json({ error: `invalid coupon id` })

    // edit the coupon
    const data = await Coupons.findOneAndUpdate({ _id: id }, {
        name,
        validTill,
        applyOnCash,
        isPercentage,
        value,
        isActive,
        minValue
    }, {
        new: true
    })
    if (!data) return res.status(500).json({ error: `unknowen server or DB error` })

    res.status(200).json({ updated: data })
})

module.exports = {
    getCoupons,
    getCoupon,
    addCoupon,
    deleteCoupon,
    editCoupon,
}