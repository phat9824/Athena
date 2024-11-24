import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import HomeLayout from './layouts/home-layout';
import HomePage from './pages/home-pages';
import LoginPage from './pages/login-user-pages';
import DashboardLayout from './layouts/dashboard-user-layout';

const router = createBrowserRouter([
    {
        path: "/", 
        element: <Navigate to="/Home" />
    },
    {
        path: "/Home",
        element: <HomeLayout />,
        children: [
            {
                path: "",
                element: <HomePage />
            },
            {
                path: "Login",
                element: <LoginPage />
            },
            {
                path: "Dashboard",
                element: <DashboardLayout />
            }
        ]
    },
]);

export default router;