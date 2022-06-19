const mongoose = require('mongoose')

const UserSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'please add first name']
        },
        lastName: {
            type: String,
            required: [true, 'please add last name']
        },
        email: {
            type: String,
            required: [true, 'please add email'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'please add password']
        },
        address: {
            type: String,
            required: [true, 'please add address']
        },
        phone: {
            type: String,
            required: [true, 'please add phone']
        },
        type: {
            type: String,
            required: [true, 'please add user type']
        },
        status: {
            type: String,
            required: [true, 'please add user status']
        },
        cartItems: {
            type: [String],
        },
        wishlistItems: {
            type: [String],
        },
        orders: {
            type: [String],
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Users', UserSchema)