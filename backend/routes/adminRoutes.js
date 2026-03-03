const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
    getDashboardStats,
    getAllUsers,
    toggleBlockUser,
    promoteUser,
    createCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon,
    validateCoupon
} = require('../controllers/adminController');

// Dashboard
router.get('/stats', protect, admin, getDashboardStats);

// User management
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/block', protect, admin, toggleBlockUser);
router.put('/users/:id/promote', protect, admin, promoteUser);

// Coupon management
router.post('/coupons', protect, admin, createCoupon);
router.get('/coupons', protect, admin, getCoupons);
router.put('/coupons/:id', protect, admin, updateCoupon);
router.delete('/coupons/:id', protect, admin, deleteCoupon);
router.post('/coupons/validate', protect, validateCoupon);

module.exports = router;
