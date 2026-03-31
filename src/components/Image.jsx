import { useState, useEffect } from 'react';
import placeholder from '../assets/images/placeholder.svg';

const Image = ({ src, alt, className, loading = 'lazy', ...props }) => {
    const [error, setError] = useState(false);
    const [loaded, setLoaded] = useState(false);

    // Reset state if src changes
    useEffect(() => {
        setError(false);
        setLoaded(false);
    }, [src]);

    if (error || !src) {
        return (
            <div className={`image-fallback ${className || ''}`}>
                <img
                    src={placeholder}
                    alt="Placeholder"
                    className="image-fallback__inner"
                />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            loading={loading}
            className={`${className || ''} ${loaded ? 'img-loaded' : 'img-loading'}`}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            {...props}
        />
    );
};

export default Image;
