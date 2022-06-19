const mongoose = require('mongoose')

const couponsSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        validTill: {
            type: Number,
            required: [true, 'Please add validTill'],
        },
        applyOnCash: {
            type: Boolean,
            required: [true, 'Please add applyOnCash'],
        },
        isPercentage : {
            type: Boolean,
            required: [true, 'Please add isPercentage'],
        },
        value: {
            type: String,
            required: [true, 'Please add a value'],
        },
        isActive: {
            type: Boolean,
            required: [true, 'Please add isActive'],
        },
        minValue: {
            type: String,
            required: [true, 'Please add a minValue'],
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Coupons', couponsSchema)
