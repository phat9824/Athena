import React, { useEffect, useState } from "react";
import { useAppContext } from "../../AppContext.js";
import styles from "./ManagePromotionsPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave } from "@fortawesome/free-solid-svg-icons";

const ManagePromotionsPage = () => {
    const { getCSRFToken, getCookie, baseUrl } = useAppContext();

    const [promotions, setPromotions] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [newPromotion, setNewPromotion] = useState({
        name: "",
        startDate: "",
        endDate: "",
        discount: "",
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Hàm cập nhật thông tin khuyến mãi
    const handlePromoChange = (id, field, value) => {
        setPromotions((prev) =>
            prev.map((p) => (p.ID === id ? { ...p, [field]: value } : p))
        );
    };

    // Fetch khuyến mãi từ API
    const fetchPromotions = async (page) => {
        if (isFetching) return;
        setIsFetching(true);

        try {
            await getCSRFToken();
            const xsrfToken = getCookie("XSRF-TOKEN");

            const response = await fetch(
                `${baseUrl}/api/admin/khuyenmai?page=${page}&perPage=10&search=${searchQuery}`,
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
                    },
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error(`Lỗi khi lấy khuyến mãi: ${response.status}`);
            }

            const res = await response.json();
            setPromotions(res.data);
            setCurrentPage(res.currentPage);
            setTotalPages(res.totalPages);
        } catch (error) {
            setErrorMessage(error.message || "Lỗi không xác định khi lấy khuyến mãi.");
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchPromotions(currentPage);
    }, [currentPage, searchQuery]);

    // Hàm thêm khuyến mãi mới
    const addPromotion = async () => {
        if (!newPromotion.name || !newPromotion.startDate || !newPromotion.endDate || !newPromotion.discount) {
            setErrorMessage("Vui lòng điền đầy đủ thông tin khuyến mãi!");
            return;
        }

        try {
            await getCSRFToken();
            const xsrfToken = getCookie("XSRF-TOKEN");

            const response = await fetch(`${baseUrl}/api/admin/khuyenmai/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
                },
                credentials: "include",
                body: JSON.stringify({
                    TENKM: newPromotion.name,
                    NGAYBD: newPromotion.startDate,
                    NGAYKT: newPromotion.endDate,
                    PHANTRAM: newPromotion.discount,
                }),
            });

            if (!response.ok) {
                const res = await response.json();
                throw new Error(res.message || "Không thể thêm khuyến mãi.");
            }

            setSuccessMessage("Thêm khuyến mãi thành công!");
            setErrorMessage("");  // Reset lỗi
            setNewPromotion({ name: "", startDate: "", endDate: "", discount: "" });  // Reset form
            fetchPromotions(1);  // Refresh danh sách khuyến mãi sau khi thêm mới
        } catch (error) {
            setErrorMessage(error.message || "Đã xảy ra lỗi khi thêm khuyến mãi!");
        }
    };

    // Hàm tìm kiếm
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Hiển thị phân trang
    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pageNumbers = [];
        const maxVisibleButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
        let endPage = Math.min(totalPages, currentPage + Math.floor(maxVisibleButtons / 2));

        if (endPage - startPage + 1 < maxVisibleButtons) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
            } else if (endPage === totalPages) {
                startPage = Math.max(1, endPage - maxVisibleButtons + 1);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className={styles.pagination}>
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`${styles.paginationButton} ${currentPage === 1 ? styles.paginationButtonDisabled : ""}`}
                >
                    ←
                </button>

                {pageNumbers.map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        disabled={page === currentPage}
                        className={`${styles.paginationButton} ${page === currentPage ? styles.paginationButtonActive : ""}`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`${styles.paginationButton} ${currentPage === totalPages ? styles.paginationButtonDisabled : ""}`}
                >
                    →
                </button>
            </div>
        );
    };

    // Hàm gọi API update
    const updatePromotion = async (promoId, updatedData) => {
        try {
            await getCSRFToken();
            const xsrfToken = getCookie("XSRF-TOKEN");

            const response = await fetch(`${baseUrl}/api/admin/khuyenmai/update/${promoId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
                },
                credentials: "include",
                body: JSON.stringify({
                    NGAYBD: updatedData.startDate,
                    NGAYKT: updatedData.endDate,
                    PHANTRAM: updatedData.discount,
                }),
            });

            const res = await response.json();
            if (!response.ok) {
                throw new Error(res.error || res.message || "Không thể cập nhật khuyến mãi");
            }

            setSuccessMessage("Cập nhật khuyến mãi thành công!");
            setErrorMessage("");
            fetchPromotions(currentPage); // Refresh danh sách khuyến mãi sau khi cập nhật
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Quản lý chương trình khuyến mãi</h1>

            {/* Thanh tìm kiếm */}
            <div className={styles.inputGroup}>
                <input
                    type="text"
                    placeholder="Tìm kiếm khuyến mãi"
                    value={searchQuery}
                    onChange={handleSearch}
                    className={styles.input}
                />
            </div>

            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

            {/* Bảng danh sách khuyến mãi */}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Tên khuyến mãi</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Phần trăm giảm giá</th>
                    </tr>
                </thead>
                <tbody>
                    {promotions.map((promo) => (
                        <tr key={promo.ID}>
                            <td>{promo.TENKM}</td>
                            <td>
                                {promo.isEditing ? (
                                    <input
                                        type="date"
                                        value={promo.editingStartDate || promo.NGAYBD}
                                        onChange={(e) => handlePromoChange(promo.ID, 'editingStartDate', e.target.value)}
                                    />
                                ) : (
                                    promo.NGAYBD
                                )}
                            </td>
                            <td>
                                {promo.isEditing ? (
                                    <input
                                        type="date"
                                        value={promo.editingEndDate || promo.NGAYKT}
                                        onChange={(e) => handlePromoChange(promo.ID, 'editingEndDate', e.target.value)}
                                    />
                                ) : (
                                    promo.NGAYKT
                                )}
                            </td>
                            <td>
                                {promo.isEditing ? (
                                    <input
                                        type="number"
                                        value={promo.editingDiscount !== undefined ? promo.editingDiscount : promo.PHANTRAM}
                                        onChange={(e) => handlePromoChange(promo.ID, 'editingDiscount', e.target.value)}
                                    />
                                ) : (
                                    `${promo.PHANTRAM}%`
                                )}
                            </td>
                            <td>
                                {promo.isEditing ? (
                                    <button
                                        onClick={() => {
                                            updatePromotion(promo.ID, {
                                                startDate: promo.editingStartDate || promo.NGAYBD,
                                                endDate: promo.editingEndDate || promo.NGAYKT,
                                                discount: promo.editingDiscount !== undefined ? promo.editingDiscount : promo.PHANTRAM,
                                            });
                                            handlePromoChange(promo.ID, "isEditing", false);
                                        }}
                                        className={styles.iconButton}
                                    >
                                        <FontAwesomeIcon icon={faSave} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handlePromoChange(promo.ID, "isEditing", true)}
                                        className={styles.iconButton}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {renderPagination()}

            {/* Form thêm khuyến mãi mới */}
            <h2>Thêm chương trình khuyến mãi mới</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    addPromotion();
                }}
                className={styles.form}
            >
                <input
                    type="text"
                    placeholder="Tên khuyến mãi"
                    value={newPromotion.name}
                    onChange={(e) => setNewPromotion((prev) => ({ ...prev, name: e.target.value }))}
                    required
                />
                <input
                    type="date"
                    value={newPromotion.startDate}
                    onChange={(e) => setNewPromotion((prev) => ({ ...prev, startDate: e.target.value }))}
                    required
                />
                <input
                    type="date"
                    value={newPromotion.endDate}
                    onChange={(e) => setNewPromotion((prev) => ({ ...prev, endDate: e.target.value }))}
                    required
                />
                <input
                    type="number"
                    placeholder="Phần trăm giảm giá"
                    value={newPromotion.discount}
                    onChange={(e) => setNewPromotion((prev) => ({ ...prev, discount: e.target.value }))}
                    required
                />
                <button type="submit">Thêm</button>
            </form>
        </div>
    );
};

export default ManagePromotionsPage;
