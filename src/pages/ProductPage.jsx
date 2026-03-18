import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import products from '../data/products.json';
import categories from '../data/categories.json';

const COLOR_MAP = {
  navy: '#1A3B6E', white: '#F0F0F0', khaki: '#7B7B4E', blue: '#2563EB',
  orange: '#EA6C1A', black: '#1A1A1A', gray: '#9CA3AF', green: '#2E7D5C',
  multicam: '#6B7A4A', yellow: '#FACC15', beige: '#C8B99A',
};

export default function ProductPage() {
  const { id } = useParams();
  const { lang, t } = useLang();
  const product = products.find(p => p.id === id);
  const [activeImg, setActiveImg] = useState(0);
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);

  if (!product) return <Navigate to="/catalog" replace />;

  const cat = categories.find(c => c.id === product.category);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleSend = (e) => {
    e.preventDefault();
    if (phone.trim()) { setSent(true); setPhone(''); }
  };

  const attrs = [
    { label: t('product.composition'), value: product.attributes.composition },
    { label: t('product.density'), value: product.attributes.density },
    { label: t('product.width'), value: product.attributes.width },
    { label: t('product.color'), value: (
      <span>
        <span className="color-dot" style={{ background: COLOR_MAP[product.attributes.color] || '#ccc', display:'inline-block', width:12, height:12, borderRadius:'50%', marginRight:6, verticalAlign:'middle', border:'1px solid rgba(0,0,0,0.1)' }} />
        {t(`colors.${product.attributes.color}`)}
      </span>
    )},
    { label: t('product.fabricType'), value: t(`fabricTypes.${product.attributes.fabricType}`) },
  ];

  return (
    <>
      <SEO
        title={product.title[lang]}
        description={product.description[lang].slice(0, 160)}
        keywords={`тканина, ${cat?.title[lang]}, ${t(`fabricTypes.${product.attributes.fabricType}`)}`}
      />

      <div className="product-page">
        <div className="container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link to="/">{t('nav.home')}</Link>
            <span className="breadcrumb__sep">›</span>
            <Link to="/catalog">{t('nav.catalog')}</Link>
            {cat && (
              <>
                <span className="breadcrumb__sep">›</span>
                <Link to={`/category/${cat.slug}`}>{cat.title[lang]}</Link>
              </>
            )}
            <span className="breadcrumb__sep">›</span>
            <span>{product.title[lang]}</span>
          </div>

          <div className="product-grid">
            {/* Images */}
            <div className="product-images">
              <img
                src={product.images[activeImg]}
                alt={product.title[lang]}
                className="product-main-img"
              />
              {product.images.length > 1 && (
                <div className="product-thumbs">
                  {product.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt=""
                      className={`product-thumb ${activeImg === i ? 'active' : ''}`}
                      onClick={() => setActiveImg(i)}
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="product-info">
              {cat && <div className="product-info__cat">{cat.title[lang]}</div>}
              <h1>{product.title[lang]}</h1>
              <p className="product-desc">{product.description[lang]}</p>

              <h3 style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--c-text-muted)', marginBottom: 12 }}>
                {t('product.characteristics')}
              </h3>
              <table className="product-attrs-table">
                <tbody>
                  {attrs.map((a, i) => (
                    <tr key={i}>
                      <th>{a.label}</th>
                      <td>{a.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Inquiry */}
              <div className="inquiry-box">
                <p>
                  {lang === 'ua'
                    ? 'Залиште ваш номер телефону і менеджер звʼяжеться з вами для уточнення ціни та наявності'
                    : 'Оставьте ваш номер телефона и менеджер свяжется с вами для уточнения цены и наличия'}
                </p>
                {sent ? (
                  <div className="success-banner">✓ {t('contacts.sent')}</div>
                ) : (
                  <form className="inquiry-form" onSubmit={handleSend}>
                    <input
                      type="tel"
                      placeholder="+380 __ ___ __ __"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required
                    />
                    <button type="submit" className="btn btn-accent">{t('product.addToCart')}</button>
                  </form>
                )}
              </div>

              <Link to="/contacts" className="btn btn-outline" style={{ color: 'var(--c-accent)', border: '1.5px solid var(--c-accent)', width: '100%', justifyContent: 'center' }}>
                {lang === 'ua' ? '📞 Зателефонувати' : '📞 Позвонить'}
              </Link>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div>
              <div className="section__header" style={{ textAlign: 'left', marginBottom: 28 }}>
                <div className="section__eyebrow">Також цікаво</div>
                <h2 className="section__title" style={{ fontSize: 28 }}>{t('product.relatedProducts')}</h2>
              </div>
              <div className="products-grid">
                {related.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
