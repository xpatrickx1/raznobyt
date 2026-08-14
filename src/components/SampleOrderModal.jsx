import { useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n/LangContext';
import './SampleOrderModal.css';

export default function SampleOrderModal({ product, onClose }) {
    const { t, lang } = useLang();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState('idle'); // idle | sending | success | error
    const backdropRef = useRef(null);

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    const handleBackdrop = (e) => {
        if (e.target === backdropRef.current) onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            const productTitle = product?.title?.[lang] || '';
            const body = new FormData();
            body.append('name', name);
            body.append('phone', phone);
            body.append('product', productTitle);

            const res = await fetch('/api/sample-order', { method: 'POST', body });
            if (res.ok) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className="modal-backdrop" ref={backdropRef} onClick={handleBackdrop} aria-modal="true" role="dialog">
            <div className="modal-box">
                <button className="modal-close" onClick={onClose} aria-label={t('modal.close')}>✕</button>

                {status === 'success' ? (
                    <div className="modal-success">
                        <div className="modal-success__icon">✓</div>
                        <p className="modal-success__text">{t('modal.successText')}</p>
                        <button className="modal-submit-btn" onClick={onClose}>{t('modal.close')}</button>
                    </div>
                ) : (
                    <>
                        <h2 className="modal-title">{t('modal.title')}</h2>
                        {product && (
                            <p className="modal-product-name">{product.title?.[lang]}</p>
                        )}
                        <form className="modal-form" onSubmit={handleSubmit} noValidate>
                            <div className="modal-field">
                                <label className="modal-label" htmlFor="modal-name">{t('modal.name')}</label>
                                <input
                                    id="modal-name"
                                    className="modal-input"
                                    type="text"
                                    placeholder={t('modal.namePlaceholder')}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    autoComplete="name"
                                    autoFocus
                                />
                            </div>
                            <div className="modal-field">
                                <label className="modal-label" htmlFor="modal-phone">{t('modal.phone')}</label>
                                <input
                                    id="modal-phone"
                                    className="modal-input"
                                    type="tel"
                                    placeholder="+380 __ ___ __ __"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    autoComplete="tel"
                                />
                            </div>
                            {status === 'error' && (
                                <p className="modal-error">{t('modal.errorText')}</p>
                            )}
                            <button
                                className="modal-submit-btn"
                                type="submit"
                                disabled={status === 'sending'}
                            >
                                {status === 'sending' ? t('modal.sending') : t('modal.submit')}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
