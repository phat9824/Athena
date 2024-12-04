import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext.js';
import Notification from '../components/user-components/Notification.js';

const Login = () => {
    const { getCSRFToken, getCookie, baseUrl, login} = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
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
                login(res.data);
                if (['1', '2'].includes(localStorage.getItem('role'))) {
                    navigate('/Admin');
                } else {
                    navigate('/Home');
                }
            } else {
                setNotification({ message: res.message || 'Thông tin đăng nhập không chính xác!', type: 'error' });
            }
        } catch (error) {
            setNotification({ message: 'Đã xảy ra lỗi, vui lòng thử lại!', type: 'error' });
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

                {notification &&
                    (<Notification
                    message={notification.message}
                    type={notification.type}
                    duration={2000}
                    onClose={() => setNotification(null)}/>
                    )
                }
            </form>
            <p>
                Chưa có tài khoản?{' '}
                <span className="register-link" onClick={() => navigate('../Register')}>
                    Đăng ký
                </span>
            </p>
        </div>
    );
};

export default Login;