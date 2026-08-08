import { useState, useEffect } from 'react';
import placeholder from '../assets/images/placeholder.svg';

const Image = ({ src, alt, className, loading = 'lazy', ...props }) => {
    const [state, setState] = useState({ src, error: false, loaded: false });

    if (state.src !== src) {
        setState({ src, error: false, loaded: false });
    }

    if (state.error || !src) {
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
            className={`${className || ''} ${state.loaded ? 'img-loaded' : 'img-loading'}`}
            onLoad={() => setState(prev => ({ ...prev, loaded: true }))}
            onError={() => setState(prev => ({ ...prev, error: true }))}
            {...props}
        />
    );
};

export default Image;
