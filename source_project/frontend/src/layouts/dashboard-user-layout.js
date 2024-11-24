import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/user-components/sidebar.js';
import './dashboard-user-layout.js';

const DashboardLayout = () => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-content">
                <main className="dashboard-main">
                    <Outlet /> 
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
