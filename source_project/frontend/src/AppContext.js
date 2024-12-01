import React, { useState, createContext, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [id, setId] = useState('');
    const [role, setRole] = useState('');

    const baseUrl = 'http://localhost:8000';

    const getCSRFToken = async () => {
        try {
            await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
                credentials: 'include',
            });
        } catch (error) {
            console.error('Failed to get CSRF:', error.message);
        }
    };

    const getCookie = (cookieName) => {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith(`${cookieName}=`))
            ?.split('=')[1] || null;
    };

    const login = (user) => {
        localStorage.setItem('id', user.id);
        localStorage.setItem('role', user.role);
        localStorage.setItem('username', user.username);
        setIsLoggedIn(true);
        setUsername(user.username || 'Guest');
        setId(user.id);
    };

    const logout = () => {
        localStorage.removeItem('id');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUsername('');
        setId('');
    };

    return (
        <AppContext.Provider value={{ getCSRFToken, getCookie, baseUrl, isLoggedIn, username, id, login, logout }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
