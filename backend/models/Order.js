const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String },
    color: { type: String }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, default: 'India' }
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'Razorpay', 'Stripe', 'UPI'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    paymentId: {
        type: String,
        default: ''
    },
    razorpayOrderId: {
        type: String,
        default: ''
    },
    razorpaySignature: {
        type: String,
        default: ''
    },
    itemsPrice: {
        type: Number,
        required: true,
        min: 0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    couponCode: {
        type: String,
        default: ''
    },
    orderStatus: {
        type: String,
        enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
        default: 'Processing'
    },
    trackingNumber: {
        type: String,
        default: ''
    },
    deliveredAt: Date,
    cancelledAt: Date,
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
