import { useState } from 'react';
import { useLang } from '../i18n/LangContext';
import SEO from '../components/SEO';

const MANAGERS = [
  { name: 'Оксана Петренко', role: { ua: 'Менеджер з продажів', ru: 'Менеджер по продажам' }, phone: '+38 (067) 332-00-88', emoji: '👩‍💼' },
  { name: 'Дмитро Коваль', role: { ua: 'Технічний консультант', ru: 'Технический консультант' }, phone: '+38 (098) 710-35-17', emoji: '👨‍💼' },
  { name: 'Марина Лисенко', role: { ua: 'Менеджер з питань постачання', ru: 'Менеджер по вопросам поставок' }, phone: '+38 (044) 507-06-80', emoji: '👩‍💻' },
];

export default function Contacts() {
  const { lang, t } = useLang();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <>
      <SEO title={t('contacts.title')} description="Контакти Різнобит Textile Group. Телефони, адреса, форма зв'язку." />

      <div className="page-header">
        <div className="container">
          <div className="page-header__content">
            <div className="page-header__eyebrow">Зворотній зв'язок</div>
            <h1>{t('contacts.title')}</h1>
            <p>{t('contacts.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="container section">
        <div className="contacts-grid">
          {/* Info */}
          <div>
            <div className="contact-info-item">
              <div className="contact-info-icon">📍</div>
              <div>
                <div className="contact-info-label">{t('contacts.address')}</div>
                <div className="contact-info-value">м. Київ, вул. Текстильна, 12, оф. 5</div>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">📞</div>
              <div>
                <div className="contact-info-label">{t('contacts.phone')}</div>
                <div className="contact-info-value">
                  <a href="tel:+380445070680" style={{ color: 'var(--c-accent)' }}>(044) 507-06-80</a><br />
                  <a href="tel:+380673320088" style={{ color: 'var(--c-accent)' }}>(067) 332-00-88 Viber</a><br />
                  <a href="tel:+380987103517" style={{ color: 'var(--c-accent)' }}>(098) 710-35-17 Viber</a>
                </div>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">✉️</div>
              <div>
                <div className="contact-info-label">{t('contacts.email')}</div>
                <div className="contact-info-value">
                  <a href="mailto:info@raznobyt.com" style={{ color: 'var(--c-accent)' }}>info@raznobyt.com</a>
                </div>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">🕐</div>
              <div>
                <div className="contact-info-label">{t('contacts.hours')}</div>
                <div className="contact-info-value">{t('contacts.hoursValue')}</div>
              </div>
            </div>

            {/* Map placeholder */}
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--c-border)', height: 240, background: 'var(--c-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'var(--c-text-muted)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🗺️</div>
                <div>м. Київ, вул. Текстильна, 12</div>
              </div>
            </div>

            {/* Managers */}
            <div style={{ marginTop: 40 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 20 }}>{t('contacts.managers')}</h3>
              <div className="managers-grid">
                {MANAGERS.map((m, i) => (
                  <div key={i} className="manager-card">
                    <div className="manager-avatar">{m.emoji}</div>
                    <div className="manager-name">{m.name}</div>
                    <div className="manager-role">{m.role[lang]}</div>
                    <a href={`tel:${m.phone.replace(/\s/g, '')}`} className="manager-phone">{m.phone}</a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <div className="contact-form">
              <h3>{t('contacts.sendMessage')}</h3>
              {sent ? (
                <div className="success-banner" style={{ padding: '20px 18px', fontSize: 15 }}>
                  ✅ {t('contacts.sent')} {lang === 'ua' ? 'Менеджер звʼяжеться з вами найближчим часом.' : 'Менеджер свяжется с вами в ближайшее время.'}
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">{t('contacts.yourName')}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('contacts.yourEmail')}</label>
                    <input
                      type="email"
                      className="form-input"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('contacts.yourMessage')}</label>
                    <textarea
                      className="form-textarea"
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      required
                      rows={5}
                    />
                  </div>
                  <button type="submit" className="btn btn-accent" style={{ width: '100%', justifyContent: 'center', padding: '14px 28px', fontSize: 15 }}>
                    {t('contacts.send')} →
                  </button>
                </form>
              )}
            </div>

            {/* Info cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 20 }}>
              {[
                { icon: '🚚', label: lang === 'ua' ? 'Доставка по Україні' : 'Доставка по Украине', val: 'Нова Пошта, Укрпошта' },
                { icon: '📦', label: lang === 'ua' ? 'Мін. замовлення' : 'Мин. заказ', val: lang === 'ua' ? 'від 50 погонних метрів' : 'от 50 погонных метров' },
              ].map((c, i) => (
                <div key={i} style={{ background: 'var(--c-bg-alt)', border: '1px solid var(--c-border)', borderRadius: 'var(--radius-lg)', padding: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--c-text-muted)', marginBottom: 4 }}>{c.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{c.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
