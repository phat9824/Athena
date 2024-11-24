import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const AccountButton = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [username, setUsername] = useState("...");

    const navigate = useNavigate()

    const handleLogin = () => {
        navigate('./Login')
        setIsLoggedIn(true);
        setUsername("ABCDEF");
    };

    const handleLogout = () => {
        navigate('..')
        setIsLoggedIn(false);
        setUsername("");
    };

    return (
        <>
            {!isLoggedIn ? (
                <button onClick={handleLogin}>Đăng Nhập</button>
            ) : (
                <div>
                    <span>{username}</span>
                    <button onClick={handleLogout}>Đăng Xuất</button>
                </div>
            )}
        </>
    );
};

export default AccountButton;
