// Generate a token to auth users
const jwt = require('jsonwebtoken')
// Create hashed password to be saved in DB
const bcrypt = require('bcryptjs')
// Handle the async requests to the API
const asyncHandler = require('express-async-handler')

const Coupons = require('../models/couponModel')

// @desc    get all coupons
// @route   GET /api/coupons
// @access  private
const getCoupons = asyncHandler(async (req, res) => {
    if (req.user.type === 'Admin' && req.user.status === 'Active') {

        const data = await Coupons.find()
        if (!data) {
            res.status(500)
            throw new Error('server or DB error please try again')
        } else {
            res.status(200).json(data)
        }
    } else {
        res.status(401)
        throw new Error(`Unauthorized, no privilges`)
    }
})

// @desc    get one coupon
// @route   GET /api/coupons/:name
// @access  private
const getCoupon = asyncHandler(async (req, res) => {
    if (req.user.status === 'Active') {

        const name = req.params.name

        const data = await Coupons.find({ name: name })
        if (!data) {
            res.status(400)
            throw new Error('Invalid coupon name')
        } else {
            res.status(200).json(data)
        }
    } else {
        res.status(401)
        throw new Error(`Unauthorized, no privilges`)
    }
})

// @desc    Add new coupon
// @route   POST /api/coupons
// @access  private
const addCoupon = asyncHandler(async (req, res) => {
    if (req.user.type === 'Admin' && req.user.status === 'Active') {
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

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  private
const deleteCoupon = asyncHandler(async (req, res) => {
    if (req.user.type === 'Admin' && req.user.status === 'Active') {
        const id = req.params.id

        // Check for product
        const doc = await Coupons.findById(id)

        if (doc) {
            await Coupons.deleteOne({ _id: id })
            res.status(200).json({
                id: doc._id
            })
        } else {
            res.status(400)
            throw new Error('Invalid coupon id')
        }
    } else {
        res.status(401)
        throw new Error(`Unauthorized, no privilges`)
    }
})

// @desc    Edit a coupon
// @route   PUT /api/coupons/:id
// @access  private
const editCoupon = asyncHandler(async (req, res) => {
    if (req.user.type === 'Admin' && req.user.status === 'Active') {

        const { name, validTill, applyOnCash, isPercentage, value, isActive, minValue } = req.body
        const id = req.params.id

        // Check for coupon
        const doc = await Coupons.findById(id)

        if (doc) {
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
            res.status(200).json({
                updated: data
            })
        } else {
            res.status(400)
            throw new Error('Invalid coupon id')
        }
    } else {
        res.status(401)
        throw new Error(`Unauthorized, no privilges`)
    }
})

module.exports = {
    getCoupons,
    getCoupon,
    addCoupon,
    deleteCoupon,
    editCoupon,
}