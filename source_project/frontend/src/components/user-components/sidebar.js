import React from 'react';
import { NavLink } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <ul className="sidebar-menu">
                <li>
                    <NavLink 
                        to="./Profile" 
                        className={({ isActive }) => isActive ? "active" : ""}
                    >
                        Thông tin người dùng
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="./History" 
                        className={({ isActive }) => isActive ? "active" : ""}
                    >
                        Lịch sử mua
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="./Cart" 
                        className={({ isActive }) => isActive ? "active" : ""}
                    >
                        Giỏ hàng
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="./Coupons" 
                        className={({ isActive }) => isActive ? "active" : ""}
                    >
                        Mã khuyến mãi
                    </NavLink>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;