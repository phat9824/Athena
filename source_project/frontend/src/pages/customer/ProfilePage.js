import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../AppContext.js';
import Notification from '../../components/user-components/Notification.js';
import styles from './ProfilePage.module.css';  // Import CSS Module
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
    const [selectedAvatar, setSelectedAvatar] = useState(null);

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

            const formData = new FormData();
            formData.append('name', profile.name);
            formData.append('email', profile.email);
            formData.append('phone', profile.phone);
            formData.append('address', profile.address);
            if (selectedAvatar) {
                formData.append('avatar', selectedAvatar);
            }

            const response = await fetch(`${baseUrl}/api/customer/profile/update`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
                },
                credentials: 'include',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Cập nhật thông tin không thành công!');
            }

            const data = await response.json();
            setProfile({
                name: data.TENKH || '',
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

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];  // Lấy file ảnh được chọn
        if (file) {
            setSelectedAvatar(file); // Lưu ảnh vào state
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile((prevProfile) => ({
                    ...prevProfile,
                    avatar: reader.result, // hiển thị tạm thời
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancel = () => {
        fetchProfile();
        setIsEditing(false);
    };

    return (
        <div className={`${styles.profilePage} ${isEditing ? styles.editing : ''}`}>
            <h1 className={styles.profilePageHeading}>Thông Tin Cá Nhân</h1>
            <form>
                <div className={styles.avatarContainer}>
                    <label htmlFor="profile-page-customer-avatar-upload">
                        <img
                            className={`${styles.avatarImg} ${isEditing ? styles.avatarImgEditable : ''}`}
                            src={
                                profile.avatar
                                    ? profile.avatar.startsWith('data:') 
                                        ? profile.avatar // Base64 URL
                                        : `${baseUrl}${profile.avatar}` 
                                    : defaultAvatar
                            }
                            alt="Avatar"
                        />
                    </label>
                    {isEditing && (
                        <input
                            type="file"
                            className={styles.fileInput}
                            id="profile-page-customer-avatar-upload"
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                    )}
                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.label} htmlFor="name">Tên:</label>
                    <input
                        className={styles.inputField}
                        type="text"
                        id="profile-page-customer-name"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.label} htmlFor="email">Email:</label>
                    <input
                        className={styles.inputField}
                        type="email"
                        id="profile-page-customer-email"
                        name="email"
                        value={profile.email}
                        disabled
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.label} htmlFor="phone">Số Điện Thoại:</label>
                    <input
                        className={styles.inputField}
                        type="text"
                        id="profile-page-customer-phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.label} htmlFor="address">Địa Chỉ:</label>
                    <input
                        className={styles.inputField}
                        type="text"
                        id="profile-page-customer-address"
                        name="address"
                        value={profile.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className={styles.actions}>
                    {!isEditing ? (
                        <button className={styles.editButton} type="button" onClick={() => setIsEditing(true)}>
                            Chỉnh Sửa
                        </button>
                    ) : (
                        <>
                            <button className={styles.saveButton} type="button" onClick={handleSave}>
                                Lưu
                            </button>
                            <button className={styles.cancelButton} type="button" onClick={handleCancel}>
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
