import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageProductsPage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/danhmucts') // Đảm bảo URL đúng
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy danh mục:', error);
      });
  }, []);

  return (
    <div>
      <h1>Quản lý sản phẩm</h1>
      <h2>Danh mục sản phẩm</h2>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Mã danh mục</th>
            <th>Tên danh mục</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.MADM}>
              <td>{category.MADM}</td>
              <td>{category.TENDM}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProductsPage;
