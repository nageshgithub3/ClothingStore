import { FiDollarSign, FiShoppingCart, FiUsers, FiPackage } from 'react-icons/fi';

const StatsDashboard = ({ stats }) => {
    if (!stats) return null;

    return (
        <div className="admin-section animate-fadeIn">
            <h1>Dashboard Overview</h1>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon revenue"><FiDollarSign /></div>
                    <div className="stat-info">
                        <span className="stat-value">₹{stats.totalRevenue?.toLocaleString()}</span>
                        <span className="stat-label">Total Revenue</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orders"><FiShoppingCart /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.totalOrders}</span>
                        <span className="stat-label">Total Orders</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon users"><FiUsers /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.totalUsers}</span>
                        <span className="stat-label">Total Users</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon products"><FiPackage /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.totalProducts}</span>
                        <span className="stat-label">Products</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>Best Selling Products</h3>
                    <div className="best-sellers">
                        {stats.bestSelling?.map((p, i) => (
                            <div key={i} className="best-seller-item">
                                <span className="bs-rank">#{i + 1}</span>
                                <span className="bs-name">{p.name}</span>
                                <span className="bs-sold">{p.sold} sold</span>
                                <span className="bs-price">₹{p.price?.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="dashboard-card">
                    <h3>Recent Orders</h3>
                    <div className="recent-orders">
                        {stats.recentOrders?.slice(0, 5).map((o, i) => (
                            <div key={i} className="recent-order-item">
                                <span className="ro-id">#{o._id.slice(-6).toUpperCase()}</span>
                                <span className="ro-user">{o.user?.name}</span>
                                <span className={`badge ${o.orderStatus === 'Delivered' ? 'badge-success' : o.orderStatus === 'Cancelled' ? 'badge-error' : 'badge-warning'}`}>
                                    {o.orderStatus}
                                </span>
                                <span className="ro-amount">₹{o.totalAmount?.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsDashboard;
