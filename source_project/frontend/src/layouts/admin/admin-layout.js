import React from 'react';

import AdminSidebar from '../../components/admin/admin-navbar'; // Đường dẫn tới sidebar
import { Outlet } from 'react-router-dom'; // Outlet để render route con

const AdminLayout = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <AdminSidebar />
            <div style={{ flex: 1, padding: '20px', background: '#f8f9fa' }}>
                {/* Outlet hiển thị các route con */}
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
