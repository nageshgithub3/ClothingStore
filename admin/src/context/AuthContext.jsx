import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('urbanweave_user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await API.post('/auth/login', { email, password });
            setUser(data);
            localStorage.setItem('urbanweave_user', JSON.stringify(data));
            toast.success('Welcome back!');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            throw error;
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await API.post('/auth/register', { name, email, password });
            setUser(data);
            localStorage.setItem('urbanweave_user', JSON.stringify(data));
            toast.success('Account created successfully!');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('urbanweave_user');
        toast.success('Logged out');
    };

    const updateProfile = async (updates) => {
        try {
            const { data } = await API.put('/auth/profile', updates);
            setUser(data);
            localStorage.setItem('urbanweave_user', JSON.stringify(data));
            toast.success('Profile updated');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            updateProfile,
            isAuthenticated: !!user,
            isAdmin: user?.role === 'admin'
        }}>
            {children}
        </AuthContext.Provider>
    );
};
