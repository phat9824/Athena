import React, { useEffect, useState } from "react";
import { useAppContext } from "../../AppContext.js";
const ManageProductsPage = () => {
    const { getCSRFToken, getCookie, baseUrl } = useAppContext();
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

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
            fetchCategories();
        } catch (error) {
            setErrorMessage(error.message || "Đã có lỗi xảy ra, vui lòng thử lại!");
            setSuccessMessage("");
        }
    };

    return (
        <div>
            <h1>Quản lý sản phẩm</h1>
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

            <h2>Danh mục sản phẩm</h2>
            <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th>Mã danh mục</th>
                        <th>Tên danh mục</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category.MADM}>
                            <td>{category.MADM}</td>
                            <td>{category.TENDM}</td>
                            <td>
                                <button>Sửa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Thêm danh mục mới</h2>
            <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nhập tên danh mục"
            />
            <button onClick={addCategory}>Thêm</button>
        </div>
    );
};

export default ManageProductsPage;