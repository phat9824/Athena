import React, { useEffect, useState } from "react";
import { useAppContext } from "../../AppContext.js";
import styles from "./ManageProductsPage.module.css";

const ManageProductsPage = () => {
    const { getCSRFToken, getCookie, baseUrl } = useAppContext();
    const [isFetching, setIsFetching] = useState(false);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const mapCategoryName = (madm) => {
        const category = categories.find((cat) => cat.MADM == madm);
        return category ? category.TENDM : "Không xác định";
    };

    // Lấy danh mục sản phẩm
    const fetchCategories = async () => {
        try {
            await getCSRFToken();
            const xsrfToken = getCookie("XSRF-TOKEN");

            const response = await fetch(`${baseUrl}/api/danhmucts`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`Lỗi khi lấy danh mục: ${response.status}`);
            }

            const res = await response.json();
            setCategories(res);
        } catch (error) {
            setErrorMessage(error.message || "Lỗi không xác định khi lấy danh mục.");
        }
    };

    // Xem sản phẩm --------------------------------------------------------------------------------------------//

    const [products, setProducts] = useState([]); // Mảng sản phẩm
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [inputPage, setInputPage] = useState(1); // Giá trị nhập vào ô input số trang

    // Lấy danh sách sản phẩm
    const fetchProducts = async (page) => {
        if (isFetching) return;
        setIsFetching(true);

        // Tạo các tham số cho Query
        const queryParams = new URLSearchParams({
            page,
            perPage: 10,
            ...filters,
            search: searchQuery,
        });

        try {
            await getCSRFToken();
            const xsrfToken = getCookie("XSRF-TOKEN");

            const response = await fetch(`${baseUrl}/api/admin/trangsuc?page=${page}&perPage=10`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`Lỗi khi lấy sản phẩm: ${response.status}`);
            }

            const res = await response.json();
            setProducts(res.data);
            setCurrentPage(res.currentPage);
            setTotalPages(res.totalPages);
            setInputPage(res.currentPage);
        } catch (error) {
            setErrorMessage(error.message || "Lỗi không xác định khi lấy sản phẩm.");
        } finally {
            setIsFetching(false);
        }
    };

    // Thực thi khi currentPage, filters, searchQuery đổi
    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage, filters, searchQuery]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    // Hàm render pagination với tối đa 5 nút
    const renderPagination = () => {
        if (totalPages <= 1) return null; // Không render nếu chỉ có 1 trang

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


    // Thêm danh mục mới
    const addCategory = async () => {
        if (!newCategory) {
            setErrorMessage("Tên danh mục không được để trống!");
            return;
        }

        try {
            await getCSRFToken();
            const xsrfToken = getCookie("XSRF-TOKEN");

            const response = await fetch(`${baseUrl}/api/danhmucts/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
                },
                credentials: "include",
                body: JSON.stringify({ TENDM: newCategory }),
            });

            const res = await response.json();

            if (!response.ok) {
                throw new Error(res.message || "Không thể thêm danh mục.");
            }

            setSuccessMessage(res.message || "Thêm danh mục thành công!");
            setErrorMessage("");
            setNewCategory("");
            fetchCategories(); // Cập nhật lại danh sách danh mục
        } catch (error) {
            setErrorMessage(error.message || "Đã có lỗi xảy ra, vui lòng thử lại!");
            setSuccessMessage("");
        }
    };

    // Thêm sản phẩm mới
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        stock: "",
        description: "",
        category: categories.length > 0 ? categories[0].MADM : "", // Giá trị mặc định
        image: "",
    });
    

    const addProduct = async () => {
        if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.category) {
            setErrorMessage("Vui lòng điền đầy đủ thông tin sản phẩm!");
            return;
        }

        try {
            await getCSRFToken();
            const xsrfToken = getCookie("XSRF-TOKEN");

            const formData = new FormData();
            formData.append("MADM", newProduct.category);
            formData.append("TENTS", newProduct.name);
            formData.append("GIANIEMYET", newProduct.price);
            formData.append("SLTK", newProduct.stock);
            formData.append("MOTA", newProduct.description);
            formData.append("image", newProduct.imageFile); // Đính kèm tệp ảnh

            const response = await fetch(`${baseUrl}/api/admin/trangsuc/create`, {
                method: "POST",
                headers: {
                    "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
                },
                credentials: "include",
                body: formData,
            });

            if (!response.ok) {
                const res = await response.json();
                throw new Error(res.message || "Không thể thêm sản phẩm.");
            }

            const res = await response.json();
            setSuccessMessage(res.message || "Thêm sản phẩm thành công!");
            setErrorMessage("");
            setNewProduct({
                name: "",
                price: "",
                stock: "",
                description: "",
                category: "",
                imageFile: null,
            });
            fetchProducts(1); // Cập nhật danh sách sản phẩm
        } catch (error) {
            setErrorMessage(error.message || "Đã xảy ra lỗi khi thêm sản phẩm!");
        }
    };

    return (
        <div className={styles.container}>
            {/* -------------------------------------------------------------------------------------------- */}
            <h2 className={styles.heading}>Danh sách sản phẩm</h2>
            <div className={styles.inputGroup}>
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.input}
                />
                <select
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className={styles.select}
                >
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat) => (
                        <option key={cat.ID} value={cat.ID}>
                            {cat.TENDM}
                        </option>
                    ))}
                </select>
            </div>

            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.th}>Mã sản phẩm</th>
                        <th className={styles.th}>Hình ảnh</th>
                        <th className={styles.th}>Tên sản phẩm</th>
                        <th className={styles.th}>Danh mục</th>
                        <th className={styles.th}>Giá niêm yết</th>
                        <th className={styles.th}>Số lượng tồn kho</th>

                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.ID}>
                            <td className={styles.td}>{product.ID}</td>
                            <td className={styles.td}>
                                <div className={styles.thumbnailWrapper}>
                                    <img
                                        src={`${baseUrl}${product.IMAGEURL}`}
                                        alt={product.TENTS}
                                        className={styles.thumbnail}
                                    />
                                </div>
                            </td>
                            <td className={styles.td}>{product.TENTS}</td>
                            <td className={styles.td}>{mapCategoryName(product.MADM)}</td>
                            <td className={styles.td}>
                                {product.GIANIEMYET.toLocaleString()} VND
                            </td>
                            <td className={styles.td}>{product.SLTK}</td>

                        </tr>
                    ))}
                </tbody>
            </table>
            {renderPagination()}


            {/* -------------------------------------------------------------------------------------------- */}
            <h2>Thêm danh mục mới</h2>
            <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nhập tên danh mục"
            />
            <button onClick={addCategory}>Thêm</button>

            {/* -------------------------------------------------------------------------------------------- */}
            <h2>Thêm sản phẩm mới</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    addProduct();
                }}
                className={styles.addProductForm}
            >
                <input
                    type="text"
                    placeholder="Tên sản phẩm"
                    value={newProduct.name}
                    onChange={(e) =>
                        setNewProduct((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                />
                <input
                    type="number"
                    placeholder="Giá niêm yết"
                    value={newProduct.price}
                    onChange={(e) =>
                        setNewProduct((prev) => ({ ...prev, price: e.target.value }))
                    }
                    required
                />
                <input
                    type="number"
                    placeholder="Số lượng tồn kho"
                    value={newProduct.stock}
                    onChange={(e) =>
                        setNewProduct((prev) => ({ ...prev, stock: e.target.value }))
                    }
                    required
                />
                <textarea
                    placeholder="Mô tả sản phẩm"
                    value={newProduct.description}
                    onChange={(e) =>
                        setNewProduct((prev) => ({ ...prev, description: e.target.value }))
                    }
                />
                <select
                    value={newProduct.category}
                    onChange={(e) =>
                        setNewProduct((prev) => ({ ...prev, category: e.target.value }))
                    }
                    required
                >
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat) => (
                        <option key={cat.MADM} value={cat.MADM}>
                            {cat.TENDM}
                        </option>
                    ))}
                </select>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setNewProduct((prev) => ({
                            ...prev,
                            imageFile: e.target.files[0], // Lưu tệp ảnh vào state
                        }))
                    }
                />

                <button type="submit">Thêm sản phẩm</button>
            </form>



        </div>
    );
};

export default ManageProductsPage;

