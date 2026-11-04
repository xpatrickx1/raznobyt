
import { useState } from 'react';
import { isValidPhone } from '../assets/utils/phone-mask.js';

export default function useContactForm() {
    const [status, setStatus] = useState(null);
    const [sending, setSending] = useState(false);

    const submitForm = async ({
        phone,
        message = 'Не вказано',
        name = 'Не вказано',
        product = ''
    }) => {
        if (!isValidPhone(phone)) {
            setStatus({
                type: 'error',
                message: 'Будь ласка, введіть повний номер телефону'
            });
            return false;
        }

        setStatus(null);
        setSending(true);

        try {
            const formData = new FormData();

            formData.set('name', name);
            formData.set('contact', phone);
            formData.set('phone', phone);
            formData.set('message', message);
            formData.set('product', product);
            formData.set('page_url', window.location.href);
            formData.set('referrer', document.referrer);

            const response = await fetch('/api/contact.php', {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Не вдалося відправити заявку');
            }

            setStatus({
                type: 'success',
                message: 'Дякуємо! Ми скоро з вами зв’яжемося.'
            });

            return true;

        } catch (error) {
            setStatus({
                type: 'error',
                message: error.message || 'Помилка відправки. Спробуйте ще раз.'
            });

            return false;

        } finally {
            setSending(false);
        }
    };

    return {
        submitForm,
        status,
        sending,
        setStatus
    };
}
