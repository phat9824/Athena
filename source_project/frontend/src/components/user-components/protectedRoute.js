import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const role = localStorage.getItem('role');

    // Nếu người dùng chưa đăng nhập
    if (!role) {
        return <Navigate to="/Home" replace />;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/Unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;