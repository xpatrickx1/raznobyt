import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import categories from '../data/categories.json';
import products from '../data/products.json';

const WHY_ICONS = ['📦', '💰', '🚚', '✅'];

export default function Home() {
  const { lang, t } = useLang();
  const featured = products.slice(0, 4);
  const whyItems = t('home.whyUsItems');

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

      {/* CATEGORIES */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <div className="section__eyebrow">Асортимент</div>
            <h2 className="section__title">{t('home.categoriesTitle')}</h2>
            <p className="section__sub">{t('home.categoriesSubtitle')}</p>
          </div>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link to={`/category/${cat.slug}`} key={cat.id} className="category-card">
                <img
                  src={cat.image}
                  alt={cat.title[lang]}
                  className="category-card__img"
                  loading="lazy"
                />
                <div className="category-card__overlay" />
                <div className="category-card__body">
                  <div className="category-card__icon">{cat.icon}</div>
                  <div className="category-card__title">{cat.title[lang]}</div>
                  <div className="category-card__count">
                    {products.filter(p => p.category === cat.id).length}{' '}
                    {lang === 'ua' ? 'позицій' : 'позиций'}
                  </div>
                </div>
              </Link>
            ))}
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
