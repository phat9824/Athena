import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './sidebar.module.css'; 
import { useAppContext } from '../../AppContext';
import LogoutButton from '../button/logout';

const Sidebar = ({ className }) => {
    const { logout } = useAppContext();

    return (
        <aside className={`${styles.sidebar} ${className || ""}`}>
            <ul className={styles.sidebarMenu}>
                <li>
                    <NavLink
                        to="Profile"
                        className={({ isActive }) =>
                            isActive ? `${styles.sidebarMenuItem} ${styles.sidebarMenuItemActive}` : styles.sidebarMenuItem
                        }
                    >
                        Thông tin người dùng
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="History"
                        className={({ isActive }) =>
                            isActive ? `${styles.sidebarMenuItem} ${styles.sidebarMenuItemActive}` : styles.sidebarMenuItem
                        }
                    >
                        Lịch sử mua
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="Cart"
                        className={({ isActive }) =>
                            isActive ? `${styles.sidebarMenuItem} ${styles.sidebarMenuItemActive}` : styles.sidebarMenuItem
                        }
                    >
                        Giỏ hàng
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="Coupons"
                        className={({ isActive }) =>
                            isActive ? `${styles.sidebarMenuItem} ${styles.sidebarMenuItemActive}` : styles.sidebarMenuItem
                        }
                    >
                        Mã khuyến mãi
                    </NavLink>
                </li>
                <LogoutButton onLogout={logout}/>
            </ul>
        </aside>
    );
};

export default Sidebar;
