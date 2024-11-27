import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignInAlt, faUserPlus, faShoppingCart, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const AccountButton = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("...");
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('./Login');
        setIsLoggedIn(true);
        setUsername("Người Dùng");
    };

    const handleRegister = () => {
        navigate('./Register');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername("");
        navigate('/');
    };

    const handleAccount = () => {
        navigate('/account');
    };

    return (
        <div className="account-button">
            {!isLoggedIn ? (
                <>
                    <button onClick={handleRegister}>
                        <FontAwesomeIcon icon={faUserPlus} /> Đăng Ký
                    </button>
                    <button onClick={handleLogin}>
                        <FontAwesomeIcon icon={faSignInAlt} /> Đăng Nhập
                    </button>
                </>
            ) : (
                <>
                    <button onClick={handleAccount}>
                        <FontAwesomeIcon icon={faUser} /> Tài Khoản
                    </button>
                    <button onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> Đăng Xuất
                    </button>
                </>
            )}
        </div>
    );
};

export default AccountButton;

