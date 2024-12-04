import React, { useEffect } from 'react';
import './Notification.css'; 
const Notification = ({ message, type, duration = 2000, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleOverlayClick = () => {
        onClose();
    };

    return (
        <div className="notification-overlay" onClick={handleOverlayClick}>
            <div className={`notification-box ${type}`}>
                {message}
            </div>
        </div>
    );
};

export default Notification;
