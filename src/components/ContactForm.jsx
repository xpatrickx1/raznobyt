import { useLang } from '../i18n/LangContext';

export default function ContactForm({ withMessage = true }) {
    const { t } = useLang();
    return (
        <form
            action="/api/contact.php"
            method="POST"
            className="contact-block-form"
            onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const formData = new FormData(form);
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.innerText;

                try {
                    btn.innerText = t('home.formSending');
                    btn.disabled = true;
                    const res = await fetch('/api/contact.php', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    const data = await res.json();

                    if (res.ok && data.success) {
                        alert(t('home.formSuccess'));
                        form.reset();
                    } else {
                        alert(data.message || t('home.formError'));
                    }
                } catch (error) {
                    alert(t('home.formNetworkError'));
                } finally {
                    btn.innerText = originalText;
                    btn.disabled = false;
                }
            }}
        >
            <input type="hidden" name="_subject" value="Нова заявка з сайту Різнобит!" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />

            <div className="form-group">
                <label htmlFor="name" className="form-label">{t('home.formName')}</label>
                <input id="name" type="text" name="name" className="form-input" required />
            </div>
            <div className="form-group">
                <label htmlFor="contact" className="form-label">{t('home.formContact')}</label>
                <input id="contact" type="text" name="contact" className="form-input" required />
            </div>

            {withMessage && (
                <div className="form-group">
                    <label htmlFor="message" className="form-label">{t('home.formMessage')}</label>
                    <textarea id="message" name="message" className="form-textarea" rows="3" required></textarea>
                </div>
            )}

            <div style={{ display: 'none' }}>
                <input type="text" name="website" tabIndex="-1" autoComplete="off" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                {t('home.formSubmit')}
            </button>
            <p style={{ fontSize: 11, color: 'var(--c-text-muted)', textAlign: 'center', marginTop: 12 }}>
                {t('home.formTerms')}
            </p>
        </form>
    )
}