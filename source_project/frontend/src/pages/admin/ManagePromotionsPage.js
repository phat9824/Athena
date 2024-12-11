import React, { useEffect, useState } from "react";
import { useAppContext } from "../../AppContext.js";
import styles from "./ManagePromotionsPage.module.css";

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

    // Fetch promotions
    const fetchPromotions = async (page) => {
        if (isFetching) return;
        setIsFetching(true);

        try {
            await getCSRFToken();
            const xsrfToken = getCookie("XSRF-TOKEN");

            const response = await fetch(`${baseUrl}/api/admin/khuyenmai?page=${page}&perPage=10&search=${searchQuery}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
                },
                credentials: "include",
            });

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

    // Add new promotion
    // const addPromotion = async () => {
    //     if (!newPromotion.name || !newPromotion.startDate || !newPromotion.endDate || !newPromotion.discount) {
    //         setErrorMessage("Vui lòng điền đầy đủ thông tin khuyến mãi!");
    //         return;
    //     }

    //     try {
    //         await getCSRFToken();
    //         const xsrfToken = getCookie("XSRF-TOKEN");

    //         const response = await fetch(`${baseUrl}/api/khuyenmai/create`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Accept": "application/json",
    //                 "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
    //             },
    //             credentials: "include",
    //             body: JSON.stringify({
    //                 TENKM: newPromotion.name,
    //                 NGAYBD: newPromotion.startDate,
    //                 NGAYKT: newPromotion.endDate,
    //                 PHANTRAM: newPromotion.discount,
    //             }),
    //         });

    //         if (!response.ok) {
    //             const res = await response.json();
    //             throw new Error(res.message || "Không thể thêm khuyến mãi.");
    //         }

    //         setSuccessMessage("Thêm khuyến mãi thành công!");
    //         setErrorMessage("");
    //         setNewPromotion({ name: "", startDate: "", endDate: "", discount: "" });
    //         fetchPromotions(1); // Refresh promotions list
    //     } catch (error) {
    //         setErrorMessage(error.message || "Đã xảy ra lỗi khi thêm khuyến mãi!");
    //     }
    // };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

        return (
            <div className={styles.pagination}>
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        disabled={page === currentPage}
                        className={`${styles.paginationButton} ${page === currentPage ? styles.paginationButtonActive : ""
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Quản lý chương trình khuyến mãi</h1>

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
                            <td>{promo.NGAYBD}</td>
                            <td>{promo.NGAYKT}</td>
                            <td>{promo.PHANTRAM}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {renderPagination()}

            {/* <h2>Thêm chương trình khuyến mãi mới</h2>
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
            </form> */}
        </div>
    );
};

export default ManagePromotionsPage;
