import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import HomeLayout from './layouts/home-layout';
import HomePage from './pages/home-pages';
import LoginPage from './pages/login-user-pages';
import DashboardLayout from './layouts/dashboard-user-layout';

// Import Admin Layout và các trang liên quan
import AdminLayout from './layouts/admin-layout';
import AdminDashboardPage from './pages/admin-dashboard-page';
import ManageProductsPage from './pages/manage-products-page';

const router = createBrowserRouter([
    // Route gốc chuyển hướng đến Home
    {
        path: "/", 
        element: <Navigate to="/Home" />
    },

    // Route cho Home
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
    // Route cho Admin
    {
        path: "/Admin",
        element: <AdminLayout />,
        children: [
            {
                path: "", // Đường dẫn gốc cho Admin
                element: <AdminDashboardPage />
            },
            {
                path: "ManageProducts", // Đường dẫn cho quản lý sản phẩm
                element: <ManageProductsPage />
            }
        ]
    }

]);

export default router;
