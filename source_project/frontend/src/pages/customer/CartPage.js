import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../AppContext.js';
import styles from './CartPage.module.css';
import Notification from '../../components/user-components/Notification.js';
import defaultItem from '../../assets/default_item.jpg';
import Loader from '../../components/user-components/loader.js'
const CartPage = () => {
    const { getCSRFToken, getCookie, baseUrl } = useAppContext();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [editingItems, setEditingItems] = useState([]);
    const [originalTotal, setOriginalTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);
    const [address, setAddress] = useState('');
    const [receiverName, setReceiverName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [processingPayment, setProcessingPayment] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');


    useEffect(() => {
        fetchCartItems();
        fetchCustomerInfo();
    }, []);

    const updateCartSummaryInLocalStorage = (items) => {
        const activeItemsCount = items.filter(item => item.SOLUONG > 0).length;
        localStorage.setItem('cartCateItemCount', activeItemsCount);
    };

    useEffect(() => {
        const currentItems = editingItems.length > 0 ? editingItems : cartItems;
        let totalOriginal = 0;
        let totalDiscount = 0;

        currentItems.forEach(item => {
            const originalPrice = item.GIANIEMYET * item.SOLUONG;
            const discountedPrice = originalPrice * (item.BEST_DISCOUNT || 0) / 100;

            totalOriginal += originalPrice;
            totalDiscount += discountedPrice;
        });

        setOriginalTotal(totalOriginal);
        setDiscount(totalDiscount);
        setFinalTotal(totalOriginal - totalDiscount);
    }, [cartItems, editingItems]);

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
            updateCartSummaryInLocalStorage(res);
        } catch (error) {
            console.error('Error fetching cart items:', error);
            setNotification({ message: 'Đã xảy ra lỗi khi tải giỏ hàng!', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomerInfo = async () => {
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
            // Cập nhật thông tin giao hàng với dữ liệu từ API
            setReceiverName(data.TENKH || '');
            setContactPhone(data.SDT || '');
            setAddress(data.DIACHI || '');
        } catch (error) {
            console.error('Error fetching customer info:', error);
            setNotification({ message: 'Không thể tải thông tin cá nhân!', type: 'error' });
        }
    };

    const handleQuantityChange = (id, delta) => {
        setEditingItems((prevEditingItems) => {
            return prevEditingItems.map((item) => {
                if (item.ID_TRANGSUC === id) {
                    const updatedQuantity = item.SOLUONG + delta;
                    return { ...item, SOLUONG: Math.max(updatedQuantity, 0) };
                }
                return item;
            });
        });
    };

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await getCSRFToken();
            const xsrfToken = getCookie('XSRF-TOKEN');

            //const updatedItems = editingItems.filter(item => item.SOLUONG > 0);
            console.log('Items sent to backend:', editingItems);

            const response = await fetch(`${baseUrl}/api/customer/cart/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
                },
                credentials: 'include',
                body: JSON.stringify({ items: editingItems }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const res = await response.json();
            setCartItems(res);
            setEditingItems([]);
            updateCartSummaryInLocalStorage(res);
            setNotification({ message: 'Cập nhật giỏ hàng thành công!', type: 'success' });
        } catch (error) {
            console.error('Error updating cart:', error);
            setNotification({ message: 'Đã xảy ra lỗi khi cập nhật giỏ hàng!', type: 'error' });
        } finally {
            setLoading(false);
        }
    }

    const handleEdit = () => {
        setEditingItems(cartItems.map((item) => ({ ...item })));
    };

    const handleCancel = () => {
        setEditingItems([]);
    };

    const handleCheckout = async () => {
        if (paymentMethod === 'credit_card' && (!cardNumber || !expiryDate || !cvv || !cardHolderName)) {
            setNotification({ message: 'Vui lòng nhập đầy đủ thông tin thẻ.', type: 'error' });
            return;
        }

        setProcessingPayment(true);
        try {
            await getCSRFToken();
            const xsrfToken = getCookie('XSRF-TOKEN');

            const response = await fetch(`${baseUrl}/api/customer/cart/checkout`, {
                method: 'POST',
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
            setNotification({ message: res.message || 'Thanh toán thành công', type: 'success' });
            setCartItems([]);
        } catch (error) {
            console.error('Error during checkout:', error);
            setNotification({ message: 'Đã xảy ra lỗi khi thanh toán!', type: 'error' });
        } finally {
            setProcessingPayment(false);
        }
    }

    return (
        <div className={styles.cartPage}>
            <div className={styles.cartContainer}>
                <div className={styles.cartItemsContainer}>
                    {loading && <Loader />}
                    {!loading && cartItems.length === 0 && (
                        <p>Giỏ hàng của bạn đang trống.</p>
                    )}
                    {!loading && cartItems.length > 0 && (
                        <>
                            <div className={styles.cartItems}>
                                {(editingItems.length > 0 ? editingItems : cartItems)
                                    .filter((item) => item.SOLUONG > 0)
                                    .map((item) => {
                                        const discountedPrice = item.GIANIEMYET * (1 - (item.BEST_DISCOUNT || 0) / 100); // Giá đã giảm
                                        return (
                                            <div key={item.ID_TRANGSUC} className={styles.cartItem}>
                                                <div className={styles.itemImage}>
                                                    <img
                                                        src={item.IMAGEURL ? `${baseUrl}${item.IMAGEURL}` : defaultItem}
                                                        alt={item.TENTS}
                                                    />
                                                </div>
                                                <div className={styles.itemInfo}>
                                                    <h2>{item.TENTS}</h2>
                                                    <p className={styles.originalPrice}>
                                                        {item.GIANIEMYET.toLocaleString()} VNĐ
                                                    </p>
                                                    <p className={styles.discountedPrice}>
                                                        {discountedPrice.toLocaleString()} VNĐ
                                                    </p>
                                                    <div className={styles.quantity}>
                                                        <span>Số lượng: {item.SOLUONG}</span>
                                                        {editingItems.length > 0 && (
                                                            <div className={styles.editButtons}>
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
                                        );
                                    })}
                            </div>
                            {editingItems.length === 0 ? (
                                <button className={styles.editButton} onClick={handleEdit}>Chỉnh sửa</button>
                            ) : (
                                <div className={styles.actionButtons}>
                                    <button className={styles.confirmButton} onClick={handleConfirm}>Xác nhận</button>
                                    <button className={styles.cancelButton} onClick={handleCancel}>Hủy</button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {!loading && cartItems.length > 0 && (
                    <div className={styles.cartSummary}>
                        <h2>Thông tin thanh toán</h2>
                        <div className={styles.summaryRow}>
                            <span>Giá trị:</span>
                            <span>{originalTotal.toLocaleString()} VNĐ</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Giảm giá:</span>
                            <span>-{discount.toLocaleString()} VNĐ</span>
                        </div>
                        <div className={styles.summaryRowTotal}>
                            <span>Tổng cộng:</span>
                            <span>{finalTotal.toLocaleString()} VNĐ</span>
                        </div>

                        <h3>Thông tin giao hàng</h3>
                        <input
                            type="text"
                            placeholder="Người nhận"
                            value={receiverName}
                            onChange={(e) => setReceiverName(e.target.value)}
                            className={styles.inputField}
                        />
                        <input
                            type="text"
                            placeholder="Số điện thoại liên hệ"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            className={styles.inputField}
                        />
                        <input
                            type="text"
                            placeholder="Địa chỉ nhận hàng"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className={styles.inputField}
                        />

                        <h3>Phương thức thanh toán</h3>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className={styles.paymentSelect}
                        >
                            <option value="credit_card">Thẻ tín dụng</option>
                            <option value="bank_transfer">Chuyển khoản</option>
                        </select>

                        {paymentMethod === 'credit_card' && (
                            <div className={styles.cardInfoForm}>
                                <input
                                    type="text"
                                    placeholder="Số thẻ"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    className={styles.inputField}
                                />
                                <div className={styles.expiryCvvRow}>
                                    <input
                                        type="text"
                                        placeholder="Ngày hết hạn (MM/YY)"
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(e.target.value)}
                                        className={styles.inputFieldHalf}
                                    />
                                    <input
                                        type="text"
                                        placeholder="CVV"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value)}
                                        className={styles.inputFieldHalf}
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Tên chủ thẻ"
                                    value={cardHolderName}
                                    onChange={(e) => setCardHolderName(e.target.value)}
                                    className={styles.inputField}
                                />
                            </div>
                        )}

                        <button className={styles.checkoutButton} onClick={handleCheckout} disabled={processingPayment}>
                            {processingPayment ? 'Đang thanh toán...' : 'Thanh toán'}
                        </button>
                    </div>
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
            {processingPayment && <Loader />}
        </div>
    );
};

export default CartPage;
