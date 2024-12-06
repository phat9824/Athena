import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/user-components/sidebar.js';
import './dashboard-user-layout.css';

const DashboardLayout = () => {
    return (
        <div className="dashboard-layout">
            <Sidebar
                className={`dashboard-sidebar`}
            />
            <div className="dashboard-content">
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;

