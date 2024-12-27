// src/pages/admin/ManageProductsPage.js
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../AppContext.js";
import styles from "./ManageProductsPage.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave } from "@fortawesome/free-solid-svg-icons";

import ProductTable from "../../components/admin/ProductPages/ProductTable";
import Pagination from "../../components/admin/ProductPages/Pagination";
import AddCategoryForm from "../../components/admin/ProductPages/AddCategoryForm";
import AddProductForm from "../../components/admin/ProductPages/AddProductForm";

const ManageProductsPage = () => {
    const { getCSRFToken, getCookie, baseUrl } = useAppContext();

    const [isFetching, setIsFetching] = useState(false);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");


    // Danh sách sản phẩm
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [inputPage, setInputPage] = useState(1);

    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        stock: "",
        description: "",
        category: "",
        imageFile: null,
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts(currentPage);
        // eslint-disable-next-line
    }, [currentPage, filters, searchQuery]);

    const mapCategoryName = (madm) => {
        const category = categories.find((cat) => cat.MADM === madm);
        return category ? category.TENDM : "Không xác định";
    };


    const fetchCategories = async () => {
        try {
            await getCSRFToken();
            const xsrfToken = getCookie("XSRF-TOKEN");
            const response = await fetch(`${baseUrl}/api/admin/danhmucts`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
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

    const fetchProducts = async (page) => {
        if (isFetching) return;
        setIsFetching(true);
        try {
            await getCSRFToken();
            const xsrfToken = getCookie("XSRF-TOKEN");
            const response = await fetch(
                `${baseUrl}/api/admin/trangsuc?page=${page}&perPage=10`,
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

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Hàm xử lý khi nhập vào ô input (tên SP, giá, SL, v.v.)
    const handleProductFieldChange = (productId, field, value) => {
        setProducts((prevProducts) =>
            prevProducts.map((p) =>
                p.ID === productId ? { ...p, [field]: value } : p
            )
        );
    };

    // Thêm danh mục
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
                    Accept: "application/json",
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
            fetchCategories();
        } catch (error) {
            setErrorMessage(error.message || "Đã có lỗi xảy ra, vui lòng thử lại!");
            setSuccessMessage("");
        }
    };

    // Thêm sản phẩm
    const addProduct = async () => {
        if (
            !newProduct.name ||
            !newProduct.price ||
            !newProduct.stock ||
            !newProduct.category
        ) {
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
            formData.append("image", newProduct.imageFile);

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
            fetchProducts(1);
        } catch (error) {
            setErrorMessage(error.message || "Đã xảy ra lỗi khi thêm sản phẩm!");
        }
    };

    // Cập nhật sản phẩm
    const updateProduct = async (productId) => {
        const product = products.find((p) => p.ID === productId);

        // Lấy các trường đang sửa (nếu có), nếu không thì lấy giá trị gốc
        const updatedPrice =
            product.editingPrice !== undefined
                ? product.editingPrice
                : product.GIANIEMYET;
        const updatedStock =
            product.editingStock !== undefined
                ? product.editingStock
                : product.SLTK;
        const updatedName =
            product.editingName !== undefined
                ? product.editingName
                : product.TENTS;
        const updatedCategory =
            product.editingMADM !== undefined
                ? product.editingMADM
                : product.MADM;

        // Check ẩn sản phẩm
        const deleted =
            product.deleted !== undefined
                ? product.deleted
                : product.DELETED_AT !== null;

        try {
            await getCSRFToken();
            const xsrfToken = getCookie("XSRF-TOKEN");

            const response = await fetch(
                `${baseUrl}/api/admin/trangsuc/update/${productId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        TENTS: updatedName,
                        MADM: updatedCategory,
                        GIANIEMYET: parseInt(updatedPrice),
                        SLTK: parseInt(updatedStock),
                        deleted,
                    }),
                }
            );

            const res = await response.json();
            if (!response.ok) {
                throw new Error(
                    res.error || res.message || "Không thể cập nhật sản phẩm"
                );
            }

            setSuccessMessage("Cập nhật sản phẩm thành công!");
            fetchProducts(currentPage);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const filteredProducts = products.filter((product) => {
        const productName = product.TENTS?.toLowerCase() || "";
        const isNameMatch = productName.includes(searchQuery.toLowerCase());

        const isCategoryMatch =
            !filters.category || product.MADM === filters.category;

        return isNameMatch && isCategoryMatch;
    });



    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Danh sách sản phẩm</h2>

            <div className={styles.container}>
                <h2 className={styles.heading}>Danh sách sản phẩm</h2>

                {/* Ô tìm kiếm và chọn danh mục */}
                <div className={styles.inputGroup}>
                    {/* Tìm kiếm theo tên sản phẩm */}
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên sản phẩm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />

                    {/* Chọn danh mục */}
                    <select
                        value={filters.category || ""}
                        onChange={(e) =>
                            setFilters({ ...filters, category: e.target.value })
                        }
                        className={styles.select}
                    >
                        <option value="">Tất cả danh mục</option>
                        {categories.map((cat) => (
                            <option key={cat.ID} value={cat.MADM}>
                                {cat.TENDM}
                            </option>
                        ))}
                    </select>

                </div>
            </div>


            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

            <ProductTable
                products={filteredProducts}
                categories={categories}
                baseUrl={baseUrl}
                mapCategoryName={mapCategoryName}
                handleProductFieldChange={handleProductFieldChange} // Đúng tên
                updateProduct={updateProduct}
            />


            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onInputPageChange={setInputPage}
                inputPage={inputPage}
            />

            <AddCategoryForm
                newCategory={newCategory}
                setNewCategory={setNewCategory}
                addCategory={addCategory}
            />

            <AddProductForm
                categories={categories}
                newProduct={newProduct}
                setNewProduct={setNewProduct}
                addProduct={addProduct}
            />
        </div>
    );
};

export default ManageProductsPage;
