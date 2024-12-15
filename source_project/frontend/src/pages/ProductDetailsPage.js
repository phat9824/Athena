import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../AppContext.js";
import styles from "./ProductDetailsPage.module.css";

const ProductDetailsPage = () => {
    const { id } = useParams(); // Lấy id từ URL
    const { baseUrl } = useAppContext();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            setIsLoading(true);
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
                setIsLoading(false);
            }
        };

        fetchProductDetails();
    }, [id, baseUrl]);

    if (isLoading) {
        return <p>Đang tải thông tin sản phẩm...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!product) {
        return <p>Không tìm thấy sản phẩm!</p>;
    }

    return (
        <div className={styles.container}>
            <h1>{product.TENTS}</h1>
            <img
                src={`${baseUrl}${product.IMAGEURL}`}
                alt={product.TENTS}
                className={styles.productImage}
            />
            <p className={styles.price}>Giá: {product.GIANIEMYET.toLocaleString()} VND</p>
            <p className={styles.description}>{product.MOTA}</p>
        </div>
    );
};

export default ProductDetailsPage;
