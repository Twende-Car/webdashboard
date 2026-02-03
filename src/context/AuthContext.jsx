import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { WEB_URL } from '../services/api';

const AuthContext = createContext();

//const API_URL = 'https://twendeapi.afrimetrik.com'; // Adjust if needed

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('admin_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Set default header for axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // In a real app, you might want to verify the token with an API call
            const savedUser = localStorage.getItem('admin_user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${WEB_URL}/auth/login`, { email, password });
            const { token: newToken, user: userData } = response.data;

            if (userData.role !== 'admin') {
                throw new Error("Accès refusé. Vous n'êtes pas administrateur.");
            }

            setToken(newToken);
            setUser(userData);
            localStorage.setItem('admin_token', newToken);
            localStorage.setItem('admin_user', JSON.stringify(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Erreur lors de la connexion"
            };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
