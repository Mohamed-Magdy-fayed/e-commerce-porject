require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const asyncHandler = require('express-async-handler')
const Product = require('../models/productsModel')
const Coupons = require('../models/couponModel')

// @desc    Create the payment intention
// @route   POST /create
// @access  Private
const createPayment = asyncHandler(async (req, res) => {
    // check user privilege
    if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, account is not active` })

    const orderID = req.body.data._id
    const products = req.body.data.products
    const couponID = req.body.data.coupon

    const getCoupon = async (id) => {
        const coupon = await Coupons.findById(id)
        return coupon ? coupon : null
    }

    const coupon = await getCoupon(couponID)

    const getProduct = async (product) => {
        const storeItem = await Product.findById(product.productID)
        const discount = coupon && coupon.value
        const amount = coupon && coupon.isPercentage
            ? (storeItem.price * 100) - ((storeItem.price * 100) * discount / 100)
            : (storeItem.price * 100) - discount

        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: storeItem.name
                },
                unit_amount: parseInt(amount)
            },
            quantity: product.amount
        }
    }

    let line_items = []

    for (let index = 0; index < products.length; index++) {
        const product = products[index]
        line_items.push(await getProduct(product))
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            customer: req.user._id,
            customer_email: req.user.email,
            metadata: { "orderID": orderID, "coupon": req.body.coupon, "products": JSON.stringify(products) },
            success_url: `${process.env.API_URL}profile/${req.user._id}/success`,
            cancel_url: `${process.env.API_URL}profile/${req.user._id}/cancel`,
        })

        res.status(200).json({ session })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

// @desc    Create the payment intention
// @route   POST /retrieve/:id
// @access  Private
const retrieveSession = asyncHandler(async (req, res) => {
    // check user privilege
    if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, account is not active` })

    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.id)
        res.status(200).json({ session })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

module.exports = {
    createPayment,
    retrieveSession,
}
