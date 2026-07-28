import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import categories from '../data/categories.json';
import { formatComposition } from '../data/compositions.js';
import { getProductImage } from '../assets/utils/imageLoader.js';
import placeholder from '../assets/images/placeholder.svg';
import phoneIcon from '@/assets/images/icons/phone.svg';

export default function ProductPage() {
  const { slug } = useParams();
  const { lang, t } = useLang();
  const [allProducts, setAllProducts] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [thumbOffset, setThumbOffset] = useState(0);
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    fetch('/products.json')
      .then(r => r.json())
      .then(data => setAllProducts(data))
      .catch(() => setAllProducts([]));
  }, []);

  const product = allProducts?.find(p => p.slug === slug) ?? null;

  // Load images whenever product changes (including null — guard inside)
  useEffect(() => {
    if (!product) return;
    const loadImages = async () => {
      // Main image from images array (first one)
      const mainImages = product.images?.length > 0 ? [product.images[0]] : [];
      const mainUrls = await Promise.all(mainImages.map(img => getProductImage(img)));

      // Color swatch images
      const colorImages = (product.attributes?.colors || [])
        .filter(c => c.image)
        .map(c => c.image.startsWith('http') ? c.image : `https://catalog.raznobyt.com/images/products/${c.image}`);

      setImageUrls([...mainUrls, ...colorImages]);
    };
    window.scrollTo(0, 0);
    loadImages();
  }, [product]);

  // All hooks done — now safe to return early
  if (allProducts === null) return null;
  if (!product) return <Navigate to="/catalog" replace />;

  const cat = categories.find(c => c.id === product.category);
  const related = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleSend = (e) => {
    e.preventDefault();
    if (phone.trim()) { setSent(true); setPhone(''); }
  };

  const THUMB_SIZE = 82; // width + gap
  const VISIBLE_THUMBS = 5;
  const maxOffset = Math.max(0, imageUrls.length - VISIBLE_THUMBS);

  const prevThumbs = () => setThumbOffset(o => Math.max(0, o - 1));
  const nextThumbs = () => setThumbOffset(o => Math.min(maxOffset, o + 1));

  const colors = product.attributes.colors || [];
  const colorName = (c) => typeof c === 'string' ? c : (lang === 'ru' ? (c.color_ru || c.color) : c.color);

  const attrs = [
    { label: t('product.composition'), value: formatComposition(product.attributes.composition, lang) },
    { label: t('product.density'), value: product.attributes.density },
    { label: t('product.width'), value: product.attributes.width },
    ...(colors.length > 0 ? [{
      label: t('product.color'), value: (
        <span className="color-thumbs-row">
          {colors.map((c, idx) => (
            c.image ? (
              <span key={idx} className="color-thumb-wrap" data-tooltip={colorName(c)}>
                <img
                  src={c.image.startsWith('http') ? c.image : `https://catalog.raznobyt.com/images/products/${c.image}`}
                  alt={colorName(c)}
                  className="color-thumb-img"
                  loading="lazy"
                />
              </span>
            ) : (
              <span key={idx} className="color-text-wrap" style={{ marginRight: '6px' }}>
                {colorName(c)}{idx < colors.length - 1 ? ',' : ''}
              </span>
            )
          ))}
        </span>
      )
    }] : []),
    { label: t('product.fabricType'), value: t(`fabricTypes.${product.attributes.fabricType}`) },
  ];

  return (
    <>
      <SEO
        title={product.title[lang]}
        description={product.description[lang] ? product.description[lang].slice(0, 160) : ""}
        keywords={`тканина, ${cat?.title[lang]}, ${t(`fabricTypes.${product.attributes.fabricType}`)}`}
      />

      <div className="product-page">
        <div className="container">

          <div className="product-header">
            <nav className="breadcrumbs fade-up fade-up-1">
              <Link to='/' className="breadcrumbs__link">{t('nav.home')}</Link>
              <span className="breadcrumbs__sep"> › </span>
              <Link to='/catalog' className="breadcrumbs__link">{t('catalog.title')}</Link>
              <span className="breadcrumbs__sep"> › </span>
              <Link to={`/catalog/${cat?.slug}/`} className="breadcrumbs__link">{cat?.title[lang]}</Link>
              <span className="breadcrumbs__sep"> › </span>
              <span className="breadcrumbs__current">{product.title[lang]}</span>
            </nav>
            <div className="hero__content fade-up fade-up-2 hero__content--mobile">
              <h1 className="">{product.title[lang]}</h1>
            </div>
          </div>

          <div className="product-grid">
            {/* Images */}
            <div className="product-images fade-up fade-up-1">
              {imageUrls.length > 0 ? (
                <img
                  src={imageUrls[activeImg]}
                  alt={product.title[lang]}
                  className="product-main-img"
                  onError={(e) => { e.target.src = placeholder; }}
                />
              ) : (
                <div className="product-main-img image-fallback">
                  <img src={placeholder} alt="Placeholder" className="image-fallback__inner" />
                </div>
              )}
              {imageUrls.length > 1 && (
                <div className="product-thumbs-slider">
                  {thumbOffset > 0 && (
                    <button className="thumbs-arrow thumbs-arrow--prev" onClick={prevThumbs} aria-label="Попередні">
                      ‹
                    </button>
                  )}
                  <div className="product-thumbs-viewport">
                    <div
                      className="product-thumbs"
                      style={{ transform: `translateX(-${thumbOffset * THUMB_SIZE}px)` }}
                    >
                      {imageUrls.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt=""
                          className={`product-thumb ${activeImg === i ? 'active' : ''}`}
                          onClick={() => setActiveImg(i)}
                          loading="lazy"
                          onError={(e) => { e.target.src = placeholder; }}
                        />
                      ))}
                    </div>
                  </div>
                  {thumbOffset < maxOffset && (
                    <button className="thumbs-arrow thumbs-arrow--next" onClick={nextThumbs} aria-label="Наступні">
                      ›
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="product-info">
              <div className="hero__content fade-up fade-up-2">
                <h1 className="">{product.title[lang]}</h1>
              </div>
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
                <img src={phoneIcon} alt="Phone" width="18" height="18" loading="lazy" />
                {lang === 'ua' ? 'Зателефонувати' : 'Позвонить'}
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