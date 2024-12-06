import React from 'react';
import { NavLink } from 'react-router-dom';
import './logout.css';

const LogoutButton = ({ onLogout }) => {
    return (
        <div id="btn-logout1" onClick={onLogout}>
            <NavLink to="/Home" className="logout-link">
                <i className="fas fa-sign-out-alt"></i> Đăng xuất
            </NavLink>
        </div>
    );
};

export default LogoutButton;
