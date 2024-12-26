import React, { useEffect, useState } from 'react';
import { useAppContext } from "../../AppContext.js";
import styles from "./ManageCustomersPage.module.css";

const ManageCustomersPage = () => {
    const { getCSRFToken, getCookie, baseUrl } = useAppContext();
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");  // Tạo state cho tìm kiếm

    const fetchCustomers = async () => {
        if (isFetching) return;
        setIsFetching(true);

        try {
            await getCSRFToken();
            const xsrfToken = getCookie("XSRF-TOKEN");

            const response = await fetch(`${baseUrl}/api/admin/view-customer`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`Lỗi khi lấy danh sách khách hàng: ${response.status}`);
            }

            const res = await response.json();
            setCustomers(res);
            setFilteredCustomers(res);  // Ban đầu hiển thị tất cả khách hàng
        } catch (error) {
            setErrorMessage(error.message || "Đã xảy ra lỗi khi lấy danh sách khách hàng.");
        } finally {
            setIsFetching(false);
        }
    };

    // Hàm tìm kiếm
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setFilteredCustomers(customers);  // Nếu không có từ khóa tìm kiếm, hiển thị tất cả khách hàng
        } else {
            const filtered = customers.filter(customer =>
                customer.TENKH.toLowerCase().includes(query.toLowerCase()) ||
                customer.EMAIL.toLowerCase().includes(query.toLowerCase()) ||
                customer.SDT.includes(query) ||
                customer.DIACHI.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredCustomers(filtered);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Quản lý khách hàng</h1>

            {/* Thanh tìm kiếm */}
            <div className={styles.searchBox}>
                <input
                    type="text"
                    placeholder="Tìm kiếm khách hàng"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)} // Gọi hàm handleSearch khi người dùng nhập
                    className={styles.searchInput}
                />
                <i className={`fa fa-search ${styles.searchIcon}`} aria-hidden="true"></i>
                {/* Icon tìm kiếm */}
            </div>

            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

            {/* Bảng danh sách khách hàng */}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Tên khách hàng</th>
                        <th>Số điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Loại</th>
                        <th>Giới tính</th>
                        <th>Tình trạng</th>
                        <th>Ảnh</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.length === 0 ? (
                        <tr><td colSpan="9">Không có khách hàng phù hợp.</td></tr>
                    ) : (
                        filteredCustomers.map(customer => (
                            <tr key={customer.ID}>
                                <td>{customer.ID}</td>
                                <td>{customer.EMAIL}</td>
                                <td>{customer.TENKH || "N/A"}</td>
                                <td>{customer.SDT || "N/A"}</td>
                                <td>{customer.DIACHI || "N/A"}</td>
                                <td>{customer.LOAI || "N/A"}</td>
                                <td>{customer.GIOITINH === 1 ? "Nam" : customer.GIOITINH === 2 ? "Nữ" : "Khác"}</td>
                                <td>{customer.TINHTRANG === 1 ? "Hoạt động" : "Đã khóa"}</td>
                                <td>
                                    {customer.IMAGEURL ? (
                                        <img src={`${baseUrl}${customer.IMAGEURL}`} alt="Customer" className={styles.thumbnail} />
                                    ) : (
                                        "Chưa có ảnh"
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ManageCustomersPage;
