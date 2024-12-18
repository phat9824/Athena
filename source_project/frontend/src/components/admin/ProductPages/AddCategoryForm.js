// src/components/admin/ProductsPage/AddCategoryForm.js

import React from "react";

const AddCategoryForm = ({ newCategory, setNewCategory, addCategory }) => {
    return (
        <div>
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

export default AddCategoryForm;
