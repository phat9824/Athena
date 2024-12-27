import React from 'react';
import banner from '../../assets/image/Banner/BUSINESS.png';
import styles from './banner-home.module.css';

const Banner = () => {
    return (
        <div className={styles.banner}>
            <img src={banner} alt="Athena Jewelry Banner" className={styles.bannerImage} />
        </div>
    );
};

export default Banner;