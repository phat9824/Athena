import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './admin-navbar.module.css'; 
import logo from '../../assets/logo.png';
import { useAppContext } from '../../AppContext';
import LogoutButton from '../button/logout';

const AdminSidebar = () => {
    const { logout } = useAppContext();
    const location = useLocation();
    const role = localStorage.getItem('role');

    const hasAccess = (role, allowedRoles) => allowedRoles.includes(parseInt(role, 10));

    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <img src={logo} alt="Admin Logo" className={styles.sidebarLogo} />
            </div>
            <ul className={styles.sidebarMenu}>
                {hasAccess(role, [1, 2]) && (
                    <li>
                        <NavLink
                            to="/admin"
                            className={({ isActive }) =>
                                `${styles.menuLink} ${
                                    isActive && location.pathname === '/admin' ? styles.active : ''
                                }`
                            }
                        >
                            <i className={`fas fa-chart-bar ${styles.icon}`}></i>
                            Xem báo cáo thống kê
                        </NavLink>
                    </li>
                )}

                {hasAccess(role, [1, 2]) && (
                    <li>
                        <NavLink
                            to="/admin/ManageCustomers"
                            className={({ isActive }) =>
                                `${styles.menuLink} ${isActive ? styles.active : ''}`
                            }
                        >
                            <i className={`fas fa-user-friends ${styles.icon}`}></i>
                            Quản lý khách hàng
                        </NavLink>
                    </li>
                )}

                {hasAccess(role, [1, 2]) && (
                    <li>
                        <NavLink
                            to="/admin/ManageProducts"
                            className={({ isActive }) =>
                                `${styles.menuLink} ${isActive ? styles.active : ''}`
                            }
                        >
                            <i className={`fas fa-tags ${styles.icon}`}></i>
                            Quản lý sản phẩm
                        </NavLink>
                    </li>
                )}

                {hasAccess(role, [1, 2]) && (
                    <li>
                        <NavLink
                            to="/admin/ManageInvoices"
                            className={({ isActive }) =>
                                `${styles.menuLink} ${isActive ? styles.active : ''}`
                            }
                        >
                            <i className={`fas fa-file-invoice ${styles.icon}`}></i>
                            Quản lý hóa đơn
                        </NavLink>
                    </li>
                )}

                {hasAccess(role, [1]) && (
                    <li>
                        <NavLink
                            to="/admin/ManagePromotions"
                            className={({ isActive }) =>
                                `${styles.menuLink} ${isActive ? styles.active : ''}`
                            }
                        >
                            <i className={`fas fa-tags ${styles.icon}`}></i>
                            Quản lý chương trình khuyến mãi
                        </NavLink>
                    </li>
                )}

                {hasAccess(role, [1]) && (
                    <li>
                        <NavLink
                            to="/admin/ManageEmployees"
                            className={({ isActive }) =>
                                `${styles.menuLink} ${isActive ? styles.active : ''}`
                            }
                        >
                            <i className={`fas fa-users ${styles.icon}`}></i>
                            Quản lý nhân viên
                        </NavLink>
                    </li>
                )}

                {hasAccess(role, [1, 2]) && (
                    <li>
                        <NavLink
                            to="/admin/Profile"
                            className={({ isActive }) =>
                                `${styles.menuLink} ${isActive ? styles.active : ''}`
                            }
                        >
                            <i className={`fas fa-user-circle ${styles.icon}`}></i>
                            Xem thông tin cá nhân
                        </NavLink>
                    </li>
                )}

                <LogoutButton onLogout={logout} />
            </ul>
        </div>
    );
};

export default AdminSidebar;
