import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <div>
            <header>Admin Header</header>
            <nav>Admin Navigation</nav>
            <main>
                <Outlet /> {/* Render child routes */}
            </main>
        </div>
    );
};

export default AdminLayout;
