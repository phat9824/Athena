// src/components/admin/ProductsPage/Pagination.js

import React from "react";
import styles from "./ManageProductsPage.module.css";

const Pagination = ({ currentPage, totalPages, onPageChange, onInputPageChange, inputPage }) => {
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
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`${styles.paginationButton} ${currentPage === 1 ? styles.paginationButtonDisabled : ""}`}
            >
                ←
            </button>
            {pageNumbers.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    disabled={page === currentPage}
                    className={`${styles.paginationButton} ${page === currentPage ? styles.paginationButtonDisabled : ""}`}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`${styles.paginationButton} ${currentPage === totalPages ? styles.paginationButtonDisabled : ""}`}
            >
                →
            </button>
            <div className={styles.paginationInputGroup}>
                <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={inputPage}
                    onChange={(e) => onInputPageChange(e.target.value)}
                    className={styles.paginationInput}
                    placeholder="Nhập số trang"
                />
                <button
                    onClick={() => {
                        const pageNum = Number(inputPage);
                        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                            onPageChange(pageNum);
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

export default Pagination;
