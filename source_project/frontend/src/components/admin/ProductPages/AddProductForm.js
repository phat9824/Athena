// src/components/admin/ProductsPage/AddProductForm.js

import React from "react";
import styles from "./ManageProductsPage.module.css";

const AddProductForm = ({ categories, newProduct, setNewProduct, addProduct }) => {
    return (
        <div>
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
                            imageFile: e.target.files[0],
                        }))
                    }
                />

                <button type="submit">Thêm sản phẩm</button>
            </form>
        </div>
    );
};

export default AddProductForm;
