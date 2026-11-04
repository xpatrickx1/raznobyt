import { useState } from 'react';
import { useLang } from '../i18n/LangContext';
import { formatPhone, isValidPhone, setCursorPosition } from '../assets/utils/phone-mask.js';

export default function ContactForm({ withMessage = true }) {
    const { t, lang } = useLang();

    const [status, setStatus] = useState(null);
    const [sending, setSending] = useState(false);
    const [phone, setPhone] = useState('');

    const phoneErrorMessage = lang === 'ru'
        ? 'Пожалуйста, введите полный номер телефона: +38 (0XX) XXX-XX-XX'
        : 'Будь ласка, введіть повний номер телефону: +38 (0XX) XXX-XX-XX';

    const handlePhoneChange = (e) => {
        const input = e.target;
        const formatted = formatPhone(input.value);
        setPhone(formatted);
        input.setCustomValidity('');
        setCursorPosition(input, formatted.length);
    };

    const handlePhoneBlur = (e) => {
        const input = e.target;
        if (phone && !isValidPhone(phone)) {
            input.setCustomValidity(phoneErrorMessage);
        } else {
            input.setCustomValidity('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidPhone(phone)) {
            setStatus({
                type: 'error',
                message: phoneErrorMessage
            });
            return;
        }

        const form = e.currentTarget;
        const formData = new FormData(form);
        formData.set('contact', phone);
        if (!formData.has('phone')) {
            formData.set('phone', phone);
        }

        setStatus(null);
        setSending(true);

        try {
            const res = await fetch('/api/contact.php', {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json'
                }
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setStatus({
                    type: 'success',
                    message: t('home.formSuccess')
                });

                form.reset();
                setPhone('');
            } else {
                setStatus({
                    type: 'error',
                    message: data.message || t('home.formError')
                });
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: t('home.formNetworkError')
            });
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <form
                action="/api/contact.php"
                method="POST"
                className="contact-block-form"
                onSubmit={handleSubmit}
                onChange={() => {
                    if (status) setStatus(null);
                }}
            >
                <div className="form-group">
                    <label htmlFor="name" className="form-label">
                        {t('home.formName')}
                    </label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="contact" className="form-label">
                        {t('home.formContact')}
                    </label>
                    <input
                        id="contact"
                        type="tel"
                        name="contact"
                        className="form-input"
                        placeholder="+38 (0__) ___-__-__"
                        value={phone}
                        onChange={handlePhoneChange}
                        onBlur={handlePhoneBlur}
                        pattern="^\+38\s\(0\d{2}\)\s\d{3}-\d{2}-\d{2}$"
                        title="+38 (0XX) XXX-XX-XX"
                        autoComplete="tel"
                        required
                    />
                </div>

                {withMessage ? (
                    <div className="form-group">
                        <label htmlFor="message" className="form-label">
                            {t('home.formMessage')}
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            className="form-textarea"
                            rows="3"
                            required
                        />
                    </div>
                ) : (
                    <input
                        type="hidden"
                        name="message"
                        value="Не вказано"
                    />
                )}

                <div style={{ display: 'none' }}>
                    <input
                        type="text"
                        name="website"
                        tabIndex="-1"
                        autoComplete="off"
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={sending}
                    style={{
                        width: '100%',
                        justifyContent: 'center',
                        opacity: sending ? 0.7 : 1,
                        cursor: sending ? 'wait' : 'pointer'
                    }}
                >
                    {sending ? t('home.formSending') : t('home.formSubmit')}
                </button>

                <p style={{
                    fontSize: 11,
                    color: 'var(--c-text-muted)',
                    textAlign: 'center',
                    marginTop: 12
                }}>
                    {t('home.formTerms')}
                </p>
            </form>

            {status && (
                <div
                    className={`contact-form-feedback contact-form-feedback--${status.type}`}
                    role={status.type === 'error' ? 'alert' : 'status'}
                    aria-live="polite"
                >
                    {status.message}
                </div>
            )}
        </>
    );
}
