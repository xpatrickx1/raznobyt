import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../i18n/LangContext';
import SEO from '../SEO/index';
import ProductCard from '../ProductCard';
import categories from '../../data/categories.json';
import { formatComposition } from '../../data/compositions.js';
import { getProductImage } from '../../assets/utils/imageLoader.js';
import placeholder from '../../assets/images/placeholder.svg';
import phoneIcon from '@/assets/images/icons/phone.svg';

export default function ProductView({ product, related = [] }) {
    const { lang, t } = useLang();
    const [activeImg, setActiveImg] = useState(0);
    const [phone, setPhone] = useState('');
    const [sent, setSent] = useState(false);
    const [imageUrls, setImageUrls] = useState([]);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const viewportRef = useRef(null);
    const thumbEls = useRef([]);

    useEffect(() => {
        const loadImages = async () => {
            const urls = (product.images?.length > 0 ? product.images : [])
                .map(img => getProductImage(img));
            setImageUrls(await Promise.all(urls));
        };
        window.scrollTo(0, 0);
        loadImages();
    }, [product]);

    const checkScroll = useCallback(() => {
        const v = viewportRef.current;
        if (!v) return;
        setCanScrollLeft(v.scrollLeft > 1);
        setCanScrollRight(v.scrollLeft < v.scrollWidth - v.clientWidth - 1);
    }, []);

    useEffect(() => {
        // Перевіряємо стрілки після завантаження зображень
        const timer = setTimeout(checkScroll, 50);
        return () => clearTimeout(timer);
    }, [imageUrls, checkScroll]);

    const cat = categories.find(c => c.id === product.category);

    const handleSend = (e) => {
        e.preventDefault();
        if (phone.trim()) { setSent(true); setPhone(''); }
    };

    const THUMB_STEP = 82;

    const scrollThumbIntoView = useCallback((idx) => {
        const v = viewportRef.current;
        const el = thumbEls.current[idx];
        if (!v || !el) return;
        const thumbLeft = el.offsetLeft;
        const thumbRight = thumbLeft + el.offsetWidth;
        const vLeft = v.scrollLeft;
        const vRight = vLeft + v.clientWidth;
        if (thumbLeft < vLeft) {
            v.scrollTo({ left: thumbLeft, behavior: 'smooth' });
        } else if (thumbRight > vRight) {
            v.scrollTo({ left: thumbRight - v.clientWidth, behavior: 'smooth' });
        }
        setTimeout(checkScroll, 320);
    }, [checkScroll]);

    const prevThumbs = () => {
        viewportRef.current?.scrollBy({ left: -THUMB_STEP, behavior: 'smooth' });
        setTimeout(checkScroll, 320);
    };
    const nextThumbs = () => {
        viewportRef.current?.scrollBy({ left: THUMB_STEP, behavior: 'smooth' });
        setTimeout(checkScroll, 320);
    };

    const handleColorClick = (colorImage) => {
        const idx = (product.images || []).indexOf(colorImage);
        if (idx === -1) return;
        setActiveImg(idx);
        scrollThumbIntoView(idx);
    };

    const colors = product.attributes.colors || [];
    const colorName = (c) => typeof c === 'string' ? c : (c.color ?? '');

    const fabricArticle = product.title[lang]
        ? product.title[lang].replace(/^(Тканина|Ткань)\s+/i, '')
        : '';

    const activeImagePath = (product.images || [])[activeImg] || '';
    const colorCode = activeImagePath
        ? activeImagePath.split('/').pop().replace(/\.[^.]+$/, '')
        : '';

    const densityVal = product.attributes.density
        ? (String(product.attributes.density).includes('г/м')
            ? String(product.attributes.density)
            : `${product.attributes.density} г/м.кв`)
        : '';

    const widthVal = product.attributes.width
        ? (String(product.attributes.width).includes('см')
            ? String(product.attributes.width)
            : `${product.attributes.width} см`)
        : '';

    const attrs = [
        ...(product.subcat ? [{ label: t('catalog.subcategory'), value: t(`subcategories.${product.subcat}`) || product.subcat }] : []),
        { label: t('product.composition'), value: formatComposition(product.attributes.composition, lang) },
        { label: t('product.density'), value: densityVal },
        { label: t('product.width'), value: widthVal },
        ...(colors.length > 0 ? [{
            label: t('product.color'), value: (
                <span className="color-thumbs-row">
                    {colors.map((c, idx) => (
                        c.image ? (
                            <span key={idx} className={`color-thumb-wrap${c.image === activeImagePath ? ' active' : ''}`} data-tooltip={colorName(c)}>
                                <img
                                    src={getProductImage(c.image)}
                                    alt={colorName(c)}
                                    className="color-thumb-img"
                                    loading="lazy"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleColorClick(c.image)}
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
                                    loading="lazy"
                                    onError={(e) => { e.target.src = placeholder; }}
                                />
                            ) : (
                                <div className="product-main-img image-fallback">
                                    <img src={placeholder} alt="Placeholder" className="image-fallback__inner" loading="lazy" />
                                </div>
                            )}
                            {imageUrls.length > 1 && (
                                <div className="product-thumbs-slider"
                                    style={{ gap: canScrollLeft ? '' : '0px' }}
                                >
                                    <button
                                        className="thumbs-arrow thumbs-arrow--prev"
                                        onClick={prevThumbs}
                                        aria-label="Попередні"
                                        style={{ visibility: canScrollLeft ? 'visible' : 'hidden', width: canScrollLeft ? '' : '0px' }}
                                    >
                                        ‹
                                    </button>
                                    <div className="product-thumbs-viewport" ref={viewportRef} onScroll={checkScroll}>
                                        <div className="product-thumbs">
                                            {imageUrls.map((img, i) => (
                                                <img
                                                    key={i}
                                                    ref={el => { thumbEls.current[i] = el; }}
                                                    src={img}
                                                    alt=""
                                                    className={`product-thumb ${activeImg === i ? 'active' : ''}`}
                                                    onClick={() => { setActiveImg(i); scrollThumbIntoView(i); }}
                                                    loading="lazy"
                                                    onError={(e) => { e.target.src = placeholder; }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        className="thumbs-arrow thumbs-arrow--next"
                                        onClick={nextThumbs}
                                        aria-label="Наступні"
                                        style={{ visibility: canScrollRight ? 'visible' : 'hidden' }}
                                    >
                                        ›
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="product-info">
                            <div className="hero__content fade-up fade-up-2">
                                <h1 className="">{product.title[lang]}</h1>
                            </div>
                            {fabricArticle && (
                                <p style={{ fontSize: 13, color: 'var(--c-text-muted)', marginBottom: 4 }}>
                                    {lang === 'ua' ? 'Артикул' : 'Артикул'}:{' '}
                                    <strong style={{ color: 'var(--c-text)', letterSpacing: '0.04em' }}>{fabricArticle}</strong>
                                </p>
                            )}
                            {colorCode && (
                                <p style={{ fontSize: 13, color: 'var(--c-text-muted)', marginBottom: 14 }}>
                                    {lang === 'ua' ? 'Колір' : 'Цвет'}:{' '}
                                    <strong style={{ color: 'var(--c-text)', letterSpacing: '0.04em' }}>{colorCode}</strong>
                                </p>
                            )}

                            <p style={{ fontSize: 12, color: 'var(--c-text-muted)', lineHeight: 1.6, margin: '16px 0' }}>
                                {lang === 'ua'
                                    ? 'Наявність та кількість уточнюйте у менеджера.'
                                    : 'Наличие и количество уточняйте у менеджера.'}
                            </p>

                            <p className="product-desc">{product.description[lang]}</p>


                            <h3 style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--c-text-muted)', marginBottom: 12 }}>
                                {t('product.characteristics')}
                            </h3>
                            <table className="product-attrs-table">
                                <tbody>
                                    {attrs.map((a, i) => (
                                        <tr key={i}>
                                            <th>{a.label}</th>
                                            <td>{a.value === 1 ? '' : a.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <p style={{ fontSize: 12, color: 'var(--c-text-muted)', lineHeight: 1.6, margin: '16px 0' }}>
                                {lang === 'ua'
                                    ? 'Будь ласка, зверніть увагу: відтінок тканини на екрані може відрізнятися від реального кольору через індивідуальні налаштування вашого монітора чи смартфона. Колір на фото є ознайомлювальним.'
                                    : 'Пожалуйста, обратите внимание: оттенок ткани на экране может отличаться от реального цвета из-за индивидуальных настроек вашего монитора или смартфона. Цвет на фото является ознакомительным.'}
                            </p>

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
