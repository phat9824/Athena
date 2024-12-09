import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useAppContext } from '../../AppContext';
import defaultAvatar from '../../assets/default-avatar.jpg';
import styles from './login_logout_btn_home.module.css';

const AccountButton = () => {
    const { isLoggedIn, username, logout } = useAppContext();
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        setCartCount(cartItems.length);
    }, []);

    const role = localStorage.getItem('role');

    const handleLogin = () => {
        navigate('/Home/Login');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleCartClick = () => {
        navigate('./Dashboard/Cart');
    };

    const handleDashboardClick = () => {
        navigate('./Dashboard/Profile');
    };

    const handleAdminClick = () => {
        navigate('/Admin');
    };

    const userAvater = null; // Sẽ xử lí sau

    const avatar = userAvater || defaultAvatar;

    return (
        <div className={styles.accountButton}>
            {isLoggedIn ? (
                <div className={styles.loggedInInfo}>
                    {role !== '1' && role !== '2' && (
                        <>
                            <div className={styles.cartButton}
                                 onClick={handleCartClick}
                                 style={{ marginRight: 'auto' }}>
                                <FontAwesomeIcon icon={faShoppingCart} />
                                <span className={styles.cartText}>Giỏ hàng</span>
                                {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
                            </div>
                            <div className={styles.avatar} onClick={handleDashboardClick}
                                 style={{ backgroundImage: `url(${avatar})` }} />
                            <span className={styles.username} title={username} onClick={handleDashboardClick}>
                                {username.length > 20 ? `${username.slice(0, 20)}...` : username}
                            </span>
                        </>
                    )}
                    {(role === '1' || role === '2') && (
                        <button className={styles.btnAdmin} onClick={handleAdminClick}>
                            Trang Admin
                        </button>
                    )}
                </div>
            ) : (
                <button className={styles.btnLogin} onClick={handleLogin}>
                    <FontAwesomeIcon icon={faUser} /> Tài khoản
                </button>
            )}
        </div>
    );
};

export default AccountButton;