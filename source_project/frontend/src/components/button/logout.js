import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './logout.module.css';

const LogoutButton = ({ onLogout }) => {
    return (
        <div className={styles.btnLogout1} onClick={onLogout}>
            <NavLink to="/Home" className={styles.logoutLink}>
                <i className="fas fa-sign-out-alt"></i> Đăng xuất
            </NavLink>
        </div>
    );
};

export default LogoutButton;
