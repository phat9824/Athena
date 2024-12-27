import React from 'react';
import Banner from '../components/user-components/banner-news.js';
import styles from './NewsEventsPage.module.css';

const NewsEventsPage = () => {
    return (
        <div>
            <Banner/>
            <div className={styles.eventContainer}>
                <h2 className={styles.heading}>Webinar "Chăm Sóc Trang Sức: Những Bí Quyết Duy Trì Vẻ Đẹp Lâu Dài"</h2>
                <p className={styles.text}>Chúng tôi rất vui mừng thông báo về một sự kiện trực tuyến đặc biệt dành cho những người yêu thích trang sức! Tham gia webinar "Chăm Sóc Trang Sức: Những Bí Quyết Duy Trì Vẻ Đẹp Lâu Dài", nơi các chuyên gia từ Athena sẽ chia sẻ những kỹ thuật và mẹo vặt giúp bạn bảo quản và chăm sóc trang sức của mình để luôn mới và bền đẹp theo thời gian.</p>
                <p className={styles.text}><strong>Chủ đề:</strong> Chăm sóc và bảo quản trang sức, cách vệ sinh đá quý và kim loại, và những lưu ý khi bảo quản trang sức tại nhà.</p>
                <p className={styles.text}><strong>Diễn giả:</strong> Chuyên gia trang sức Athena, Ms. Lê Thị Thanh Mai (Chuyên gia bảo quản trang sức).</p>
                <p className={styles.text}><strong>Thời gian:</strong> 10:00 AM, ngày 5 tháng 1 năm 2024.</p>
                <p className={styles.text}><strong>Địa điểm:</strong> Webinar trực tuyến (Link Zoom sẽ được gửi qua email sau khi đăng ký).</p>
                <p className={styles.text}><strong>Đăng ký tham gia:</strong> Vui lòng đăng ký trước <a href="https://example.com/register" target="_blank" rel="noopener noreferrer" className={styles.link}>tại đây</a> để nhận link tham gia và các tài liệu liên quan.</p>
                <p className={styles.text}><strong>Lưu ý:</strong> Sự kiện hoàn toàn miễn phí và có giới hạn số lượng người tham gia, vì vậy hãy đăng ký ngay hôm nay!</p>
            </div>
        </div>
    );
};

export default NewsEventsPage;
