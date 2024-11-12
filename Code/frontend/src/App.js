import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomeLayout from './layouts/home-layout.js';
import HomePage from './pages/home-pages';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/Home" />} />
                <Route element={<HomeLayout />}>
                    <Route path="/Home" element={<HomePage />} />
                </Route>
            </Routes>
        </Router>
    );
};
export default App;
