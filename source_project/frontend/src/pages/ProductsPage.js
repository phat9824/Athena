import React, { useEffect, useState } from "react";
import { useAppContext } from "../AppContext.js";
import { useNavigate } from "react-router-dom";
import styles from "./ProductsPage.module.css";

const ProductsPage = () => {
    const { baseUrl } = useAppContext();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [inputPage, setInputPage] = useState(1);

    const [filters, setFilters] = useState({
        category: "",
        priceMin: "",
        priceMax: "",
        sort: "asc",
    });

    const perPage = 16;

    const navigate = useNavigate();
    const handleViewDetails = (productId) => {
        navigate(`../Products/${productId}`);
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/danhmucts`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            });

            const res = await response.json();
            if (response.ok) {
                setCategories(res);
            }
        } catch (error) {
            console.error("Không thể tải danh mục sản phẩm:", error);
        }
    };

    const fetchProducts = async (page) => {
        setIsLoading(true);

        const queryParams = new URLSearchParams({
            page,
            perPage,
            ...filters,
        });

        try {
            const response = await fetch(`${baseUrl}/api/trangsuc?${queryParams.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                credentials: "include",
            });

            const res = await response.json();

            if (response.ok) {
                const { data, totalPages: total, currentPage: current } = res;
                setProducts(data);
                setTotalPages(total);
                setCurrentPage(current);
                setInputPage(current);
            } else {
                setNotification({ message: res.message || "Không thể tải danh sách sản phẩm!", type: "error" });
            }
        } catch (error) {
            setNotification({ message: "Đã xảy ra lỗi, vui lòng thử lại!", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage, filters]);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi bộ lọc
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        let startPage = currentPage - 2;
        let endPage = currentPage + 2;

        if (startPage < 1) {
            endPage = Math.min(totalPages, endPage + (1 - startPage));
            startPage = 1;
        }
        if (endPage > totalPages) {
            startPage = Math.max(1, startPage - (endPage - totalPages));
            endPage = totalPages;
        }

        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className={styles.pagination}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`${styles.paginationButton} ${currentPage === 1 ? styles.paginationButtonDisabled : ""
                        }`}
                >
                    ←
                </button>
                {pageNumbers.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        disabled={page === currentPage}
                        className={`${styles.paginationButton} ${page === currentPage ? styles.paginationButtonDisabled : ""
                            }`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`${styles.paginationButton} ${currentPage === totalPages ? styles.paginationButtonDisabled : ""
                        }`}
                >
                    →
                </button>
                <div className={styles.paginationInputGroup}>
                    <input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={inputPage}
                        onChange={(e) => setInputPage(e.target.value)}
                        className={styles.paginationInput}
                        placeholder="Nhập số trang"
                    />
                    <button
                        onClick={() => {
                            const pageNum = Number(inputPage);
                            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                                handlePageChange(pageNum);
                            } else {
                                alert("Vui lòng nhập số trang hợp lệ!");
                            }
                        }}
                        className={styles.paginationGoButton}
                    >
                        Đi đến
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <h1>Sản phẩm</h1>
            {notification && (
                <div
                    className={styles.notification}
                    style={{ color: notification.type === "error" ? "red" : "green" }}
                >
                    {notification.message}
                </div>
            )}
            <div className={styles.filters}>
                <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                    className={styles.filterSelect}
                >
                    <option value="">Tất cả danh mục</option>
                    {categories.map((category) => (
                        <option key={category.MADM} value={category.MADM}>
                            {category.TENDM}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Giá thấp nhất"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange("priceMin", e.target.value)}
                    className={styles.filterInput}
                />
                <input
                    type="number"
                    placeholder="Giá cao nhất"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange("priceMax", e.target.value)}
                    className={styles.filterInput}
                />
                <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                    className={styles.filterSelect}
                >
                    <option value="asc">Giá tăng dần</option>
                    <option value="desc">Giá giảm dần</option>
                </select>
            </div>
            {isLoading ? (
                <p>Đang tải...</p>
            ) : (
                <div className={styles.productsGrid}>
                    {products.map((product) => (
                        <div key={product.ID} className={styles.productCard}>
                            <img
                                src={`${baseUrl}${product.IMAGEURL}`}
                                alt={product.TENTS}
                                className={styles.productImage}
                            />
                            <h3 className={styles.productName}>
                                {product.TENTS}
                            </h3>
                            <div className={styles.priceDetails}>
                                <div className={styles.priceLeft}>
                                    <p className={styles.productPrice}>
                                        {product.GIANIEMYET.toLocaleString()} VND
                                    </p>
                                    <p className={styles.discountPrice}>
                                        {(product.GIANIEMYET * 0.9).toLocaleString()} VND
                                    </p>
                                </div>
                                <div className={styles.priceRight}>
                                    <div className={styles.discountPercent}>
                                        <i className="fas fa-tag"></i> -10%
                                    </div>
                                    <button
                                        onClick={() => handleViewDetails(product.ID)}
                                        className={styles.detailButton}
                                    >
                                        Mua ngay 
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {renderPagination()}
        </div>
    );
};

export default ProductsPage;
