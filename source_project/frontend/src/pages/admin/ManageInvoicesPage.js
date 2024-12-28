import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../AppContext.js';
import styles from './ManageInvoicesPage.module.css';
import Notification from '../../components/user-components/Notification.js';
import Pagination from "../../components/admin/ProductPages/Pagination";

const ManageInvoicesPage = () => {
    const { getCSRFToken, getCookie, baseUrl } = useAppContext();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [expandedOrderId, setExpandedOrderId] = useState(null); // ID của hóa đơn đang mở chi tiết
    const [orderDetails, setOrderDetails] = useState({});
    const [filters, setFilters] = useState({
        status: 'all',
        search: '',
        customerId: '',
        page: 1,
    });
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [inputPage, setInputPage] = useState(1);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            await getCSRFToken();
            const xsrfToken = getCookie('XSRF-TOKEN');
            const queryParams = new URLSearchParams({
                status: filters.status,
                search: filters.search,
                customerId: filters.customerId,
                page: filters.page,
            }).toString();
            const response = await fetch(`${baseUrl}/api/admin/orders?${queryParams}`, {
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
            setOrders(data.orders);
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage || filters.page);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setNotification({ message: 'Đã xảy ra lỗi khi tải danh sách hóa đơn!', type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [baseUrl, getCSRFToken, getCookie, filters]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const fetchOrderDetails = async (orderId) => {
        if (orderDetails[orderId]) {
            setExpandedOrderId(orderId === expandedOrderId ? null : orderId);
            return; // Nếu đã tải chi tiết, chỉ toggle phần hiển thị
        }

        try {
            await getCSRFToken();
            const xsrfToken = getCookie('XSRF-TOKEN');
            const response = await fetch(`${baseUrl}/api/admin/orders/${orderId}`, {
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
            setOrderDetails((prev) => ({ ...prev, [orderId]: data.items }));
            setExpandedOrderId(orderId); // Mở chi tiết hóa đơn
        } catch (error) {
            console.error('Error fetching order details:', error);
            setNotification({ message: 'Đã xảy ra lỗi khi tải chi tiết hóa đơn!', type: 'error' });
        }
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
        setCurrentPage(newPage);
    };

    const handleInputPageChange = (page) => {
        const parsedPage = parseInt(page, 10);
        if (!isNaN(parsedPage) && parsedPage > 0 && parsedPage <= totalPages) {
            setInputPage(parsedPage);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await getCSRFToken();
            const xsrfToken = getCookie('XSRF-TOKEN');
            const response = await fetch(`${baseUrl}/api/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
                },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setNotification({ message: 'Cập nhật trạng thái thành công!', type: 'success' });
            fetchOrders(); // Reload danh sách hóa đơn
        } catch (error) {
            console.error('Error updating order status:', error);
            setNotification({ message: 'Đã xảy ra lỗi khi cập nhật trạng thái!', type: 'error' });
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return (
        <div className={styles.ordersPage}>
            <h1 className={styles.ordersHeading}>Quản Lý Hóa Đơn</h1>
            <div className={styles.filtersContainer}>
                <input
                    type="text"
                    name="search"
                    value={filters.search}
                    placeholder="Tìm theo mã hóa đơn"
                    onChange={handleFilterChange}
                />
                <input
                    type="text"
                    name="customerId"
                    value={filters.customerId}
                    placeholder="Tìm theo mã khách hàng"
                    onChange={handleFilterChange}
                />
                <select name="status" value={filters.status} onChange={handleFilterChange}>
                    <option value="all">Tất cả trạng thái</option>
                    <option value="0">Chờ xử lý</option>
                    <option value="1">Đã xử lý</option>
                    <option value="2">Đã hủy</option>
                    <option value="3">Đã giao hàng</option>
                </select>
            </div>

            {!loading && orders.length === 0 && <p>Không có hóa đơn nào.</p>}
            {!loading && orders.length > 0 && (
                <table className={styles.ordersTable}>
                    <thead>
                        <tr>
                        <th className={styles.columnId}>Mã Hóa Đơn</th>
                        <th className={styles.columnCustomerId}>Mã Khách Hàng</th>
                        <th className={styles.columnDate}>Ngày Lập</th>
                        <th className={styles.columnStatus}>Trạng Thái</th>
                        <th className={styles.columnTotal}>Tổng Giá Trị</th>
                        <th className={styles.columnActions}>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.ID_HOADON}>
                                <td>{order.ID_HOADON}</td>
                                <td>{order.ID_KHACHHANG}</td>
                                <td>{order.NGAYLAPHD}</td>
                                <td>
                                    {order.TRANGTHAI === 0
                                        ? 'Chờ xử lý'
                                        : order.TRANGTHAI === 1
                                            ? 'Đã xử lý'
                                            : order.TRANGTHAI === 3
                                                ? 'Đã giao hàng'
                                                    : 'Đã hủy'}
                                </td>
                                <td>{order.TRIGIAHD.toLocaleString()} VNĐ</td>
                                <td>
                                    <button onClick={() => fetchOrderDetails(order.ID_HOADON)}>
                                        Chi Tiết
                                    </button>
                                    <button onClick={() => updateOrderStatus(order.ID_HOADON, 1)}>Xác Nhận</button>
                                    <button onClick={() => updateOrderStatus(order.ID_HOADON, 2)}>Hủy</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onInputPageChange={setInputPage}
                inputPage={inputPage}
            />
            {expandedOrderId && (
                <div className={styles.overlay}>
                    <div className={styles.orderDetailsModal}>
                        <h4>Chi Tiết Hóa Đơn</h4>
                        <button className={styles.closeButton} onClick={() => setExpandedOrderId(null)}>Đóng</button>
                        {orderDetails[expandedOrderId]?.length > 0 ? (
                            orderDetails[expandedOrderId].map((item) => (
                                <div className={styles.detailItem} key={item.ID_TRANGSUC}>
                                    <img
                                        className={styles.productImage}
                                        src={`${baseUrl}${item.IMAGEURL}`}
                                        alt={item.TENTS}
                                    />
                                    <div>
                                        <p><b>Sản phẩm:</b> {item.TENTS}</p>
                                        <p><b>Số lượng:</b> {item.SOLUONG}</p>
                                        <p><b>Giá:</b> {item.GIASP.toLocaleString()} VNĐ</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Không có chi tiết.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageInvoicesPage;
