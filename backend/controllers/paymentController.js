const stripe = require('stripe')('sk_test_51L5EiVFDbvgQGIEPornZXqZP5CssLPPG5cGgpvWtPqCte0mktHetbVf4uHLd90JVNheVDc94tSgJMSfMxnJV2m5K00XRwv4vrJ')
const asyncHandler = require('express-async-handler')
require('dotenv').config()

// @desc    Gets publishableKey
// @route   GET /api/users
// @access  Private
const getPublishableKey = asyncHandler(async (req, res) => {
    res.status(200).json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
})

// @desc    Gets all users
// @route   POST /api/users
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
    const body = req.body;

    const options = {
        ...body,
    };

    try {
        const paymentIntent = await stripe.paymentIntents.create(options);
        res.json(paymentIntent);
    } catch (err) {
        res.json(err);
    }
})

// @desc    Register new user
// @route   POST /api/users/:id
// @access  Public
const webhook = asyncHandler(async (req, res) => {
    let data;
    let eventType;
    // Check if webhook signing is configured.
    if (process.env.STRIPE_WEBHOOK_SECRET) {
        // Retrieve the event by verifying the signature using the raw body and secret.
        let event;
        let signature = req.headers["stripe-signature"];

        try {
            event = stripe.webhooks.constructEvent(
                req.rawBody,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.log(`⚠️ Webhook signature verification failed.`);
            return res.sendStatus(400);
        }
        // Extract the object from the event.
        data = event.data;
        eventType = event.type;
    } else {
        // Webhook signing is recommended, but if the secret is not configured in `config.js`,
        // retrieve the event data directly from the request body.
        data = req.body.data;
        eventType = req.body.type;
    }

    if (eventType === "payment_intent.succeeded") {
        // Fulfill any orders, e-mail receipts, etc
        console.log("💰 Payment received!");
    }

    if (eventType === "payment_intent.payment_failed") {
        // Notify the customer that their order was not fulfilled
        console.log("❌ Payment failed.");
    }

    res.sendStatus(200);
})

module.exports = {
    getPublishableKey,
    createPaymentIntent,
    webhook,
}
