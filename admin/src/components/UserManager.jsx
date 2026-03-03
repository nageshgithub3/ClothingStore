import API from '../api';
import toast from 'react-hot-toast';

const UserManager = ({ users, fetchData }) => {
    const toggleBlock = async (userId) => {
        try {
            await API.put(`/admin/users/${userId}/block`);
            toast.success('User status updated');
            fetchData();
        } catch (error) {
            toast.error('Failed to update user');
        }
    };

    return (
        <div className="admin-section animate-fadeIn">
            <h1>Users ({users.length})</h1>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id}>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td><span className={`badge ${u.role === 'admin' ? 'badge-gold' : 'badge-success'}`}>{u.role}</span></td>
                                <td><span className={`badge ${u.isBlocked ? 'badge-error' : 'badge-success'}`}>{u.isBlocked ? 'Blocked' : 'Active'}</span></td>
                                <td>
                                    <button
                                        className={`btn btn-sm ${u.isBlocked ? 'btn-primary' : 'btn-danger'}`}
                                        onClick={() => toggleBlock(u._id)}
                                    >
                                        {u.isBlocked ? 'Unblock' : 'Block'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManager;
