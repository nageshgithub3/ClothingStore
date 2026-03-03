import API from '../api';
import toast from 'react-hot-toast';

const OrderManager = ({ orders, fetchData }) => {
    const updateOrderStatus = async (orderId, orderStatus) => {
        try {
            await API.put(`/orders/${orderId}/status`, { orderStatus });
            toast.success(`Order ${orderStatus}`);
            fetchData();
        } catch (error) {
            toast.error('Failed to update order');
        }
    };

    return (
        <div className="admin-section animate-fadeIn">
            <h1>Orders ({orders.length})</h1>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>#{order._id.slice(-8).toUpperCase()}</td>
                                <td>{order.user?.name}</td>
                                <td>{order.items?.length}</td>
                                <td>₹{order.totalAmount?.toLocaleString()}</td>
                                <td><span className={`badge ${order.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`}>{order.paymentStatus}</span></td>
                                <td><span className={`badge ${order.orderStatus === 'Delivered' ? 'badge-success' : 'badge-warning'}`}>{order.orderStatus}</span></td>
                                <td>
                                    <select
                                        className="status-select"
                                        value={order.orderStatus}
                                        onChange={e => updateOrderStatus(order._id, e.target.value)}
                                    >
                                        {['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManager;
