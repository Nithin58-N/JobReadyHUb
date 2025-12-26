import axios from 'axios';

// Create an instance of axios
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api', // Use proxy in dev, full URL in prod if needed
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
