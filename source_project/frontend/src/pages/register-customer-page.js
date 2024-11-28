import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [testApiMessage, setTestApiMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getCSRFToken();
    }, []);

    const getCSRFToken = async () => {
        try {
            await fetch('http://localhost:8000/sanctum/csrf-cookie', {
                credentials: 'include',
            });
        } catch (error) {
            console.error('Lỗi khi lấy CSRF token:', error.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage('Mật khẩu không khớp!');
            return;
        }

        try {
            await getCSRFToken();

            const xsrfToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('XSRF-TOKEN'))
            ?.split('=')[1];

            const response = await fetch('http://localhost:8000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message || 'Đăng ký thành công!');
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/Login');
                }, 2000);
            } else {
                const error = data.errors || data.message || 'Đã xảy ra lỗi, vui lòng thử lại!';
                setErrorMessage(error);
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Exception: ' + error.message);
        }
    };

    const handleTestApi = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/test');
            if (response.ok) {
                const data = await response.json();
                setTestApiMessage('OK. Respones: ' + data.message);
            } else {
                setTestApiMessage('API không phản hồi hoặc xảy ra lỗi!');
            }
        } catch (error) {
            setTestApiMessage('Lỗi kết nối: ' + error.message);
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
            <button onClick={handleTestApi}>Kiểm Tra API</button>
            {testApiMessage && <p>{testApiMessage}</p>}
        </div>
    );
};

export default Register;
