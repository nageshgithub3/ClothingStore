import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCreditCard, FiTruck, FiCheck } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import API from '../../api';
import toast from 'react-hot-toast';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, subtotal, shipping, tax, discount, total, coupon, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState({
        fullName: '', phone: '', street: '', city: '', state: '', zipCode: '', country: 'India'
    });
    const [paymentMethod, setPaymentMethod] = useState('COD');

    const handleAddressChange = (e) => {
        setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validateAddress = () => {
        const required = ['fullName', 'phone', 'street', 'city', 'state', 'zipCode'];
        for (const field of required) {
            if (!address[field].trim()) {
                toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                return false;
            }
        }
        return true;
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const placeOrder = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to place an order');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                items: cartItems.map(item => ({
                    product: item._id,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color
                })),
                shippingAddress: address,
                paymentMethod,
                couponCode: coupon?.code || ''
            };

            // 1. Create Internal Order
            const { data: order } = await API.post('/orders', orderData);

            if (paymentMethod === 'Razorpay') {
                // 2. Load Razorpay Script
                const res = await loadRazorpay();
                if (!res) {
                    toast.error('Razorpay SDK failed to load. Are you online?');
                    setLoading(false);
                    return;
                }

                // 3. Create Razorpay Order
                const { data: razorOrder } = await API.post('/orders/razorpay', { amount: total });

                // 4. Open Razorpay SDK
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1234567890',
                    amount: razorOrder.amount,
                    currency: razorOrder.currency,
                    name: 'UrbanWeave',
                    description: 'Fashion Purchase',
                    order_id: razorOrder.id,
                    handler: async function (response) {
                        try {
                            const verifyData = {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderId: order._id
                            };
                            await API.post('/orders/verify', verifyData);
                            clearCart();
                            toast.success('Payment successful!');
                            navigate('/dashboard/orders');
                        } catch (error) {
                            toast.error('Payment verification failed. Please contact support.');
                        }
                    },
                    prefill: {
                        name: address.fullName,
                        contact: address.phone
                    },
                    theme: { color: '#0a0a0a' }
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
            } else {
                // COD Flow
                clearCart();
                toast.success('Order placed successfully!');
                navigate(`/dashboard/orders`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <h1 className="checkout-title">Checkout</h1>

                {/* Steps */}
                <div className="checkout-steps">
                    <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                        <div className="step-circle">{step > 1 ? <FiCheck /> : '1'}</div>
                        <span>Shipping</span>
                    </div>
                    <div className="step-line" />
                    <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                        <div className="step-circle">{step > 2 ? <FiCheck /> : '2'}</div>
                        <span>Payment</span>
                    </div>
                    <div className="step-line" />
                    <div className={`step ${step >= 3 ? 'active' : ''}`}>
                        <div className="step-circle">3</div>
                        <span>Review</span>
                    </div>
                </div>

                <div className="checkout-layout">
                    <div className="checkout-main">
                        {/* Step 1: Shipping */}
                        {step === 1 && (
                            <div className="checkout-section animate-fadeIn">
                                <h2><FiTruck /> Shipping Address</h2>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Full Name *</label>
                                        <input className="form-input" name="fullName" value={address.fullName} onChange={handleAddressChange} placeholder="Enter full name" />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone *</label>
                                        <input className="form-input" name="phone" value={address.phone} onChange={handleAddressChange} placeholder="Enter phone number" />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Street Address *</label>
                                        <input className="form-input" name="street" value={address.street} onChange={handleAddressChange} placeholder="House no, Street, Locality" />
                                    </div>
                                    <div className="form-group">
                                        <label>City *</label>
                                        <input className="form-input" name="city" value={address.city} onChange={handleAddressChange} placeholder="Enter city" />
                                    </div>
                                    <div className="form-group">
                                        <label>State *</label>
                                        <input className="form-input" name="state" value={address.state} onChange={handleAddressChange} placeholder="Enter state" />
                                    </div>
                                    <div className="form-group">
                                        <label>Zip Code *</label>
                                        <input className="form-input" name="zipCode" value={address.zipCode} onChange={handleAddressChange} placeholder="Enter ZIP" />
                                    </div>
                                    <div className="form-group">
                                        <label>Country</label>
                                        <input className="form-input" name="country" value={address.country} onChange={handleAddressChange} />
                                    </div>
                                </div>
                                <button className="btn btn-primary btn-lg" onClick={() => validateAddress() && setStep(2)}>
                                    Continue to Payment
                                </button>
                            </div>
                        )}

                        {/* Step 2: Payment */}
                        {step === 2 && (
                            <div className="checkout-section animate-fadeIn">
                                <h2><FiCreditCard /> Payment Method</h2>
                                <div className="payment-options">
                                    {[
                                        { value: 'COD', label: 'Cash on Delivery', desc: 'Pay when you receive' },
                                        { value: 'Razorpay', label: 'Razorpay', desc: 'Cards, UPI, Net Banking' },
                                        { value: 'UPI', label: 'UPI Payment', desc: 'Google Pay, PhonePe, Paytm' }
                                    ].map(option => (
                                        <label key={option.value} className={`payment-option ${paymentMethod === option.value ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value={option.value}
                                                checked={paymentMethod === option.value}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <div className="payment-option-content">
                                                <span className="payment-label">{option.label}</span>
                                                <span className="payment-desc">{option.desc}</span>
                                            </div>
                                            <div className="payment-radio" />
                                        </label>
                                    ))}
                                </div>
                                <div className="step-actions">
                                    <button className="btn btn-dark" onClick={() => setStep(1)}>Back</button>
                                    <button className="btn btn-primary btn-lg" onClick={() => setStep(3)}>
                                        Review Order
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Review */}
                        {step === 3 && (
                            <div className="checkout-section animate-fadeIn">
                                <h2>Review Your Order</h2>

                                <div className="review-section">
                                    <h3>Shipping To</h3>
                                    <p>{address.fullName}<br />{address.street}<br />{address.city}, {address.state} {address.zipCode}<br />{address.phone}</p>
                                </div>

                                <div className="review-section">
                                    <h3>Payment</h3>
                                    <p>{paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod}</p>
                                </div>

                                <div className="review-section">
                                    <h3>Items ({cartItems.length})</h3>
                                    {cartItems.map((item, i) => (
                                        <div key={i} className="review-item">
                                            <span className="review-item-name">{item.name} x{item.quantity}</span>
                                            <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="step-actions">
                                    <button className="btn btn-dark" onClick={() => setStep(2)}>Back</button>
                                    <button className="btn btn-primary btn-lg" onClick={placeOrder} disabled={loading}>
                                        {loading ? 'Placing Order...' : 'Place Order'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="checkout-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-items">
                            {cartItems.map((item, i) => (
                                <div key={i} className="summary-item">
                                    <span>{item.name} × {item.quantity}</span>
                                    <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="summary-lines">
                            <div className="summary-line"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                            {discount > 0 && <div className="summary-line discount-line"><span>Discount</span><span>-₹{discount.toLocaleString()}</span></div>}
                            <div className="summary-line"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                            <div className="summary-line"><span>Tax</span><span>₹{tax.toLocaleString()}</span></div>
                            <div className="summary-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
