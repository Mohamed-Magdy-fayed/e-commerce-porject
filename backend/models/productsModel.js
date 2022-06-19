const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
    {
        category: {
            type: String,
            required: [true, 'Please add a category'],
        },
        images: {
            type: [String],
            required: [true, 'Please add a images'],
        },
        age: {
            type: String,
            required: [true, 'Please add a age'],
        },
        pieces: {
            type: String,
            required: [true, 'Please add a pieces'],
        },
        isFeatured: {
            type: Boolean,
            required: [true, 'Please add a featured'],
        },
        features: {
            type: String,
            required: [true, 'Please add a features'],
        },
        highlights: {
            type: [String],
            required: [true, 'Please add a highlights'],
        },
        details: {
            type: String,
            required: [true, 'Please add a details'],
        },
        name: {
            type: String,
            required: [true, 'Please add a name'],
            unique: true,
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
        },
        brand: {
            type: String,
            required: [true, 'Please add a brand'],
        },
        reviews: {
            type: [{
                user: String,
                productRating: Number,
                reviewTitle: String,
                reviewComment: String,
                foundHelpful: Boolean,
            }],
        },
        tags: {
            type: [String],
            required: [true, 'Please add a tag'],
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Product', productSchema)
