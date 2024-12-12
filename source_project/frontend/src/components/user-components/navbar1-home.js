import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/image/logo.png';
import styles from './navbar1-home.module.css';
import AccountButton from './login_logout_btn_home';

const Navbar1 = () => {
    return (
        <div className={styles.navbarTop}>
            <div className={styles.navbarStore}>
            <button>
                <i class="fas fa-phone"></i> Hotline: 0900 123 456
            </button>
            </div>
            <div className={styles.navbarLogo}>
                <Link to="/Home">
                    <img src={logo} alt="Athena Jewelry" />
                </Link>
            </div>
            <div className={styles.navbarIcons}>
                <AccountButton />
            </div>
        </div>
    );
};

export default Navbar1;
