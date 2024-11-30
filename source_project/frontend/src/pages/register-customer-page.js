import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext.js';

const Register = () => {
    const { getCSRFToken, getCookie, baseUrl} = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage('Mật khẩu không khớp!');
            return;
        }

        try {
            await getCSRFToken();
            const xsrfToken = getCookie('XSRF-TOKEN');

            const response = await fetch(`${baseUrl}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const res = await response.json();

            if (response.ok) {
                setSuccessMessage(res.message || 'Đăng ký thành công!');
                setErrorMessage('');
                setTimeout(() => {
                    navigate('../Login');
                }, 500);
            } else {
                const error = res.errors || res.message || 'Đã xảy ra lỗi, vui lòng thử lại!';
                setErrorMessage(error);
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Exception: ' + error.message);
        }
    };

    return (
        <div>
            <h1>Trang Đăng Ký</h1>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <form onSubmit={handleRegister}>
                <input
                    id="email-register"
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    id="password-register"
                    type="password"
                    placeholder="Mật khẩu"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    id="confirm-password-register"
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit">Đăng Ký</button>
            </form>
        </div>
    );
};

export default Register;
