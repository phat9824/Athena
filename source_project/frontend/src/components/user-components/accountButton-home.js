import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignInAlt, faUserPlus, faShoppingCart, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAppContext } from '../../AppContext';

const AccountButton = () => {
    const { isLoggedIn, username, logout } = useAppContext();
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/Home/Login');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="account-button">
        {!isLoggedIn ? (
            <button className="btn-login" onClick={handleLogin}>
                <FontAwesomeIcon icon={faUser} /> Đăng Nhập
            </button>
        ) : (
            <div className="logged-in-info">
                <span>
                    <FontAwesomeIcon icon={faUser} /> {username}
                </span>
                <button className="btn-logout" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} /> Đăng Xuất
                </button>
            </div>
        )}
    </div>
    );
};

export default AccountButton;

