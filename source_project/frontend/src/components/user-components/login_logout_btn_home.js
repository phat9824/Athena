import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignInAlt, faUserPlus, faShoppingCart, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAppContext } from '../../AppContext';
import defaultAvatar from '../../assets/default-avatar.jpg';
import './login_logout_btn_home.css'

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
        navigate('/cart');
    };

    const userAvater = null; // Sẽ xử lí sau

    const avatar = userAvater || defaultAvatar;

    return (
<div className="account-button">
            {isLoggedIn ? (
                <div className="logged-in-info">
                    <div className="cart-button"
                         onClick={handleCartClick}
                         style={{ marginRight: 'auto' }}>
                        <FontAwesomeIcon icon={faShoppingCart} />
                        <span id='cart-text'>Giỏ hàng</span>
                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </div>
                    <div className="avatar"
                         style={{backgroundImage: `url(${avatar})`,}}> {/*Đặt là ảnh mặc định nếu không có avatar*/} 
                    </div>
                    <span className="username" title={username}>
                        {username.length > 20 ? `${username.slice(0, 20)}...` : username} {/* Nếu tên dài hơn 10 kí tự, chỉ hiển thị phần đầu*/} 
                    </span>
                </div>
            ) : (
                <button className="btn-login" onClick={handleLogin}>
                    <FontAwesomeIcon icon={faUser} /> Tài khoản
                </button>
            )}
        </div>
    );
};

export default AccountButton;

