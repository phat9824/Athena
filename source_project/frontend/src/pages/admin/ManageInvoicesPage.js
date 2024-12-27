import React, { useEffect, useState } from "react";
import { useAppContext } from "../../AppContext.js";
import styles from "./ManageInvoicesPage.module.css";

const ITEMS_PER_PAGE = 10;

const ManageInvoicesPage = () => {
    const { getCSRFToken, getCookie, baseUrl } = useAppContext();

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOrder, setSortOrder] = useState("desc");
    const [filterStatus, setFilterStatus] = useState("all");
    const [expandedInvoice, setExpandedInvoice] = useState(null); // Tracks expanded invoice for dropdown

    const fetchInvoices = async () => {
        try {
            await getCSRFToken();
            const xsrfToken = getCookie("XSRF-TOKEN");

            const response = await fetch(
                `${baseUrl}/api/admin/invoices?page=${currentPage}&perPage=${ITEMS_PER_PAGE}&sort=${sortOrder}&status=${filterStatus}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
                    },
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error(`Lỗi khi lấy danh sách hóa đơn: ${response.status}`);
            }

            const res = await response.json();
            setInvoices(res);
            setTotalPages(res.totalPages);
        } catch (error) {
            console.error("Fetch Invoices Error:", error.message);
        }
    };

    useEffect(() => {
        fetchInvoices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, sortOrder, filterStatus]);

    const handleExpand = (invoiceId) => {
        setExpandedInvoice(expandedInvoice === invoiceId ? null : invoiceId);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Quản Lý Hóa Đơn</h1>

            <div className={styles.filters}>
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className={styles.filterSelect}
                >
                    <option value="desc">Giảm dần</option>
                    <option value="asc">Tăng dần</option>
                </select>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className={styles.filterSelect}
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="0">Chờ xử lý</option>
                    <option value="1">Đã xử lý</option>
                    <option value="2">Đã hủy</option>
                </select>
            </div>

            <div className={styles.invoiceList}>
                {invoices.map((invoice) => (
                    <div key={invoice.ID_HOADON} className={styles.invoiceCard}>
                        <div className={styles.invoiceHeader}>
                            <div>
                                <strong>Mã Hóa Đơn:</strong> {invoice.ID_HOADON}
                            </div>
                            <div>
                                <strong>Tổng Giá Trị:</strong> {invoice.TRIGIAHD.toLocaleString()} VND
                            </div>
                            <button
                                className={styles.expandButton}
                                onClick={() => handleExpand(invoice.ID_HOADON)}
                            >
                                {expandedInvoice === invoice.ID_HOADON ? "Thu gọn" : "Xem chi tiết"}
                            </button>
                        </div>
                        <div className={styles.invoiceDetails}>
                            <div>
                                <strong>Ngày Mua:</strong> {invoice.NGAYLAPHD}
                            </div>
                            <div>
                                <strong>Trạng Thái:</strong>{" "}
                                {invoice.TRANGTHAI === 0
                                    ? "Chờ xử lý"
                                    : invoice.TRANGTHAI === 1
                                    ? "Đã xử lý"
                                    : "Đã hủy"}
                            </div>
                        </div>
                        {expandedInvoice === invoice.ID_HOADON && (
                            <div className={styles.invoiceProducts}>
                                <h3>Chi Tiết Sản Phẩm</h3>
                                {invoice.chi_tiet.map((product) => (
                                    <div key={product.ID_TRANGSUC} className={styles.productCard}>
                                        <img
                                            src={`${baseUrl}${product.IMAGEURL}`}
                                            alt={product.TENTS}
                                            className={styles.productImage}
                                        />
                                        <div>
                                            <div><strong>Tên:</strong> {product.TENTS}</div>
                                            <div><strong>Số Lượng:</strong> {product.SOLUONG}</div>
                                            <div>
                                                <strong>Giá:</strong>{" "}
                                                {product.GIASP.toLocaleString()} VND
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className={styles.pagination}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        className={currentPage === page ? styles.activePage : ""}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Sau
                </button>
            </div>
        </div>
    );
};

export default ManageInvoicesPage;
