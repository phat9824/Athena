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

    const userAvater = null; // Sẽ xử lí sau

    const avatar = userAvater || defaultAvatar;

    return (
        <div className={styles.accountButton}>
            {isLoggedIn ? (
                <div className={styles.loggedInInfo}>
                    <div className={styles.cartButton}
                         onClick={handleCartClick}
                         style={{ marginRight: 'auto' }}>
                        <FontAwesomeIcon icon={faShoppingCart} />
                        <span className={styles.cartText}>Giỏ hàng</span>
                        {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
                    </div>
                    <div className={styles.avatar} onClick={handleDashboardClick}
                         style={{ backgroundImage: `url(${avatar})` }}> {/*Đặt là ảnh mặc định nếu không có avatar*/} 
                    </div>
                    <span className={styles.username} title={username} onClick={handleDashboardClick}>
                        {username.length > 20 ? `${username.slice(0, 20)}...` : username} {/* Nếu tên dài hơn 10 kí tự, chỉ hiển thị phần đầu*/} 
                    </span>
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