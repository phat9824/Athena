import React from 'react';
import banner from '../../assets/banner-home.png';
import styles from './banner-home.module.css';

const Banner = () => {
    return (
        <div className={styles.banner}>
            <img src={banner} alt="Athena Jewelry Banner" className={styles.bannerImage} />
            <div className={styles.bannerText}>
                <h1>Athena</h1>
                <p>Quà tặng ý nghĩa - Sang trọng - Thông minh</p>
            </div>
        </div>
    );
};


export default Banner;