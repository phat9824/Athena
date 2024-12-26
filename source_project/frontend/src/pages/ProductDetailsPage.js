import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../AppContext.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import styles from "./ProductDetailsPage.module.css";

const ProductDetailsPage = () => {
    const { id } = useParams(); 
    const { getCSRFToken, getCookie, baseUrl } = useAppContext();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);
    const [isLoadingRelated, setIsLoadingRelated] = useState(false);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const navigate = useNavigate();
    const fetchProductDetails = async () => {
        setIsLoadingProduct(true);
        try {
            const response = await fetch(`${baseUrl}/api/trangsuc/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Không thể tải thông tin sản phẩm.");
            }

            const data = await response.json();
            setProduct(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoadingProduct(false);
        }
    };

    const fetchRelatedProducts = async () => {
        setIsLoadingRelated(true);
        try {
            const response = await fetch(`${baseUrl}/api/trangsuc/random/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Không thể tải sản phẩm liên quan.");
            }

            const data = await response.json();
            setRelatedProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoadingRelated(false);
        }
    };

    const handleQuantityChange = (action) => {
        if (action === "increment") {
            setQuantity((prev) => prev + 1);
        } else if (action === "decrement") {
            setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
        }
    };

    useEffect(() => {
        fetchProductDetails();
        fetchRelatedProducts();
    }, [id]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex + 1 < relatedProducts.length - 4 ? prevIndex + 1 : prevIndex
        );
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    };

    const handleAddToCart = async () => {
        try {
            await getCSRFToken();
            const xsrfToken = getCookie('XSRF-TOKEN');
            const response = await fetch(`${baseUrl}/api/customer/cart/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
                },
                body: JSON.stringify({
                    ID_TRANGSUC: product.ID,
                    SOLUONG: quantity,
                }),
                credentials: "include",
            });
    
            if (!response.ok) {
                throw new Error("Không thể thêm sản phẩm vào giỏ hàng.");
            }
    
            const data = await response.json();
            alert("Thêm vào giỏ hàng thành công!");
        } catch (err) {
            console.error(err);
            alert("Đã xảy ra lỗi khi thêm vào giỏ hàng.");
        }
    };

    if (isLoadingProduct || isLoadingRelated) {
        return <p>Đang tải dữ liệu...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!product) {
        return <p>Không tìm thấy sản phẩm!</p>;
    }

    const discountedPrice = product.GIANIEMYET * (1 - product.BEST_DISCOUNT / 100);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.productDetailContainer}>
                <div className={styles.productImageContainer}>
                    <img
                        src={`${baseUrl}${product.IMAGEURL}`}
                        alt={product.TENTS}
                        className={styles.productImage}
                    />
                </div>
                <div className={styles.productInfoContainer}>
                    <h1 className={styles.productTitle}>{product.TENTS}</h1>
                    <div className={styles.productPricing}>
                        <p className={styles.originalPrice}>
                            {product.GIANIEMYET.toLocaleString()} VND
                        </p>
                        {product.BEST_DISCOUNT > 0 && (
                            <div className={styles.discountContainer}>
                                <p className={styles.discountedPrice}>
                                    {discountedPrice.toLocaleString()} VND
                                </p>
                                <p className={styles.discountPercent}>
                                    -{product.BEST_DISCOUNT}%
                                </p>
                            </div>
                        )}
                    </div>
                    <p className={styles.productDescription}>{product.MOTA}</p>
                    <div className={styles.quantityContainer}>
                        <button
                            className={styles.quantityButton}
                            onClick={() => handleQuantityChange("decrement")}
                        >
                            <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span className={styles.quantityValue}>{quantity}</span>
                        <button
                            className={styles.quantityButton}
                            onClick={() => handleQuantityChange("increment")}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                    <button className={styles.addToCartButton} onClick={handleAddToCart}>
                        <FontAwesomeIcon icon={faCartPlus} /> Thêm vào giỏ hàng
                    </button>
                </div>
            </div>

            <div className={styles.relatedProductsSection}>
                <h2 className={styles.relatedProductsTitle}>Sản phẩm liên quan</h2>
                <div className={styles.relatedProductsSliderWrapper}>
                    <button
                        className={styles.sliderNavButton}
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                    >
                        &lt;
                    </button>
                    <div className={styles.relatedProductsSlider}>
                        {relatedProducts.slice(currentIndex, currentIndex + 5).map((item) => (
                            <div key={item.ID} className={styles.relatedProductCard}>
                                <img
                                    src={`${baseUrl}${item.IMAGEURL}`}
                                    alt={item.TENTS}
                                    className={styles.relatedProductImage}
                                />
                                <h3 className={styles.relatedProductTitle}>{item.TENTS}</h3>
                                <div className={styles.relatedProductPricing}>
                                    <p className={styles.relatedProductOriginalPrice}>
                                        {item.GIANIEMYET.toLocaleString()} VND
                                    </p>
                                    <p className={styles.relatedProductDiscountedPrice}>
                                        {(item.GIANIEMYET * (1 - item.BEST_DISCOUNT / 100)).toLocaleString()} VND
                                    </p>
                                </div>
                                <div className={styles.relatedProductActions}>
                                    <button
                                        onClick={() => navigate(`../Products/${item.ID}`)}
                                        className={styles.relatedProductDetailButton}
                                    >
                                        Mua ngay
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        className={styles.sliderNavButton}
                        onClick={handleNext}
                        disabled={currentIndex + 5 >= relatedProducts.length}
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
