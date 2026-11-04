import { useLang } from '../../i18n/LangContext';
import ContatcForm from '../ContactForm';

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
                            <ContatcForm />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
