import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
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

        // Sử dụng AJAX để gửi yêu cầu
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8000/api/register', true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                try {
                    const response = JSON.parse(xhr.responseText || '{}');
                    if (xhr.status === 201) {
                        setSuccessMessage('Đăng ký thành công!');
                        setErrorMessage('');
                        setTimeout(() => {
                            navigate('./Login');
                        }, 2000);
                    } else {
                        const error = response.message || response.errors || 'Đã xảy ra lỗi, vui lòng thử lại!';
                        setErrorMessage(error);
                        setSuccessMessage('');
                    }
                } catch (error) {
                    setErrorMessage('Phản hồi không hợp lệ từ server!');
                }
            }
        };
        

        xhr.send(JSON.stringify({ email, password }));
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
