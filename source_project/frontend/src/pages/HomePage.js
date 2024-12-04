import React, {useEffect, useState} from 'react';
import Banner from '../components/user-components/banner-home';
import { useAppContext } from '../AppContext';
import '../styles/HomePage.css';

const HomePage = () => {

    const {baseUrl} = useAppContext();

    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/images`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                const res = await response.json();
                setImages(res);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };
    
        fetchImages();
    }, [baseUrl]);

    return (
        <div>
            <Banner />
            <br />
            <p>Test API</p>
            <div className="image-gallery">
                {images.slice(0, 20).map((image) => (
                    <div className="image-item" key={image.ID}>
                        <img
                            src={`${baseUrl}${image.IMAGEURL}`}
                            alt={image.TENTS}
                            className="image"
                        />
                        <p className="image-title">{image.TENTS}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;