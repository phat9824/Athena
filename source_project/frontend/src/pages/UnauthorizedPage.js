import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        const redirect = setTimeout(() => {
            navigate('/Home');
        }, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirect);
        };
    }, [navigate]);

    return (
        <div>
            <h1>Unauthorized Access</h1>
            <p>You do not have permission to view this page.</p>
            <p>
                Redirecting to Home in <strong>{countdown}</strong> seconds...
            </p>
            <p>
                Or{' '}
                <span
                    onClick={() => navigate('/Home')}
                    style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                >
                    Go to Home
                </span>
            </p>
        </div>
    );
};

export default Unauthorized;