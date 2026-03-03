import { useNavigate } from 'react-router-dom';
import { FiTrendingUp, FiBox, FiShoppingCart, FiUsers, FiTag, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = ({ activeTab }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const menuItems = [
        { key: 'dashboard', icon: <FiTrendingUp />, label: 'Dashboard', path: '/' },
        { key: 'products', icon: <FiBox />, label: 'Products', path: '/products' },
        { key: 'orders', icon: <FiShoppingCart />, label: 'Orders', path: '/orders' },
        { key: 'users', icon: <FiUsers />, label: 'Users', path: '/users' },
        { key: 'coupons', icon: <FiTag />, label: 'Coupons', path: '/coupons' },
    ];

    return (
        <aside className="admin-sidebar">
            <nav className="admin-nav">
                {menuItems.map(item => (
                    <button
                        key={item.key}
                        className={`admin-nav-btn ${activeTab === item.key ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        {item.icon} {item.label}
                    </button>
                ))}
                <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                    <button
                        className="admin-nav-btn logout-btn"
                        onClick={() => { logout(); navigate('/login'); }}
                        style={{ color: '#ff4d4d' }}
                    >
                        <FiLogOut /> Logout
                    </button>
                </div>
            </nav>
        </aside>
    );
};

export default AdminSidebar;
