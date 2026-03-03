import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { FiPackage, FiHeart, FiUser, FiMapPin, FiLogOut, FiShoppingBag, FiClock, FiCheck, FiTruck, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import API from '../../api';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { tab } = useParams();
    const [activeTab, setActiveTab] = useState(tab || 'orders');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sync activeTab with URL parameter
    useEffect(() => {
        if (tab) {
            setActiveTab(tab);
        }
    }, [tab]);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/orders/my');
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (activeTab === 'orders') {
            fetchOrders();
        }
    }, [isAuthenticated, location.key, activeTab, fetchOrders]);



    const getStatusIcon = (status) => {
        switch (status) {
            case 'Processing': return <FiClock />;
            case 'Confirmed': return <FiCheck />;
            case 'Shipped': return <FiTruck />;
            case 'Delivered': return <FiCheck />;
            case 'Cancelled': return <FiX />;
            default: return <FiClock />;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Processing': return 'badge-warning';
            case 'Confirmed': return 'badge-gold';
            case 'Shipped': return 'badge-gold';
            case 'Delivered': return 'badge-success';
            case 'Cancelled': return 'badge-error';
            default: return 'badge-warning';
        }
    };

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-layout">
                    {/* Sidebar */}
                    <aside className="dashboard-sidebar">
                        <div className="sidebar-profile">
                            <div className="profile-avatar">
                                {user?.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <h3>{user?.name}</h3>
                            <p>{user?.email}</p>
                        </div>

                        <nav className="sidebar-nav">
                            <Link to="/dashboard/orders" className={`sidebar-link ${activeTab === 'orders' ? 'active' : ''}`}>
                                <FiPackage /> My Orders
                            </Link>
                            <Link to="/dashboard/profile" className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}>
                                <FiUser /> Profile
                            </Link>
                            <Link to="/dashboard/wishlist" className={`sidebar-link ${activeTab === 'wishlist' ? 'active' : ''}`}>
                                <FiHeart /> Wishlist
                            </Link>
                            <Link to="/dashboard/addresses" className={`sidebar-link ${activeTab === 'addresses' ? 'active' : ''}`}>
                                <FiMapPin /> Addresses
                            </Link>
                            <button className="sidebar-link logout" onClick={() => { logout(); navigate('/'); }}>
                                <FiLogOut /> Logout
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="dashboard-main">
                        {/* Orders */}
                        {activeTab === 'orders' && (
                            <div className="dashboard-section animate-fadeIn">
                                <h2>My Orders</h2>
                                {loading ? (
                                    <div className="loading-container"><div className="spinner" /></div>
                                ) : orders.length === 0 ? (
                                    <div className="empty-state">
                                        <FiShoppingBag className="empty-icon" />
                                        <h3>No orders yet</h3>
                                        <p>Start shopping to see your orders here.</p>
                                        <Link to="/products" className="btn btn-primary">Start Shopping</Link>
                                    </div>
                                ) : (
                                    <div className="orders-list">
                                        {orders.map(order => (
                                            <div key={order._id} className="order-card">
                                                <div className="order-header">
                                                    <div>
                                                        <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                                                        <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                    </div>
                                                    <span className={`badge ${getStatusClass(order.orderStatus)}`}>
                                                        {getStatusIcon(order.orderStatus)} {order.orderStatus}
                                                    </span>
                                                </div>
                                                <div className="order-items">
                                                    {order.items.map((item, i) => (
                                                        <div key={i} className="order-item">
                                                            <div className="order-item-icon"><FiShoppingBag /></div>
                                                            <div className="order-item-info">
                                                                <span className="order-item-name">{item.name}</span>
                                                                <span className="order-item-meta">Qty: {item.quantity}{item.size ? ` | Size: ${item.size}` : ''}</span>
                                                            </div>
                                                            <span className="order-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="order-footer">
                                                    <span className="order-total">Total: ₹{order.totalAmount.toLocaleString()}</span>
                                                    <span className="order-payment">{order.paymentMethod} • {order.paymentStatus}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Profile */}
                        {activeTab === 'profile' && (
                            <div className="dashboard-section animate-fadeIn">
                                <h2>My Profile</h2>
                                <div className="profile-card">
                                    <div className="profile-info-row">
                                        <span className="info-label">Name</span>
                                        <span className="info-value">{user?.name}</span>
                                    </div>
                                    <div className="profile-info-row">
                                        <span className="info-label">Email</span>
                                        <span className="info-value">{user?.email}</span>
                                    </div>
                                    <div className="profile-info-row">
                                        <span className="info-label">Role</span>
                                        <span className={`badge ${user?.role === 'admin' ? 'badge-gold' : 'badge-success'}`}>{user?.role}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Wishlist */}
                        {activeTab === 'wishlist' && (
                            <div className="dashboard-section animate-fadeIn">
                                <h2>My Wishlist</h2>
                                <div className="empty-state">
                                    <FiHeart className="empty-icon" />
                                    <h3>Your wishlist is empty</h3>
                                    <p>Save items you love by clicking the heart icon.</p>
                                    <Link to="/products" className="btn btn-primary">Browse Products</Link>
                                </div>
                            </div>
                        )}

                        {/* Addresses */}
                        {activeTab === 'addresses' && (
                            <div className="dashboard-section animate-fadeIn">
                                <h2>Saved Addresses</h2>
                                <div className="empty-state">
                                    <FiMapPin className="empty-icon" />
                                    <h3>No saved addresses</h3>
                                    <p>Add addresses during checkout for faster ordering.</p>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
