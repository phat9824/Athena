import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={`${styles.footerSection} ${styles.footerSectionAbout}`}>
                    <h3>Công Ty Cổ Phần Trang Sức Athena</h3>
                    <p>
                        Athena Jewelry cam kết mang đến cho khách hàng những sản phẩm trang sức cao cấp và dịch vụ hoàn hảo.
                    </p>
                    <p>Hotline: 0900 123 456</p>
                    <p>Email: contact@athenajewelry.com</p>
                </div>

                <div className={`${styles.footerSection} ${styles.footerSectionLinks}`}>
                    <h4>Liên Kết Nhanh</h4>
                    <ul>
                        <li><NavLink to="/lien-he" activeClassName={styles.activeLink}>Liên Hệ</NavLink></li>
                        <li><NavLink to="/gioi-thieu" activeClassName={styles.activeLink}>Giới Thiệu</NavLink></li>
                        <li><NavLink to="/cau-hoi-thuong-gap" activeClassName={styles.activeLink}>Câu Hỏi Thường Gặp</NavLink></li>
                        <li><NavLink to="/dieu-khoan-dich-vu" activeClassName={styles.activeLink}>Điều Khoản Dịch Vụ</NavLink></li>
                        <li><NavLink to="/chinh-sach-bao-mat" activeClassName={styles.activeLink}>Chính Sách Bảo Mật</NavLink></li>
                    </ul>
                </div>

                <div className={`${styles.footerSection} ${styles.footerSectionSocialMedia}`}>
                    <h4>Kết Nối Với Chúng Tôi</h4>
                    <div className={styles.socialIcons}>
                        <NavLink to="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</NavLink>
                        <NavLink to="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</NavLink>
                        <NavLink to="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</NavLink>
                        <NavLink to="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</NavLink>
                    </div>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <p>&copy; {new Date().getFullYear()} Athena Jewelry. Tất cả quyền được bảo lưu.</p>
            </div>
        </footer>
    );
};

export default Footer;

