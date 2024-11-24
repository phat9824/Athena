import React from 'react';
import banner from '../../assets/banner-home.png';

const Banner = () => {
    return (
        <div className="banner">
            <img src={banner} alt="Athena Jewelry Banner" className="banner-image"/>
            <div className="banner-text">
                <h1>Athena</h1>
                <p>Quà tặng ý nghĩa - Sang trọng - Thông minh</p>
            </div>
        </div>
    );
};

export default Banner;