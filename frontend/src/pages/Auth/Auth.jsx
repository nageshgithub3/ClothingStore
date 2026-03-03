import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await login(email, password);
            navigate(data.role === 'admin' ? '/admin' : '/');
        } catch (err) {
            // handled in context
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-visual">
                    <div className="auth-visual-content">
                        <span className="auth-logo">URBAN<span className="gold">WEAVE</span></span>
                        <h2>Welcome Back</h2>
                        <p>Sign in to access your premium shopping experience.</p>
                    </div>
                </div>
                <div className="auth-form-section">
                    <div className="auth-form-container">
                        <h1>Sign In</h1>
                        <p className="auth-subtitle">Enter your credentials to continue</p>

                        <form onSubmit={handleSubmit}>
                            <div className="auth-input-group">
                                <FiMail className="auth-input-icon" />
                                <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="auth-input-group">
                                <FiLock className="auth-input-icon" />
                                <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="auth-demo">
                            <p>Demo Accounts:</p>
                            <button onClick={() => { setEmail('admin@urbanweave.com'); setPassword('admin123'); }}>Admin</button>
                            <button onClick={() => { setEmail('john@example.com'); setPassword('test123'); }}>User</button>
                        </div>

                        <p className="auth-switch">
                            Don't have an account? <Link to="/register">Create Account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return alert('Passwords do not match');
        }
        setLoading(true);
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            // handled in context
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-visual">
                    <div className="auth-visual-content">
                        <span className="auth-logo">URBAN<span className="gold">WEAVE</span></span>
                        <h2>Join the Community</h2>
                        <p>Create your account to start your premium fashion journey.</p>
                    </div>
                </div>
                <div className="auth-form-section">
                    <div className="auth-form-container">
                        <h1>Create Account</h1>
                        <p className="auth-subtitle">Join the UrbanWeave community</p>

                        <form onSubmit={handleSubmit}>
                            <div className="auth-input-group">
                                <FiUser className="auth-input-icon" />
                                <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="auth-input-group">
                                <FiMail className="auth-input-icon" />
                                <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="auth-input-group">
                                <FiLock className="auth-input-icon" />
                                <input type={showPassword ? 'text' : 'password'} placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            <div className="auth-input-group">
                                <FiLock className="auth-input-icon" />
                                <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        <p className="auth-switch">
                            Already have an account? <Link to="/login">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Login, Register };
