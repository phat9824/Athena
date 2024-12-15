import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/user-components/protectedRoute.js';

// Import các home pages cho trang web bán hàng
import HomeLayout from './layouts/home-layout.js';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import ProductsPage from './pages/ProductsPage.js';
import CollectionsPage from './pages/CollectionsPage.js';
import NewsEventsPage from './pages/NewsEventsPage.js';
import PromotionsPage from './pages/PromotionsPage.js';
import ContactPage from './pages/ContactPage.js';
import ProductDetailsPage from "./pages/ProductDetailsPage.js";

// Import các trang trong dashboard khách hàng
import DashboardLayout from './layouts/dashboard-user-layout.js';
import CartPage from './pages/customer/CartPage.js';
import CouponsPage from './pages/customer/CouponsPage.js';
import HistoryPage from './pages/customer/HistoryPage.js';
import ProfilePageCustomer from './pages/customer/ProfilePage.js';

// Import Admin Layout và các trang liên quan
import AdminLayout from './layouts/admin/admin-layout.js';
// Import pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage.js';
import ManageProductsPage from './pages/admin/ManageProductsPage.js';
import ManageEmployeesPage from './pages/admin/ManageEmployeesPage.js';
import ManageInvoicesPage from './pages/admin/ManageInvoicesPage.js';
import ManagePromotionsPage from './pages/admin/ManagePromotionsPage.js';
import ManageCustomers from './pages/admin/ManageCustomersPage.js';


import ProfilePage from './pages/admin/ProfilePage.js';

// Othes Page
import Unauthorized from './pages/UnauthorizedPage.js';
import TestPage from './pages/TestPage.js';

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
                element: (
                    <ProtectedRoute allowedRoles={['0']}>
                        <DashboardLayout />
                    </ProtectedRoute>
                    ),
                children: [
                    {
                        path: "Cart",
                        element: <CartPage />
                    },
                    {
                        path: "Profile",
                        element: <ProfilePageCustomer />
                    },
                    {
                        path: "History",
                        element: <HistoryPage />
                    },
                    {
                        path: "Coupons",
                        element: <CouponsPage />
                    },
                ]
            },
            {
                path: "Products",
                element: <ProductsPage />
            },
            {
                path: "Products/:id",
                element: <ProductDetailsPage />
            },
            {
                path: "Collections",
                element: <CollectionsPage />
            },
            {
                path: "NewsEvents",
                element: <NewsEventsPage />
            },
            {
                path: "Promotions",
                element: <PromotionsPage />
            },
            {
                path: "Contact",
                element: <ContactPage />
            }
        ]
    },
    // Route cho Admin
    {
        path: "/Admin",
        element: (
            <ProtectedRoute allowedRoles={['1', '2']}>
                <AdminLayout />
            </ProtectedRoute>
        ),
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
    },

    {
        path: "/Unauthorized",
        element: <Unauthorized />
    },

    {
        path: "/test",
        element: <TestPage />
    }

]);

export default router;
