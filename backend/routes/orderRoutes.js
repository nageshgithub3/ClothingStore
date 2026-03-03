const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
    createOrder,
    getMyOrders,
    getOrder,
    getAllOrders,
    updateOrderStatus,
    createRazorpayOrder,
    verifyPayment
} = require('../controllers/orderController');

router.post('/razorpay', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
