import React from 'react';
import './footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section about">
                    <h3>Công Ty Cổ Phần Trang Sức Athena</h3>
                    <p>
                        Athena Jewelry cam kết mang đến cho khách hàng những sản phẩm trang sức cao cấp và dịch vụ hoàn hảo.
                    </p>
                    <p>Hotline: 0900 123 456</p>
                    <p>Email: contact@athenajewelry.com</p>
                </div>

                <div className="footer-section links">
                    <h4>Liên Kết Nhanh</h4>
                    <ul>
                        <li><a href="/lien-he">Liên Hệ</a></li>
                        <li><a href="/gioi-thieu">Giới Thiệu</a></li>
                        <li><a href="/cau-hoi-thuong-gap">Câu Hỏi Thường Gặp</a></li>
                        <li><a href="/dieu-khoan-dich-vu">Điều Khoản Dịch Vụ</a></li>
                        <li><a href="/chinh-sach-bao-mat">Chính Sách Bảo Mật</a></li>
                    </ul>
                </div>

                <div className="footer-section social-media">
                    <h4>Kết Nối Với Chúng Tôi</h4>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Athena Jewelry. Tất cả quyền được bảo lưu.</p>
            </div>
        </footer>
    );
};

export default Footer;
