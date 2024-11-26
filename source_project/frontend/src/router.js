import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import HomeLayout from './layouts/home-layout';
import HomePage from './pages/home-pages';

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
                path: "/Home",
                element: <HomePage />
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
