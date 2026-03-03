import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import API from './api';
import AdminSidebar from './components/AdminSidebar';
import AdminTopbar from './components/AdminTopbar';
import StatsDashboard from './components/StatsDashboard';
import ProductManager from './components/ProductManager';
import OrderManager from './components/OrderManager';
import UserManager from './components/UserManager';
import CouponManager from './components/CouponManager';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { isAdmin, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const { tab } = useParams();
    const [activeTab, setActiveTab] = useState(tab || 'dashboard');

    useEffect(() => {
        setActiveTab(tab || 'dashboard');
    }, [tab]);

    const [data, setData] = useState({
        stats: null,
        products: [],
        orders: [],
        users: [],
        coupons: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated || !isAdmin) {
            navigate('/login');
            return;
        }
        fetchData();
    }, [isAuthenticated, isAdmin, authLoading]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, productsRes, ordersRes, usersRes, couponsRes] = await Promise.all([
                API.get('/admin/stats'),
                API.get('/products?limit=100'),
                API.get('/orders?limit=50'),
                API.get('/admin/users'),
                API.get('/admin/coupons')
            ]);
            setData({
                stats: statsRes.data,
                products: productsRes.data.products,
                orders: ordersRes.data.orders,
                users: usersRes.data.users,
                coupons: couponsRes.data
            });
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-container"><div className="spinner" /></div>;

    return (
        <div className="admin-page">
            <AdminTopbar />
            <div className="admin-layout">
                <AdminSidebar activeTab={activeTab} />

                <main className="admin-main">
                    {activeTab === 'dashboard' && <StatsDashboard stats={data.stats} />}
                    {activeTab === 'products' && <ProductManager products={data.products} fetchData={fetchData} />}
                    {activeTab === 'orders' && <OrderManager orders={data.orders} fetchData={fetchData} />}
                    {activeTab === 'users' && <UserManager users={data.users} fetchData={fetchData} />}
                    {activeTab === 'coupons' && <CouponManager coupons={data.coupons} />}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
