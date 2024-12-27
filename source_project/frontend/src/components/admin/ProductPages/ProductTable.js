// src/components/admin/ProductPages/ProductTable.js
import React from "react";
import styles from "./ManageProductsPage.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave } from "@fortawesome/free-solid-svg-icons";

const ProductTable = ({
  products,
  categories,
  baseUrl,
  mapCategoryName,
  handleProductFieldChange, // Sử dụng tên chính xác
  updateProduct,
}) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Hình ảnh</th>
          <th>Tên sản phẩm</th>
          <th>Danh mục</th>
          <th>Giá niêm yết</th>
          <th>Số lượng tồn kho</th>
          <th>Ẩn sản phẩm</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.ID}>
            <td>{product.ID}</td>
            <td>
              {product.IMAGEURL ? (
                <img
                  src={`${baseUrl}${product.IMAGEURL}`}
                  alt="Product"
                  className={styles.thumbnail}
                />
              ) : (
                "Không có ảnh"
              )}
            </td>
            <td>
              {product.isEditing ? (
                <input
                  value={product.editingName || product.TENTS}
                  onChange={(e) =>
                    handleProductFieldChange(product.ID, "editingName", e.target.value)
                  }
                  className={styles.inputSmall}
                />
              ) : (
                product.TENTS
              )}
            </td>
            <td>
              {product.isEditing ? (
                <select
                  value={product.editingCategory || product.MADM}
                  onChange={(e) =>
                    handleProductFieldChange(product.ID, "editingCategory", e.target.value)
                  }
                  className={styles.select}
                >
                  {categories.map((cat) => (
                    <option key={cat.ID} value={cat.MADM}>
                      {cat.TENDM}
                    </option>
                  ))}
                </select>
              ) : (
                mapCategoryName(product.MADM)
              )}
            </td>
            <td>
              {product.isEditing ? (
                <input
                  type="number"
                  value={product.editingPrice || product.GIANIEMYET}
                  onChange={(e) =>
                    handleProductFieldChange(product.ID, "editingPrice", e.target.value)
                  }
                  className={styles.inputSmall}
                />
              ) : (
                `${product.GIANIEMYET} VND`
              )}
            </td>
            <td>
              {product.isEditing ? (
                <input
                  type="number"
                  value={product.editingStock || product.SLTK}
                  onChange={(e) =>
                    handleProductFieldChange(product.ID, "editingStock", e.target.value)
                  }
                  className={styles.inputSmall}
                />
              ) : (
                product.SLTK
              )}
            </td>
            <td>
              <input
                type="checkbox"
                checked={product.DELETED_AT !== null}
                onChange={(e) =>
                  handleProductFieldChange(product.ID, "deleted", e.target.checked)
                }
              />
            </td>
            <td>
              {product.isEditing ? (
                <button
                  className={styles.iconButton}
                  onClick={() => updateProduct(product.ID)}
                >
                  <FontAwesomeIcon icon={faSave} />
                </button>
              ) : (
                <button
                  className={styles.iconButton}
                  onClick={() => {
                    handleProductFieldChange(product.ID, "isEditing", true);
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
