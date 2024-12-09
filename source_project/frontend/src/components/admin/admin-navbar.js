import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './admin-navbar.css';
import logo from '../../assets/logo.png';
import { useAppContext } from '../../AppContext';
import LogoutButton from '../button/logout';

const AdminSidebar = () => {
    const {logout} = useAppContext();

    const location = useLocation();
    const role = localStorage.getItem('role');
    const hasAccess = (role, allowedRoles) => allowedRoles.includes(parseInt(role, 10));
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <img src={logo} alt="Admin Logo" className="sidebar-logo" />
            </div>
            <ul className="sidebar-menu">
                {hasAccess(role, [1,2]) && (
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
                )}

                {hasAccess(role, [1, 2]) && (
                    <li>
                        <NavLink
                            to="/admin/ManageCustomers"
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                            <i className="fas fa-user-friends"></i> Quản lý khách hàng
                        </NavLink>
                    </li>
                )}

                {hasAccess(role, [1,2]) && (
                    <li>
                        <NavLink
                            to="/admin/ManageProducts"
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                            <i className="fas fa-tags"></i> Quản lý sản phẩm
                        </NavLink>
                    </li>
                )}

                {hasAccess(role, [1,2]) && (
                    <li>
                        <NavLink
                            to="/admin/ManageInvoices"
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                            <i className="fas fa-file-invoice"></i> Quản lý hóa đơn
                        </NavLink>
                    </li>
                )}

                {hasAccess(role, [1]) && (
                    <li>
                        <NavLink
                            to="/admin/ManagePromotions"
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                            <i className="fas fa-tags"></i> Quản lý chương trình khuyến mãi
                        </NavLink>
                    </li>
                )}

                {hasAccess(role, [1]) && (
                    <li>
                        <NavLink
                            to="/admin/ManageEmployees"
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                            <i className="fas fa-users"></i> Quản lý nhân viên
                        </NavLink>
                    </li>
                )}

                {hasAccess(role, [1, 2]) && (
                    <li>
                        <NavLink
                            to="/admin/Profile"
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                            <i className="fas fa-user-circle"></i> Xem thông tin cá nhân
                        </NavLink>
                    </li>
                )}

                <LogoutButton onLogout={logout} />
            </ul>
        </div>
    );
};

export default AdminSidebar;
