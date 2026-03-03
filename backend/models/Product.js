const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        maxlength: 2000
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: 0
    },
    originalPrice: {
        type: Number,
        min: 0
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: ['T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Shorts', 'Accessories', 'Shoes', 'Dresses', 'Men', 'Women', 'Jewelry', 'Bags']
    },
    subcategory: {
        type: String,
        default: ''
    },
    sizes: [{
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42', '7', '8', '9', '10', '11']
    }],
    colors: [{
        name: { type: String, required: true },
        hex: { type: String, required: true }
    }],
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    images: [{
        type: String
    }],
    ratings: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numReviews: {
        type: Number,
        default: 0
    },
    reviews: [reviewSchema],
    isFeatured: {
        type: Boolean,
        default: false
    },
    isNewArrival: {
        type: Boolean,
        default: false
    },
    brand: {
        type: String,
        default: 'UrbanWeave'
    },
    material: {
        type: String,
        default: ''
    },
    tags: [String],
    sold: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);
