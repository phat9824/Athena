import React, { useEffect, useState } from "react";
import { useAppContext } from "../../AppContext.js";
import styles from "./ManagePromotionsPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../../components/admin/ProductPages/Pagination";
import Notification from "../../components/user-components/Notification.js";
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
        scopeType: "category",
        selectedScope: [],
    })
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [inputPage, setInputPage] = useState(1);
    const [categories, setCategories] = useState([]);
    const [sortField, setSortField] = useState("NGAYBD");
    const [sortOrder, setSortOrder] = useState("asc");

    const validatePromotion = (promotion) => {
        if (!promotion.name.trim()) return "Tên khuyến mãi không được để trống.";
        if (!promotion.startDate) return "Ngày bắt đầu không được để trống.";
        if (!promotion.endDate) return "Ngày kết thúc không được để trống.";
        if (new Date(promotion.startDate) > new Date(promotion.endDate)) {
            return "Ngày bắt đầu không thể lớn hơn ngày kết thúc.";
        }
        if (!promotion.discount || isNaN(promotion.discount) || promotion.discount <= 0 || promotion.discount > 100) {
            return "Phần trăm giảm giá phải là một số trong khoảng từ 1 đến 100.";
        }
        if (promotion.scopeType === "category" && promotion.selectedScope.length === 0) {
            return "Vui lòng chọn ít nhất một danh mục.";
        }
        if (promotion.scopeType === "product" && promotion.selectedScope.length === 0) {
            return "Vui lòng nhập ít nhất một sản phẩm.";
        }
        return null;
    };

    const validateUpdatedPromotion = (updatedData) => {
        if (!updatedData.startDate) return "Ngày bắt đầu không được để trống.";
        if (!updatedData.endDate) return "Ngày kết thúc không được để trống.";
        if (new Date(updatedData.startDate) > new Date(updatedData.endDate)) {
            return "Ngày bắt đầu không thể lớn hơn ngày kết thúc.";
        }
        if (!updatedData.discount || isNaN(updatedData.discount) || updatedData.discount <= 0 || updatedData.discount > 100) {
            return "Phần trăm giảm giá phải là một số trong khoảng từ 1 đến 100.";
        }
        return null;
    };


    const fetchCategories = async () => {
        try {
            const resp = await fetch(`${baseUrl}/api/danhmucts`);
            const data = await resp.json();
            setCategories(data); // [{MADM: '...', TENDM: '...'}, ...]
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

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
                `${baseUrl}/api/admin/khuyenmai?page=${page}&perPage=10&search=${searchQuery}&sortField=${sortField}&sortOrder=${sortOrder}`,
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
    }, [currentPage, searchQuery, sortField, sortOrder]);

    // Hàm thêm khuyến mãi mới
    const addPromotion = async () => {
        const validationError = validatePromotion(newPromotion);
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }
        try {
            await getCSRFToken();
            const xsrfToken = getCookie("XSRF-TOKEN");

            const response = await fetch(`${baseUrl}/api/admin/khuyenmai/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
                },
                credentials: "include",
                body: JSON.stringify({
                    TENKM: newPromotion.name,
                    NGAYBD: newPromotion.startDate,
                    NGAYKT: newPromotion.endDate,
                    PHANTRAM: newPromotion.discount,
                    scopeType: newPromotion.scopeType,
                    selectedScope: newPromotion.selectedScope,
                }),
            });

            if (!response.ok) {
                const res = await response.json();
                throw new Error(res.message || "Không thể thêm khuyến mãi.");
            }

            setSuccessMessage("Thêm khuyến mãi thành công!");
            setErrorMessage("");
            setNewPromotion({
                name: "",
                startDate: "",
                endDate: "",
                discount: "",
                scopeType: "category",
                selectedScope: [],
            });
            fetchPromotions(1);
        } catch (error) {
            setErrorMessage(error.message || "Đã xảy ra lỗi khi thêm khuyến mãi!");
        }
    };

    // Hàm tìm kiếm
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Hàm gọi API update
    const updatePromotion = async (promoId, updatedData) => {

        const validationError = validateUpdatedPromotion(updatedData);
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

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

    const renderScopeSelection = () => {
        const handleCheckboxChange = (type, id, isChecked) => {
            setNewPromotion((prev) => {
                const updatedScope = isChecked
                    ? [...prev.selectedScope, id]
                    : prev.selectedScope.filter((item) => item !== id);
                return { ...prev, scopeType: type, selectedScope: updatedScope };
            });
        };

        if (newPromotion.scopeType === "category") {
            return (
                <div>
                    <h3>Chọn danh mục áp dụng</h3>
                    {categories.map((category) => (
                        <label key={category.MADM}>
                            <input
                                type="checkbox"
                                checked={newPromotion.selectedScope.includes(category.MADM)}
                                onChange={(e) =>
                                    handleCheckboxChange("category", category.MADM, e.target.checked)
                                }
                            />
                            {category.TENDM}
                        </label>
                    ))}
                </div>
            );
        } else if (newPromotion.scopeType === "product") {
            return (
                <div>
                    <h3>Nhập ID sản phẩm áp dụng</h3>
                    <textarea
                        placeholder="Nhập ID sản phẩm, cách nhau bằng dấu phẩy (ví dụ: 1, 2, 3)"
                        name="selectedScope"
                        //value={newPromotion.selectedScope.join(", ")} // Hiển thị danh sách ID hiện tại
                        onChange={handleInputChange}
                        style={{ width: "99.44%", minHeight: "30px" }}
                    />
                </div>
            );
        }
        return null;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPromotion((prev) => {
            if (name === "selectedScope") {
                const ids = value.split(",").map((id) => id.trim()).filter((id) => id);
                return { ...prev, [name]: ids };
            }
            return { ...prev, [name]: value };
        });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Quản lý chương trình khuyến mãi</h1>
            {/* Thanh tìm kiếm */}
            <div className={`${styles.containerFilter}`}>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm khuyến mãi"
                        value={searchQuery}
                        onChange={handleSearch}
                        className={styles.input}
                    />
                </div>

                <div className={styles.sortControls}>
                    <select
                        value={sortField}
                        onChange={(e) => setSortField(e.target.value)}
                        className={styles.sortSelect}
                    >
                        <option value="NGAYBD">Ngày bắt đầu</option>
                        <option value="NGAYKT">Ngày kết thúc</option>
                        <option value="PHANTRAM">Giảm giá</option>
                    </select>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className={styles.sortSelect}
                    >
                        <option value="asc">Tăng dần</option>
                        <option value="desc">Giảm dần</option>
                    </select>
                </div>
            </div>

            {errorMessage && (
                <Notification
                    message={errorMessage}
                    type="error"
                    onClose={() => setErrorMessage("")}
                />
            )}
            {successMessage && (
                <Notification
                    message={successMessage}
                    type="success"
                    onClose={() => setSuccessMessage("")}
                />
            )}

            {/* Bảng danh sách khuyến mãi */}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Tên khuyến mãi</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Phần trăm giảm giá</th>
                        <th>Phạm vi áp dụng</th>
                        <th>Hành động</th>
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
                                <td>
                                    {promo.scopeType === "category" ? (
                                        <>
                                            <span>Danh mục: </span>
                                            {promo.selectedScope
                                                .map((id) => {
                                                    const category = categories.find((cat) => cat.MADM === id);
                                                    return category ? category.TENDM : id; // Lấy tên danh mục nếu tìm thấy, nếu không thì hiển thị ID
                                                })
                                                .join(", ")} {/* Nối các phần tử thành chuỗi với dấu phẩy */}
                                        </>
                                    ) : promo.scopeType === "product" ? (
                                        <>
                                            <span>Sản phẩm: </span>
                                            {promo.selectedScope.join(", ")} {/* Nối danh sách sản phẩm thành chuỗi với dấu phẩy */}
                                        </>
                                    ) : (
                                        <span>Không xác định</span>
                                    )}
                                </td>
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

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onInputPageChange={setInputPage}
                inputPage={inputPage}
            />

            {/* Form thêm khuyến mãi mới */}
            <h2>Thêm chương trình khuyến mãi mới</h2>
            <form
                className={styles.promotionForm}
                onSubmit={(e) => {
                    e.preventDefault();
                    addPromotion();
                }}
            >
                <div className={styles.formRow}>
                    <input
                        type="text"
                        placeholder="Tên khuyến mãi"
                        value={newPromotion.name}
                        onChange={(e) => setNewPromotion({ ...newPromotion, name: e.target.value })}
                        required
                        className={styles.formInput}
                    />
                    <input
                        type="number"
                        placeholder="Phần trăm giảm giá"
                        value={newPromotion.discount}
                        onChange={(e) => setNewPromotion({ ...newPromotion, discount: e.target.value })}
                        required
                        className={styles.formInput}
                    />
                </div>
                <div className={styles.formRow}>
                    <input
                        type="date"
                        value={newPromotion.startDate}
                        onChange={(e) => setNewPromotion({ ...newPromotion, startDate: e.target.value })}
                        required
                        className={styles.formInput}
                    />
                    <input
                        type="date"
                        value={newPromotion.endDate}
                        onChange={(e) => setNewPromotion({ ...newPromotion, endDate: e.target.value })}
                        required
                        className={styles.formInput}
                    />
                </div>
                <div className={styles.formRow}>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="scopeType"
                            value="category"
                            checked={newPromotion.scopeType === "category"}
                            onChange={() => setNewPromotion({ ...newPromotion, scopeType: "category" })}
                        />
                        Theo danh mục
                    </label>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="scopeType"
                            value="product"
                            checked={newPromotion.scopeType === "product"}
                            onChange={() => setNewPromotion({ ...newPromotion, scopeType: "product" })}
                        />
                        Theo sản phẩm
                    </label>
                </div>
                {renderScopeSelection()}
                <button type="submit" className={styles.submitButton}>Thêm</button>
            </form>
        </div>
    );
};

export default ManagePromotionsPage;
