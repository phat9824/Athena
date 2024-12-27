import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from '../../AppContext';
import styles from './navbar2-home.module.css';

const Navbar2 = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const { baseUrl } = useAppContext();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const fetchSuggestions = async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/api/trangsuc?search=${query}&limit=6`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            const res = await response.json();
            if (response.ok) {
                setSuggestions(res.data || []);
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions([]);
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        fetchSuggestions(query);
    };

    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            navigate(`/Home/Products?search=${searchQuery}`);
        }
    };

    const handleSuggestionClick = (productId) => {
        navigate(`/Home/Products/${productId}`);
    };

    const handleOutsideClick = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setSuggestions([]);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

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
                    <Link to="/Home/NewsEvents">Tin Tức Sự Kiện</Link>
                </li>
                <li>
                    <a href="#footer">Liên Hệ</a>
                </li>
            </ul>
            <div className={styles.searchBar} ref={dropdownRef}>
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <button className={styles.searchButton} onClick={handleSearchSubmit}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
                {suggestions.length > 0 && (
                    <div className={styles.suggestionsDropdown}>
                        {suggestions.map((product) => (
                            <div
                                key={product.ID}
                                className={styles.suggestionItem}
                                onClick={() => handleSuggestionClick(product.ID)}
                            >
                                <img
                                    src={`${baseUrl}${product.IMAGEURL}`}
                                    alt={product.TENTS}
                                    className={styles.suggestionImage}
                                />
                                <span className={styles.suggestionName}>{product.TENTS}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar2;



/*import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './navbar2-home.module.css';

const Navbar2 = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State để quản lý menu ẩn/hiện

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // Đảo ngược trạng thái menu
    };

    return (
        <div className={styles.navbarBottom}>
            <div className={styles.menuToggle} onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <ul className={`${styles.navbarLinks} ${isMenuOpen ? styles.active : ''}`}>
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
*/