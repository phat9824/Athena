import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../AppContext';
import styles from './CartPage.module.css';
import Notification from '../../components/user-components/Notification';
import defaultItem from '../../assets/default_item.jpg';
import Loader from '../../components/user-components/loader.js'
const CartPage = () => {
    const { getCSRFToken, getCookie, baseUrl } = useAppContext();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [editingItems, setEditingItems] = useState([]);

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            await getCSRFToken();
            const xsrfToken = getCookie('XSRF-TOKEN');

            const response = await fetch(`${baseUrl}/api/customer/cart`, {
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

            const res = await response.json();
            // data: [{ID_TRANGSUC, TENTS, GIANIEMYET, SOLUONG, IMAGEURL}, ...]
            setCartItems(res);
        } catch (error) {
            console.error('Error fetching cart items:', error);
            setNotification({ message: 'Đã xảy ra lỗi khi tải giỏ hàng!', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (id, delta) => {
        setEditingItems((prevEditingItems) => {
            const updatedItems = [];
            for (let i = 0; i < prevEditingItems.length; i++) {
                const item = prevEditingItems[i];
                if (item.ID_TRANGSUC === id) {
                    const updatedItem = { 
                        ...item, 
                        SOLUONG: Math.max(1, item.SOLUONG + delta) 
                    };
                    updatedItems.push(updatedItem);
                } else {
                    updatedItems.push(item);
                }
            }
            return updatedItems;
        });
    };
    const handleConfirm = async () => {}

    const handleEdit = () => {
        setEditingItems(cartItems.map((item) => ({ ...item })));
    };

    const handleCancel = () => {
        setEditingItems([]);
    };

    return (
        <div className={styles.cartPage}>
            <div className={styles.mainContent}>
                <h1>Giỏ Hàng</h1>
                {loading &&  <Loader />}
                {!loading && cartItems.length === 0 && (
                    <p>Giỏ hàng của bạn đang trống.</p>
                )}
                {!loading && cartItems.length > 0 && (
                    <>
                        <div className={styles.cartItems}>
                            {(editingItems.length > 0 ? editingItems : cartItems).map((item) => (
                                <div key={item.ID_TRANGSUC} className={styles.cartItem}>
                                    <div className={styles.itemImage}>
                                        <img
                                            src={item.IMAGEURL ? `${baseUrl}${item.IMAGEURL}` : defaultItem}
                                            alt={item.TENTS}
                                        />
                                    </div>
                                    <div className={styles.itemInfo}>
                                        <h2>{item.TENTS}</h2>
                                        <p>Giá: {item.GIANIEMYET.toLocaleString()} VNĐ</p>
                                        <div className={styles.quantity}>
                                            <span>Số lượng: {item.SOLUONG}</span>
                                            {editingItems.length > 0 && (
                                                <div>
                                                    <button onClick={() => handleQuantityChange(item.ID_TRANGSUC, -1)}>
                                                        -
                                                    </button>
                                                    <button onClick={() => handleQuantityChange(item.ID_TRANGSUC, 1)}>
                                                        +
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {editingItems.length === 0 ? (
                            <button onClick={handleEdit}>Chỉnh sửa</button>
                        ) : (
                            <div>
                                <button onClick={handleConfirm}>Xác nhận</button>
                                <button onClick={handleCancel}>Hủy</button>
                            </div>
                        )}
                    </>
                )}
            </div>
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

export default CartPage;
