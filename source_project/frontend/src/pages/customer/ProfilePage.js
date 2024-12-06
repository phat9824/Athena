import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../AppContext';
import Notification from '../../components/user-components/Notification.js';
import './ProfilePage.css'
import defaultAvatar from '../../assets/default-avatar.jpg';

const ProfilePage = () => {
    const { getCSRFToken, getCookie, baseUrl } = useAppContext();
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        avatar: null,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            await getCSRFToken(); 
            const xsrfToken = getCookie('XSRF-TOKEN');

            const response = await fetch(`${baseUrl}/api/customer/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setProfile({
                name: data.TENKH || '',
                email: data.EMAIL || '',
                phone: data.SDT || '',
                address: data.DIACHI || '',
                avatar: data.IMAGEURL || null,
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            setNotification({ message: 'Đã xảy ra lỗi khi tải thông tin cá nhân!', type: 'error' });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            await getCSRFToken();
            const xsrfToken = getCookie('XSRF-TOKEN');

            const response = await fetch(`${baseUrl}/api/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
                },
                credentials: 'include',
                body: JSON.stringify(profile),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Cập nhật thông tin không thành công!');
            }

            const data = await response.json();
            setProfile({
                name: data.TENKH || data.TENADMIN || '',
                email: data.EMAIL || '',
                phone: data.SDT || '',
                address: data.DIACHI || '',
                avatar: data.IMAGEURL || null,
            });
            setIsEditing(false);
            setNotification({ message: 'Cập nhật thông tin thành công!', type: 'success' });
        } catch (error) {
            console.error('Error updating profile:', error);
            setNotification({ message: error.message, type: 'error' });
        }
    };

    return (
        <div className="profile-page">
            <h1>Thông Tin Cá Nhân</h1>
            <form>
                {profile.avatar ? (
                    <div>
                        <label>Ảnh Đại Diện:</label>
                        <img src={`${baseUrl}${profile.avatar}`} alt="Avatar" />
                    </div>
                ) : (
                    <div>
                        <label></label>
                        <img src={defaultAvatar} alt=""/>
                    </div>
                )}
                <div>
                    <label htmlFor="name">Tên:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={profile.name}
                        disabled={!isEditing}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        disabled="True"
                    />
                </div>
                <div>
                    <label htmlFor="phone">Số Điện Thoại:</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                <div>
                    <label htmlFor="address">Địa Chỉ:</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={profile.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                
                <div className="profile-actions">
                    {!isEditing ? (
                        <button type="button" onClick={() => setIsEditing(true)}>
                            Chỉnh Sửa
                        </button>
                    ) : (
                        <>
                            <button type="button" onClick={handleSave}>
                                Lưu
                            </button>
                            <button type="button" onClick={() => setIsEditing(false)}>
                                Hủy
                            </button>
                        </>
                    )}
                </div>
            </form>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    duration={2000}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
};

export default ProfilePage;
