import React from 'react';
import { Link } from 'react-router-dom'; // Import Link từ react-router-dom
import logo from '../../assets/logo.png';
import './navbar-home.css';
import AccountButton from './login_logout_btn_home';

const Navbar = () => {
    return (
        <nav className="navbar">
            {/* Navbar top */}
            <div className="navbar-top">
                <div className="navbar-store">
                    <button>Cửa Hàng</button>
                    <span>Hotline: 0900 123 456</span>
                </div>
                <div className="navbar-logo">
                    <Link to="/Home">
                        <img src={logo} alt="Athena Jewelry" />
                    </Link>
                </div>
                <div className="navbar-icons">
                    <AccountButton />
                </div>
            </div>

            {/* Navbar bottom */}
            <div className="navbar-bottom">
                <ul className="navbar-links">
                    {/* Các mục navbar được liên kết */}
                    <li>
                        <Link to="/Home">Trang Chủ</Link>
                    </li>
                    <li>
                        <Link to="/Home/Products">Sản Phẩm</Link>
                    </li>
                    <li>
                        <Link to="/Home/Collections">Bộ Sưu Tập</Link>
                    </li>
                    <li>
                        <Link to="/Home/NewsEvents">Tin Tức Sự Kiện</Link>
                    </li>
                    <li>
                        <Link to="/Home/Promotions">Khuyến Mãi</Link>
                    </li>
                    <li>
                        <Link to="/Home/Contact">Liên Hệ</Link>
                    </li>
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
