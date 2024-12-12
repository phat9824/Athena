import React from 'react';
import { Link } from 'react-router-dom';
import styles from './navbar2-home.module.css';

const Navbar2 = () => {
    return (
        <div className={styles.navbarBottom}>
            <ul className={styles.navbarLinks}>
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
                {/* <li>
                    <Link to="/Home/Contact">Liên Hệ</Link>
                </li> */}
                <li>
                    <a href="#footer">Liên Hệ</a>
                </li>

            </ul>
            <div className={styles.searchBar}>
                <input type="text" placeholder="Tìm kiếm..." />
                <button className={styles.searchButton}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
            </div>
        </div>
    );
};

export default Navbar2;
