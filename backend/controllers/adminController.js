const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();

        // Calculate revenue
        const revenueResult = await Order.aggregate([
            { $match: { orderStatus: { $ne: 'Cancelled' } } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        // Monthly revenue (last 12 months)
        const monthlyRevenue = await Order.aggregate([
            { $match: { orderStatus: { $ne: 'Cancelled' }, createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)) } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Best selling products
        const bestSelling = await Product.find()
            .sort({ sold: -1 })
            .limit(5)
            .select('name price sold images category');

        // Recent orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'name email');

        // Order status distribution
        const orderStatusDist = await Order.aggregate([
            { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
        ]);

        res.json({
            totalUsers,
            totalOrders,
            totalProducts,
            totalRevenue,
            monthlyRevenue,
            bestSelling,
            recentOrders,
            orderStatusDist
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const total = await User.countDocuments();
        const users = await User.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-password');

        res.json({ users, page, pages: Math.ceil(total / limit), total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Block/unblock user (Admin)
// @route   PUT /api/admin/users/:id/block
const toggleBlockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isBlocked = !user.isBlocked;
        await user.save();
        res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}`, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Promote user to admin
// @route   PUT /api/admin/users/:id/promote
const promoteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.role = 'admin';
        await user.save();
        res.json({ message: 'User promoted to admin', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    CRUD Coupons
const createCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json(coupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
        res.json(coupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ message: 'Coupon deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Validate coupon
// @route   POST /api/admin/coupons/validate
const validateCoupon = async (req, res) => {
    try {
        const { code, cartTotal } = req.body;
        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true,
            expiresAt: { $gt: new Date() }
        });

        if (!coupon) {
            return res.status(404).json({ message: 'Invalid or expired coupon' });
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: 'Coupon usage limit reached' });
        }

        if (cartTotal < coupon.minimumPurchase) {
            return res.status(400).json({ message: `Minimum purchase of ₹${coupon.minimumPurchase} required` });
        }

        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = (cartTotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        } else {
            discount = coupon.discountValue;
        }

        res.json({
            valid: true,
            discount,
            code: coupon.code,
            description: coupon.description
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    toggleBlockUser,
    promoteUser,
    createCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon,
    validateCoupon
};
