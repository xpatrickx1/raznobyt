import React, { useEffect } from 'react';
import { useLang } from '../i18n/LangContext';

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerText;

        try {
            btn.innerText = t('home.formSending') || (lang === 'ua' ? 'Відправка...' : 'Отправка...');
            btn.disabled = true;
            const res = await fetch(form.action, {
                method: "POST",
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            if (res.ok) {
                alert(t('home.formSuccess') || (lang === 'ua' ? 'Дякуємо! Заявка відправлена.' : 'Спасибо! Заявка отправлена.'));
                form.reset();
                onClose();
            } else {
                alert(t('home.formError') || 'Помилка відправки');
            }
        } catch (error) {
            alert(t('home.formNetworkError') || 'Мережева помилка');
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    };

    return (
        <div className={`popup-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
            <div className="popup-content" onClick={e => e.stopPropagation()}>
                <button className="popup__close" onClick={onClose} aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                {/* <h3 className="section__title" style={{ textAlign: 'center', marginBottom: '24px', fontSize: '24px' }}>
                    {lang === 'ua' ? 'Отримати прайс' : 'Получить прайс'}
                </h3> */}
                <form
                    action="https://formsubmit.co/info@riznobyt.com"
                    method="POST"
                    className="contact-block-form"
                    onSubmit={handleSubmit}
                >
                    <input type="hidden" name="_subject" value="Попап: Запит на прайс" />
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_template" value="table" />

                    <div className="form-group">
                        <label className="form-label">{lang === 'ua' ? 'Ваше ім’я' : 'Ваше имя'}</label>
                        <input
                            type="text"
                            name="name"
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">{lang === 'ua' ? 'Телефон' : 'Телефон'}</label>
                        <input
                            type="text"
                            name="phone"
                            className="form-input"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '36px' }}>
                        {lang === 'ua' ? 'Підібрати тканину' : 'Подобрать ткань'}
                    </button>
                </form>
            </div>
        </div>
    );
}
