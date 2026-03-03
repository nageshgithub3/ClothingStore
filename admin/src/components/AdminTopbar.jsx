import { FiUser, FiLogOut, FiBell } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const AdminTopbar = () => {
    const { user, logout } = useAuth();

    return (
        <header className="admin-topbar">
            <div className="topbar-left">
                <h2>UrbanWeave Admin</h2>
                <span className="breadcrumb">Dashboard / {location.pathname.split('/').filter(x => x).join(' / ') || 'Overview'}</span>
            </div>
            <div className="topbar-right">
                <button className="topbar-icon-btn">
                    <FiBell />
                    <span className="notification-dot"></span>
                </button>
                <div className="admin-profile">
                    <div className="admin-info">
                        <span className="admin-name">{user?.name}</span>
                        <span className="admin-role">Administrator</span>
                    </div>
                    <div className="admin-avatar">
                        {user?.name?.charAt(0) || <FiUser />}
                    </div>
                    <button className="topbar-logout-btn" onClick={logout} title="Logout">
                        <FiLogOut />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminTopbar;
