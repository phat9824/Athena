import React, {useEffect, useState} from 'react';
import Banner from '../components/user-components/banner-home';
import { useAppContext } from '../AppContext';

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
            <br></br>
            <div>
                {images.map((image) => (
                    <div key={image.ID}>
                        <img
                            src={`${baseUrl}${image.IMAGEURL}`}
                            alt={image.TENTS}
                        />
                        <p>{image.TENTS}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;