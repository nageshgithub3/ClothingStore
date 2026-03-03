const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const razorpay = require('../config/razorpay');
const crypto = require('crypto');

// @desc    Create order
// @route   POST /api/orders
const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, couponCode } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Calculate prices
        let itemsPrice = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }
            itemsPrice += product.price * item.quantity;
            item.price = product.price;
            item.name = product.name;
            item.image = product.images[0] || '';
        }

        // Apply coupon
        let discountAmount = 0;
        if (couponCode) {
            const coupon = await Coupon.findOne({
                code: couponCode.toUpperCase(),
                isActive: true,
                expiresAt: { $gt: new Date() }
            });

            if (coupon && itemsPrice >= coupon.minimumPurchase) {
                if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
                    return res.status(400).json({ message: 'Coupon usage limit reached' });
                }

                if (coupon.discountType === 'percentage') {
                    discountAmount = (itemsPrice * coupon.discountValue) / 100;
                    if (coupon.maxDiscount) {
                        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
                    }
                } else {
                    discountAmount = coupon.discountValue;
                }

                coupon.usedCount += 1;
                await coupon.save();
            }
        }

        const shippingPrice = itemsPrice > 999 ? 0 : 99;
        const taxPrice = Math.round((itemsPrice - discountAmount) * 0.18 * 100) / 100;
        const totalAmount = itemsPrice + shippingPrice + taxPrice - discountAmount;

        const order = await Order.create({
            user: req.user._id,
            items,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            discountAmount,
            totalAmount,
            couponCode: couponCode || '',
            paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Pending'
        });

        // Update stock
        for (const item of items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity, sold: item.quantity }
            });
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user orders
// @route   GET /api/orders/my
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('items.product', 'name images');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.product', 'name images');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Allow admin or order owner
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
const getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        let filter = {};
        if (req.query.status) {
            filter.orderStatus = req.query.status;
        }

        const total = await Order.countDocuments(filter);
        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'name email');

        res.json({
            orders,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.orderStatus = req.body.orderStatus;

        if (req.body.trackingNumber) {
            order.trackingNumber = req.body.trackingNumber;
        }

        if (req.body.orderStatus === 'Delivered') {
            order.deliveredAt = new Date();
            order.paymentStatus = 'Paid';
        }

        if (req.body.orderStatus === 'Cancelled') {
            order.cancelledAt = new Date();
            // Restore stock
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: item.quantity, sold: -item.quantity }
                });
            }
        }

        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create Razorpay Order
// @route   POST /api/orders/razorpay
const createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        const options = {
            amount: amount * 100, // amount in paisa
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        };

        const razorOrder = await razorpay.orders.create(options);
        res.json(razorOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/orders/verify
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            const order = await Order.findById(orderId);
            if (order) {
                order.paymentStatus = 'Paid';
                order.paymentId = razorpay_payment_id;
                order.razorpayOrderId = razorpay_order_id;
                order.razorpaySignature = razorpay_signature;
                order.orderStatus = 'Confirmed';
                await order.save();
                res.json({ message: 'Payment verified successfully', order });
            } else {
                res.status(404).json({ message: 'Order not found' });
            }
        } else {
            res.status(400).json({ message: 'Invalid signature' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrder,
    getAllOrders,
    updateOrderStatus,
    createRazorpayOrder,
    verifyPayment
};
