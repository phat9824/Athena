import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './admin-navbar.css';
import logo from '../../assets/logo.png';

const AdminSidebar = () => {
    const location = useLocation();
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <img src={logo} alt="Admin Logo" className="sidebar-logo" />
            </div>
            <ul className="sidebar-menu">
                <li>
                    <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                            isActive && location.pathname === '/admin' ? 'active' : ''
                        }
                    >
                        <i className="fas fa-chart-bar"></i> Xem báo cáo thống kê
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/admin/ManageEmployees"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                        <i className="fas fa-users"></i> Quản lý nhân viên
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/admin/ManageCustomers"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                        <i className="fas fa-user-friends"></i> Quản lý khách hàng
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/admin/ManageInvoices"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                        <i className="fas fa-file-invoice"></i> Quản lý hóa đơn
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/admin/ManagePromotions"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                        <i className="fas fa-tags"></i> Quản lý chương trình khuyến mãi
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/admin/Profile"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                        <i className="fas fa-user-circle"></i> Xem thông tin cá nhân
                    </NavLink>
                </li>
                <li className="logout">
                    <NavLink to="/Home" className={({ isActive }) => (isActive ? 'active' : '')}>
                        <i className="fas fa-sign-out-alt"></i> Đăng xuất
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default AdminSidebar;
