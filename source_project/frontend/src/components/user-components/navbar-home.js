import React from 'react';
import logo from '../../assets/logo.png';
import './navbar-home.css';
import AccountButton from './accountButton-home';

const Navbar = () => {
    return (
        <nav className="navbar">

            <div className="navbar-top">
                <div className="navbar-store">
                    <button>Cửa Hàng</button>
                    <span>Hotline: 0900 123 456</span>
                </div>
                <div className="navbar-logo">
                    <img src={logo} alt="Athena Jewelry" />
                </div>
                <div className="navbar-icons">
                    <AccountButton />
                    <button>Giỏ Hàng</button>
                </div>
            </div>

            <div className="navbar-bottom">
                <ul className="navbar-links">
                    <li>Trang Chủ</li>
                    <li>Sản Phẩm</li>
                    <li>Bộ Sưu Tập</li>
                    <li>Tin Tức Sự Kiện</li>
                    <li>Khuyến Mãi</li>
                    <li>Liên Hệ</li>
                </ul>
                <div className="search-bar">
                    <input type="text" placeholder="Tìm kiếm..." />
                    <button>🔍</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;



