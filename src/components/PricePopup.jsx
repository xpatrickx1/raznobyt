import React, { useEffect } from 'react';
import { useLang } from '../i18n/LangContext';
import ContactForm from './ContactForm';


export default function PricePopup({ isOpen, onClose }) {
    const { lang, t } = useLang();

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            // Prevent scrolling when popup is open
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    return (
        <div className={`popup-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
            <div className="popup-content" onClick={e => e.stopPropagation()}>
                <button className="popup__close" onClick={onClose} aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <ContactForm withMessage={false} />
            </div>
        </div>
    );
}
