import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        // System preference matching layout fallback
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        async function loadUser() {
            const token = localStorage.getItem('tasksphere_token');
            if (token) {
                try {
                    const res = await authAPI.getMe();
                    setUser(res.data);
                } catch (err) {
                    localStorage.removeItem('tasksphere_token');
                }
            }
            setLoading(false);
        }
        loadUser();
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            document.body.classList.add('dark');
        } else {
            root.classList.remove('dark');
            document.body.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const login = async (email, password) => {
        const res = await authAPI.login({ email, password });
        localStorage.setItem('tasksphere_token', res.data.token);
        setUser(res.data.user);
    };

    const register = async (name, email, password) => {
        const res = await authAPI.register({ name, email, password });
        localStorage.setItem('tasksphere_token', res.data.token);
        setUser(res.data.user);
    };

    const logout = () => {
        localStorage.removeItem('tasksphere_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, theme, toggleTheme }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);