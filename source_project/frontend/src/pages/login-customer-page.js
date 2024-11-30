import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext.js';

const Login = () => {
    const { getCSRFToken, getCookie, baseUrl} = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);

        try {
            await getCSRFToken();
            const xsrfToken = getCookie('XSRF-TOKEN');

            const response = await fetch(`${baseUrl}/api/login`, {
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
                // Lưu JWT vào localStorage
                localStorage.setItem('token', res.token);
                navigate('/Home/Dashboard');
            } else {
                setErrorMessage(res.message || 'Thông tin đăng nhập không chính xác!');
            }
        } catch (error) {
            setErrorMessage('Đã xảy ra lỗi, vui lòng thử lại!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Trang Đăng Nhập</h1>
            <form onSubmit={handleLogin}>
                <input
                    id="email-login"
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    id="password-login"
                    type="password"
                    placeholder="Mật khẩu"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
                </button>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </form>
        </div>
    );
};

export default Login;