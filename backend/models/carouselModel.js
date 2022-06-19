const mongoose = require('mongoose')

const carouselSchema = mongoose.Schema(
    {
        imageURL: {
            type: String,
            required: [true, 'Please add a url'],
        },
        productURL: {
            type: String,
        },
        isActive: {
            type: Boolean,
            required: [true, 'Please add isActive'],
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Carousel', carouselSchema)
