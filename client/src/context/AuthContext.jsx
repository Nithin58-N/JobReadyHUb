import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Check expiry
                    const decoded = jwtDecode(token);
                    if (decoded.exp * 1000 < Date.now()) {
                        logout();
                    } else {
                        // Fetch fresh user data
                        const { data } = await api.get('/user/profile');
                        setUser(data);
                    }
                } catch (error) {
                    console.error(error);
                    logout();
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        setUser(data);
    };

    const signup = async (name, email, password) => {
        const { data } = await api.post('/auth/signup', { name, email, password });
        localStorage.setItem('token', data.token);
        setUser(data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
