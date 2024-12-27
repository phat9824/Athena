import React, { useEffect, useState } from 'react';
import Banner from '../components/user-components/banner-home';
import { useAppContext } from '../AppContext';
import { useNavigate } from 'react-router-dom'; 
import styles from './HomePage.module.css';  // Import the CSS module

const HomePage = () => {
    const { baseUrl } = useAppContext();
    const [topProducts, setTopProducts] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const navigate = useNavigate();

    // Fetch categories and top products
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const categoryResponse = await fetch(`${baseUrl}/api/danhmucts`);
                const categories = await categoryResponse.json();
                setCategoryOptions(categories);

                // Fetch top products
                const topProductsResponse = await fetch(`${baseUrl}/api/top-products`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });
                
                if (!topProductsResponse.ok) {
                    throw new Error('Không thể tải sản phẩm nổi bật.');
                }
                
                const topProductsData = await topProductsResponse.json();
                setTopProducts(topProductsData.topProducts);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            }
        };

        fetchData();
    }, [baseUrl]);

    // Handle "Mua ngay" click
    const handleViewDetails = (productId) => {
        navigate(`./Products/${productId}`);
    };

    return (
        <div>
            <Banner />
            <br />
            <h1>BESTSELLER</h1>

            <div className={styles.topProductsSection}>
                {/* Check if there are any products */}
                {Array.isArray(topProducts) && topProducts.length > 0 ? (
                    topProducts.map((category) => {
                        // Find category name from categoryOptions based on MADM
                        const categoryName = categoryOptions.find(
                            (cat) => cat.MADM === category.categoryId
                        )?.TENDM || 'Không rõ';

                        return (
                            <div key={category.categoryId} className={styles.categorySection}>
                                <h2>{categoryName}</h2>
                                <div className={styles.topProducts}>
                                    {category.products.length > 0 ? (
                                        category.products.map((product) => (
                                            <div key={product.ID} className={styles.productCard}>
                                                <img
                                                    src={`${baseUrl}${product.IMAGEURL}`}
                                                    alt={product.TENTS}
                                                    className={styles.productImage}
                                                />
                                                <h3 className={styles.productName}>{product.TENTS}</h3>
                                                <div className="price-details">
                                                    <p className={styles.productPrice}>
                                                        {product.GIANIEMYET.toLocaleString()} VND
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleViewDetails(product.ID)}
                                                    className={styles.buyNowButton}
                                                >
                                                    Mua ngay
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Không có sản phẩm trong danh mục này.</p>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>Không có sản phẩm nào để hiển thị.</p>
                )}
            </div>
        </div>
    );
};

export default HomePage;
