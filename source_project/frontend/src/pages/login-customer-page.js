import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Giả lập API đăng nhập
        const mockApiLogin = async () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (email === 'test@gmail.com' && password === '123') {
                        resolve({ success: true, token: 'abcdef' });
                    } else {
                        reject({ success: false, message: 'Thông tin đăng nhập không chính xác!' });
                    }
                }, 10);
            });
        };

        try {
            const response = await mockApiLogin();

            if (response.success) {
                localStorage.setItem('token', response.token);
                navigate('/Home/Dashboard');
            }
        } catch (error) {
            setErrorMessage(error.message || 'Đã xảy ra lỗi, vui lòng thử lại!');
        }
    };
    return (
        <div>
            <h1>Trang Đăng Nhập</h1>
            <form onSubmit={handleLogin}>
                <input id="email-login" type="email" placeholder="Email" required
                       value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input id="password-login" type="password" placeholder="Mật khẩu" required
                       value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit">Đăng Nhập</button>
            </form>
        </div>
    );
};

export default Login;
