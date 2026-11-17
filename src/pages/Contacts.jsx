import { useLang } from '../i18n/LangContext';
import SEO from '../components/SEO';
import HeroSection from '../components/HeroSection';
import phoneIcon from '@/assets/images/icons/phone.svg';
import locationIcon from '@/assets/images/icons/location.svg';
import emailIcon from '@/assets/images/icons/email.svg';
import clockIcon from '@/assets/images/icons/clock.svg';
import ContactForm from '../components/ContactForm';

export default function Contacts() {
  const { t, lang } = useLang();

  return (
    <>
      <SEO title={t('contacts.title')} description={lang === 'ru'
        ? 'Контакты Різнобит. Телефоны, адрес, форма обратной связи.'
        : "Контакти Різнобит. Телефони, адреса, форма зв'язку."} />

      <HeroSection
        title={t('contacts.title')}
        subtitle={t('contacts.subtitle')}
      />

      <div className="container section">
        <div className="contacts-grid">
          {/* Info */}
          <div>
            <div className="contact-info-item fade-up fade-up-1">
              <div className="contact-info-icon"><img src={locationIcon} alt="Location" width="18" height="18" loading="lazy" /></div>
              <div>
                <div className="contact-info-label">{t('contacts.address')}</div>
                <div className="contact-info-value">м. Київ, вул. Лугова, 9С</div>
              </div>
            </div>
            <div className="contact-info-item fade-up fade-up-2">
              <div className="contact-info-icon"><img src={phoneIcon} alt="Phone" width="18" height="18" loading="lazy" /></div>
              <div>
                <div className="contact-info-label">{t('contacts.phone')}</div>
                <div className="contact-info-value">
                  <a href="tel:+380445070680">(044) 507-06-80</a>
                  <a href="tel:+380445070681">(044) 507-06-81</a>
                  <a href="tel:+380445070682">(044) 507-06-82</a>
                  <a href="tel:+380445070684">(044) 507-06-84</a>
                  <a href="tel:+380673320088">(067) 332-00-88</a>
                  <a href="tel:+380987103517">(098) 710-35-17</a>
                </div>
              </div>
            </div>
            <div className="contact-info-item fade-up fade-up-1">
              <div className="contact-info-icon"><img src={emailIcon} alt="Email" width="18" height="18" loading="lazy" /></div>
              <div>
                <div className="contact-info-label">{t('contacts.email')}</div>
                <div className="contact-info-value">
                  <a href="mailto:raznooffice@ukr.net" style={{ color: 'var(--c-accent)' }}>raznooffice@ukr.net</a>
                </div>
              </div>
            </div>
            <div className="contact-info-item fade-up fade-up-2">
              <div className="contact-info-icon"><img src={clockIcon} alt="Clock" width="18" height="18" loading="lazy" /></div>
              <div>
                <div className="contact-info-label">{t('contacts.hours')}</div>
                <div className="contact-info-value">{t('contacts.hoursValue')}</div>
              </div>
            </div>

            {/* Map */}
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--c-border)', height: 280, background: 'var(--c-bg-alt)' }}>
              <iframe
                className="embed-map-frame"
                scrolling="no"
                width="100%"
                height="480"
                title="Розташування Різнобит"
                src="https://maps.google.com/maps?width=600&height=400&hl=en&q=%D0%9B%D1%83%D0%B3%D0%BE%D0%B2%D0%B0%209%D1%81&t=&z=16&ie=UTF8&iwloc=B&output=embed"
                loading="lazy"
              />
            </div>
          </div>

          {/* Form */}
          <div>
            <div className="contact-form-card fade-up fade-up-2">
              <h3>{t('contacts.sendMessage')}</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
