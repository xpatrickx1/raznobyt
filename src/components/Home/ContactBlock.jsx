import { useLang } from '../../i18n/LangContext';

export default function ContactBlock() {
    const { t } = useLang();
    const contactList = t('home.contactBlockList') || [];

    return (
        <section className="section" style={{ background: 'var(--c-bg)', position: 'relative', zIndex: 2 }}>
            <div className="container">
                <div className="contact-block-grid">
                    <div className="contact-block-left fade-up fade-up-1">
                        <h2 className="section__title" style={{ textAlign: 'left', marginBottom: 16 }}>
                            {t('home.contactBlockTitle')}
                        </h2>
                        <p className="section__sub" style={{ textAlign: 'left', marginBottom: 32, fontSize: 16 }}>
                            {t('home.contactBlockSub')}
                        </p>
                        <ul className="contact-block-list">
                            {Array.isArray(contactList) && contactList.map((item, i) => (
                                <li key={i}><span className="chk">✔</span> {item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="contact-block-right fade-up fade-up-2">
                        <div className="contact-form-card">
                            <form
                                action="https://formsubmit.co/info@riznobyt.com"
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
                                        const res = await fetch(form.action, {
                                            method: "POST",
                                            body: formData,
                                            headers: { 'Accept': 'application/json' }
                                        });
                                        if (res.ok) {
                                            alert(t('home.formSuccess'));
                                            form.reset();
                                        } else {
                                            alert(t('home.formError'));
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
                                    <label className="form-label">{t('home.formName')}</label>
                                    <input type="text" name="name" className="form-input" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('home.formContact')}</label>
                                    <input type="text" name="contact" className="form-input" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('home.formMessage')}</label>
                                    <textarea name="message" className="form-textarea" rows="3" required></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                    {t('home.formSubmit')}
                                </button>
                                <p style={{ fontSize: 11, color: 'var(--c-text-muted)', textAlign: 'center', marginTop: 12 }}>
                                    {t('home.formTerms')}
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
