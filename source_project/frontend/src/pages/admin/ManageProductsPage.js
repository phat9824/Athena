import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageProductsPage = () => {
    const [categories, setCategories] = useState([]); // Danh mục sản phẩm
    const [newCategory, setNewCategory] = useState(""); // Tên danh mục mới

    // Gọi API để lấy danh mục
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        axios
            .get("http://127.0.0.1:8000/api/danhmucts")
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error("Lỗi khi lấy danh mục sản phẩm:", error);
            });
    };

    // Hàm thêm danh mục mới
    const addCategory = () => {
        if (!newCategory) {
            alert("Tên danh mục không được để trống!");
            return;
        }

        axios
            .post("http://127.0.0.1:8000/api/danhmucts/create", {
                TENDM: newCategory,
            })
            .then((response) => {
                alert(response.data.message);
                fetchCategories(); // Refresh categories after adding
                setNewCategory(""); // Clear the input
            })
            .catch((error) => {
                console.error("Lỗi khi thêm danh mục:", error);
                alert("Không thể thêm danh mục. Vui lòng thử lại.");
            });
    };
    return (
        <div>
            <h1>Quản lý sản phẩm</h1>
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
