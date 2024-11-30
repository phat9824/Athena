import React, { createContext, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
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

    return (
        <AppContext.Provider value={{ getCSRFToken, getCookie, baseUrl }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
