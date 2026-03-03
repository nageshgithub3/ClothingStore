import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiTag } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import API from '../../api';
import toast from 'react-hot-toast';
import { useState } from 'react';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, subtotal, shipping, tax, discount, total, coupon, setCoupon, clearCart } = useCart();
    const [couponCode, setCouponCode] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        try {
            const { data } = await API.post('/admin/coupons/validate', { code: couponCode, cartTotal: subtotal });
            setCoupon(data);
            toast.success(`Coupon applied! You save ₹${data.discount}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid coupon');
        } finally {
            setCouponLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-page empty-cart">
                <div className="container">
                    <div className="empty-cart-content">
                        <FiShoppingBag className="empty-icon" />
                        <h2>Your Cart is Empty</h2>
                        <p>Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/products" className="btn btn-primary btn-lg">
                            Start Shopping <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <h1 className="cart-title">Shopping Cart</h1>
                <p className="cart-count">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your bag</p>

                <div className="cart-layout">
                    {/* Cart Items */}
                    <div className="cart-items">
                        {cartItems.map((item, i) => (
                            <div key={`${item._id}-${item.size}-${item.color}`} className="cart-item">
                                <div className="cart-item-image">
                                    <div className="cart-item-placeholder">
                                        <FiShoppingBag />
                                    </div>
                                </div>
                                <div className="cart-item-details">
                                    <Link to={`/product/${item._id}`} className="cart-item-name">{item.name}</Link>
                                    <div className="cart-item-meta">
                                        {item.size && <span>Size: {item.size}</span>}
                                        {item.color && <span>Color: {item.color}</span>}
                                    </div>
                                    <div className="cart-item-price-row">
                                        <div className="cart-item-price">
                                            <span className="item-price">₹{item.price.toLocaleString()}</span>
                                            {item.originalPrice && item.originalPrice > item.price && (
                                                <span className="item-original-price">₹{item.originalPrice.toLocaleString()}</span>
                                            )}
                                        </div>
                                        <div className="cart-item-quantity">
                                            <button onClick={() => updateQuantity(item._id, item.size, item.color, item.quantity - 1)}>
                                                <FiMinus />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item._id, item.size, item.color, item.quantity + 1)}>
                                                <FiPlus />
                                            </button>
                                        </div>
                                        <div className="cart-item-total">
                                            ₹{(item.price * item.quantity).toLocaleString()}
                                        </div>
                                        <button
                                            className="cart-item-remove"
                                            onClick={() => removeFromCart(item._id, item.size, item.color)}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary">
                        <h3>Order Summary</h3>

                        {/* Coupon */}
                        <div className="coupon-section">
                            <div className="coupon-input-group">
                                <FiTag className="coupon-icon" />
                                <input
                                    type="text"
                                    placeholder="Enter coupon code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                />
                                <button className="btn btn-sm btn-primary" onClick={applyCoupon} disabled={couponLoading}>
                                    Apply
                                </button>
                            </div>
                            {coupon && (
                                <div className="coupon-applied">
                                    <FiTag /> {coupon.code} applied — ₹{coupon.discount} off
                                    <button onClick={() => setCoupon(null)}>×</button>
                                </div>
                            )}
                        </div>

                        <div className="summary-lines">
                            <div className="summary-line">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            {discount > 0 && (
                                <div className="summary-line discount-line">
                                    <span>Discount</span>
                                    <span>-₹{discount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="summary-line">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                            </div>
                            <div className="summary-line">
                                <span>Tax (18% GST)</span>
                                <span>₹{tax.toLocaleString()}</span>
                            </div>
                            <div className="summary-total">
                                <span>Total</span>
                                <span>₹{total.toLocaleString()}</span>
                            </div>
                        </div>

                        <Link to="/checkout" className="btn btn-primary btn-lg btn-full">
                            Proceed to Checkout <FiArrowRight />
                        </Link>

                        <Link to="/products" className="continue-shopping">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
