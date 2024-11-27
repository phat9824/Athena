import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import HomeLayout from './layouts/home-layout';
import HomePage from './pages/home-pages';
import LoginPage from './pages/login-customer-page';
import RegisterPage from './pages/register-customer-page';
import DashboardLayout from './layouts/dashboard-user-layout';

// Import Admin Layout và các trang liên quan
import AdminLayout from './layouts/admin/admin-layout';
// Import pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageProductsPage from './pages/admin/ManageProductsPage';
import ManageEmployeesPage from './pages/admin/ManageEmployeesPage';
import ManageInvoicesPage from './pages/admin/ManageInvoicesPage';
import ManagePromotionsPage from './pages/admin/ManagePromotionsPage';
import ManageCustomers from './pages/admin/ManageCustomersPage';




import ProfilePage from './pages/admin/ProfilePage';


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
                path: "Register",
                element: <RegisterPage />
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
                path: "",
                element: <AdminDashboardPage />
            },
            {
                path: "ManageProducts",
                element: <ManageProductsPage />
            },
            {
                path: "ManageEmployees",
                element: <ManageEmployeesPage />
            },
            
            {
                path: "ManageInvoices",
                element: <ManageInvoicesPage />
            },
            {
                path: "ManageCustomers",
                element: <ManageCustomers />
            },
            {
                path: "ManagePromotions",
                element: <ManagePromotionsPage />
            },
            {
                path: "Profile",
                element: <ProfilePage />
            }
        ]
    }

]);

export default router;
