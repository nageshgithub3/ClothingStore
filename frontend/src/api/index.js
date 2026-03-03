import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
API.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('urbanweave_user') || 'null');
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

// Handle errors
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('urbanweave_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default API;
