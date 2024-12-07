import React from 'react';
import Navbar1 from '../components/user-components/navbar1-home';
import Navbar2 from '../components/user-components/navbar2-home';
import Footer from '../components/user-components/footer';
import { Outlet } from 'react-router-dom';

const HomeLayout = () => {
    return (
        <div className="layout">
            <Navbar1 />
            <Navbar2 />
            {/*<Navbar />*/}
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default HomeLayout;