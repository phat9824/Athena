import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import HomeLayout from './layouts/home-layout';
import HomePage from './pages/home-pages';

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
                path: "/Home",
                element: <HomePage />
            }
        ]
    }
]);

export default router;