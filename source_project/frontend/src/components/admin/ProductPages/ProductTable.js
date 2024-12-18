// src/components/admin/ProductsPage/ProductTable.js

import React from "react";
import styles from "./ManageProductsPage.module.css";

const ProductTable = ({ products, baseUrl, mapCategoryName, handleProductFieldChange, updateProduct }) => {
    return (
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
                            <input
                                type="number"
                                value={product.editingPrice !== undefined ? product.editingPrice : product.GIANIEMYET}
                                onChange={(e) => handleProductFieldChange(product.ID, 'editingPrice', e.target.value)}
                                className={styles.inputSmall}
                            /> VND
                        </td>
                        <td className={styles.td}>
                            <input
                                type="number"
                                value={product.editingStock !== undefined ? product.editingStock : product.SLTK}
                                onChange={(e) => handleProductFieldChange(product.ID, 'editingStock', e.target.value)}
                                className={styles.inputSmall}
                            />
                        </td>
                        <td className={styles.td}>
                            <label>
                                Ẩn sản phẩm:
                                <input
                                    type="checkbox"
                                    checked={product.DELETED_AT !== null}
                                    onChange={(e) => handleProductFieldChange(product.ID, 'deleted', e.target.checked)}
                                />
                            </label>
                        </td>
                        <td className={styles.td}>
                            <button onClick={() => updateProduct(product.ID)}>Lưu</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ProductTable;
