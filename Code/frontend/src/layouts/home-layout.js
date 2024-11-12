import React from 'react';
import Navbar from '../components/navbar-home';
import Footer from '../components/footer';
import { Outlet } from 'react-router-dom';

const HomeLayout = () => {
    return (
        <div className="layout">
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default HomeLayout;
