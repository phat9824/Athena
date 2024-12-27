import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../AppContext.js';
import Notification from "../../components/user-components/Notification.js";
import styles from './ProfilePage.module.css';
import defaultAvatar from '../../assets/default-avatar.jpg';

const ProfilePage = () => {
    const { getCSRFToken, getCookie, baseUrl } = useAppContext();
    const [profile, setProfile] = useState({
        TENADMIN: '',
        EMAIL: '',
        SDT: '',
        DIACHI: '',
        IMAGEURL: null,
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

            const response = await fetch(`${baseUrl}/api/admin/profile`, {
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
                TENADMIN: data.TENADMIN || '',
                EMAIL: data.EMAIL || '',
                SDT: data.SDT || '',
                DIACHI: data.DIACHI || '',
                IMAGEURL: data.IMAGEURL || null,
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            setNotification({ message: 'Error loading admin profile!', type: 'error' });
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
            formData.append('TENADMIN', profile.TENADMIN);
            formData.append('SDT', profile.SDT);
            formData.append('DIACHI', profile.DIACHI);
            if (selectedAvatar) {
                formData.append('avatar', selectedAvatar);
            }

            const response = await fetch(`${baseUrl}/api/admin/profile/update`, {
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
                throw new Error(errorData.message || 'Failed to update profile!');
            }

            const data = await response.json();
            setProfile({
                TENADMIN: data.TENADMIN || '',
                EMAIL: data.EMAIL || '',
                SDT: data.SDT || '',
                DIACHI: data.DIACHI || '',
                IMAGEURL: data.IMAGEURL || null,
            });
            setIsEditing(false);
            setNotification({ message: 'Profile updated successfully!', type: 'success' });
        } catch (error) {
            console.error('Error updating profile:', error);
            setNotification({ message: error.message, type: 'error' });
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile((prevProfile) => ({
                    ...prevProfile,
                    IMAGEURL: reader.result,
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
        <div className={styles.profilePage}>
            <h1 className={styles.profilePageHeading}>Admin Profile</h1>
            <form>
                <div className={styles.avatarContainer}>
                    <label htmlFor="admin-avatar-upload">
                        <img
                            className={styles.avatarImg}
                            src={
                                profile.IMAGEURL
                                    ? profile.IMAGEURL.startsWith('data:')
                                        ? profile.IMAGEURL
                                        : `${baseUrl}${profile.IMAGEURL}`
                                    : defaultAvatar
                            }
                            alt="Avatar"
                        />
                    </label>
                    {isEditing && (
                        <input
                            type="file"
                            className={styles.fileInput}
                            id="admin-avatar-upload"
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                    )}
                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.label} htmlFor="TENADMIN">Name:</label>
                    <input
                        className={styles.inputField}
                        type="text"
                        id="admin-name"
                        name="TENADMIN"
                        value={profile.TENADMIN}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.label} htmlFor="EMAIL">Email:</label>
                    <input
                        className={styles.inputField}
                        type="email"
                        id="admin-email"
                        name="EMAIL"
                        value={profile.EMAIL}
                        disabled
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.label} htmlFor="SDT">Phone:</label>
                    <input
                        className={styles.inputField}
                        type="text"
                        id="admin-phone"
                        name="SDT"
                        value={profile.SDT}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.label} htmlFor="DIACHI">Address:</label>
                    <input
                        className={styles.inputField}
                        type="text"
                        id="admin-address"
                        name="DIACHI"
                        value={profile.DIACHI}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className={styles.actions}>
                    {!isEditing ? (
                        <button type="button" className={styles.editButton} onClick={() => setIsEditing(true)}>
                            Edit
                        </button>
                    ) : (
                        <>
                            <button type="button" className={styles.saveButton} onClick={handleSave}>
                                Save
                            </button>
                            <button type="button" className={styles.cancelButton} onClick={handleCancel}>
                                Cancel
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
