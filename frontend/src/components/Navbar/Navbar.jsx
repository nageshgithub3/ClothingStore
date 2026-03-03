import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiSearch, FiHeart, FiLogOut } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setIsMobileOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        navigate('/');
    };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <span className="logo-text">URBAN</span>
                    <span className="logo-accent">WEAVE</span>
                </Link>

                {/* Desktop Navigation */}
                <div className={`navbar-links ${isMobileOpen ? 'active' : ''}`}>
                    <Link to="/" onClick={() => setIsMobileOpen(false)}>Home</Link>
                    <Link to="/products" onClick={() => setIsMobileOpen(false)}>Shop</Link>
                    <Link to="/products?category=Men" onClick={() => setIsMobileOpen(false)}>Men</Link>
                    <Link to="/products?category=Women" onClick={() => setIsMobileOpen(false)}>Women</Link>
                    <Link to="/products?newArrivals=true" onClick={() => setIsMobileOpen(false)}>New Arrivals</Link>
                </div>

                {/* Right Actions */}
                <div className="navbar-actions">
                    {/* Search */}
                    <form className="navbar-search" onSubmit={handleSearch}>
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    {/* Wishlist */}
                    {isAuthenticated && (
                        <Link to="/dashboard/wishlist" className="navbar-icon-btn" title="Wishlist">
                            <FiHeart />
                        </Link>
                    )}

                    {/* Cart */}
                    <Link to="/cart" className="navbar-icon-btn cart-btn" title="Cart">
                        <FiShoppingBag />
                        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                    </Link>

                    {/* Profile / Auth */}
                    {isAuthenticated ? (
                        <div className="profile-dropdown">
                            <button
                                className="navbar-icon-btn profile-btn"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                            >
                                <FiUser />
                            </button>
                            {isProfileOpen && (
                                <div className="profile-menu">
                                    <div className="profile-header">
                                        <p className="profile-name">{user?.name}</p>
                                        <p className="profile-email">{user?.email}</p>
                                    </div>
                                    <div className="profile-links">
                                        <Link to="/dashboard" onClick={() => setIsProfileOpen(false)}>My Dashboard</Link>
                                        <Link to="/dashboard/orders" onClick={() => setIsProfileOpen(false)}>My Orders</Link>
                                        <Link to="/dashboard/wishlist" onClick={() => setIsProfileOpen(false)}>Wishlist</Link>
                                        {isAdmin && (
                                            <a href="http://localhost:5174" className="admin-link">
                                                Admin Panel
                                            </a>
                                        )}
                                        <button onClick={handleLogout} className="logout-btn">
                                            <FiLogOut /> Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
                    )}

                    {/* Mobile Toggle */}
                    <button
                        className="mobile-toggle"
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                    >
                        {isMobileOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Overlay */}
            {isMobileOpen && <div className="mobile-overlay" onClick={() => setIsMobileOpen(false)} />}
        </nav>
    );
};

export default Navbar;
