import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import categories from '../data/categories.json';
import products from '../data/products.js';
import AnimatedStat from '../components/AnimatedStat';

const WHY_ICONS = [
  <svg key="1" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>,
  <svg key="2" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>,
  <svg key="3" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>,
  <svg key="4" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
];

export default function Home() {
  const { lang, t } = useLang();
  const featured = products.slice(0, 4);
  const whyItems = t('home.whyUsItems');
  const contactList = t('home.contactBlockList') || [];

  return (
    <>
      <SEO
        title={t('nav.home')}
        description="Якісні технічні та спеціальні тканини для бізнесу. Робочий одяг, медичні тканини, армійські матеріали."
        keywords="тканини, спецодяг, медичні тканини, робочий одяг, текстиль"
      />

      {/* HERO */}
      <section className="hero">
        <div className="hero__bg" />
        <div className="hero__pattern" />
        <div className="container">
          <div className="hero__content">
            <div className="hero__eyebrow fade-up fade-up-1">Різнобит Textile Group</div>
            <h1 className="fade-up fade-up-2">{t('hero.title')}</h1>
            <p className="hero__sub fade-up fade-up-3">{t('hero.subtitle')}</p>
            <div className="hero__btns fade-up fade-up-3">
              <Link to="/catalog" className="btn btn-primary">{t('hero.cta')}</Link>
              <Link to="/contacts" className="btn btn-outline">{t('hero.cta2')}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS INTRO */}
      <section className="section" style={{ background: 'var(--c-bg)', paddingBottom: 0 }}>
        <div className="container">
          <p style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', fontSize: '1.05rem', lineHeight: '1.6', color: 'var(--c-text)' }}>
            {t('home.statsIntro')}
          </p>
        </div>
      </section>

      {/* STATS BLOCK */}
      <section className="section" style={{ background: 'var(--c-bg)' }}>
        <div className="container">
          <div className="stats-grid">
            {Array.isArray(t('home.statsList')) && t('home.statsList').map((s, i) => (
              <AnimatedStat key={i} value={s.value} suffix={s.suffix} label={s.label} prefix={s.prefix} />
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT BLOCK UNDER HERO */}
      <section className="section" style={{ background: 'var(--c-bg-alt)', position: 'relative', zIndex: 2 }}>
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
                  <li key={i}><span className="chk">✔️</span> {item}</li>
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
                  {/* Вкажіть тут вашу робочу пошту замість info@riznobyt.com */}
                  <input type="hidden" name="_subject" value="Нова заявка з сайту Різнобит!" />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_template" value="table" />

                  <div className="form-group">
                    <label className="form-label">{t('home.formName')}</label>
                    <input type="text" name="name" className="form-input" placeholder={t('home.formNamePlaceholder')} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('home.formContact')}</label>
                    <input type="text" name="contact" className="form-input" placeholder={t('home.formContactPlaceholder')} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('home.formMessage')}</label>
                    <textarea name="message" className="form-textarea" placeholder={t('home.formMessagePlaceholder')} rows="3" required></textarea>
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

      {/* CATEGORIES */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <div className="section__eyebrow">Асортимент</div>
            <h2 className="section__title">{t('home.categoriesTitle')}</h2>
            <p className="section__sub">{t('home.categoriesSubtitle')}</p>
          </div>
          <div className="categories-grid">
            {categories.slice(0, 6).map(cat => (
              <Link to={`/category/${cat.id}`} key={cat.id} className="category-card">
                <img
                  src={cat.image}
                  alt={cat.title[lang]}
                  className="category-card__img"
                  loading="lazy"
                />
                <div className="category-card__overlay" />
                <div className="category-card__body">
                  {/* <div className="category-card__icon">{cat.icon}</div> */}
                  <div className="category-card__title">{cat.title[lang]}</div>
                  <div className="category-card__count">
                    {products.filter(p => p.category === cat.id).length}{' '}
                    {lang === 'ua' ? 'позицій' : 'позиций'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link to="/catalog" className="btn btn-accent">
              {lang === 'ua' ? 'Всі категорії' : 'Все категории'}
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section" style={{ background: 'var(--c-bg-alt)', marginTop: -1 }}>
        <div className="container">
          <div className="section__header">
            <div className="section__eyebrow">Топ позиції</div>
            <h2 className="section__title">{t('home.featuredTitle')}</h2>
          </div>
          <div className="products-grid">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link to="/catalog" className="btn btn-accent">{t('hero.cta')}</Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <div className="section__eyebrow">Наші переваги</div>
            <h2 className="section__title">{t('home.whyUs')}</h2>
          </div>
          <div className="why-grid">
            {Array.isArray(whyItems) && whyItems.map((item, i) => (
              <div key={i} className="why-card">
                <span className="why-card__icon">{WHY_ICONS[i]}</span>
                <div className="why-card__title">{item.title}</div>
                <p className="why-card__desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ background: 'var(--c-accent)', padding: '56px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,38px)', color: '#fff', marginBottom: 12 }}>
            {lang === 'ua' ? 'Потрібна консультація?' : 'Нужна консультация?'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 28, fontSize: 15 }}>
            {lang === 'ua'
              ? 'Наші менеджери допоможуть підібрати тканину під ваші вимоги'
              : 'Наши менеджеры помогут подобрать ткань под ваши требования'}
          </p>
          <Link to="/contacts" className="btn" style={{ background: '#fff', color: 'var(--c-accent)', fontWeight: 700 }}>
            {t('hero.cta2')} →
          </Link>
        </div>
      </section>
    </>
  );
}
