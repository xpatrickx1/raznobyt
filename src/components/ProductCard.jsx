import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import categories from '../data/categories.json';
import placeholder from '../assets/images/placeholder.svg';
import { getProductImage, COLOR_MAP } from '../assets/utils/imageLoader.js';
import { formatComposition } from '../data/compositions.js';

export default function ProductCard({ product }) {
  const { lang, t } = useLang();
  const cat = categories.find(c => c.id === product.category);

  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      const imageToLoad = product?.images?.[0]?.trim() || null;
      if (!imageToLoad) return;
      const url = await getProductImage(imageToLoad);
      console.log('url', url);
      setImageUrl(url);
    };
    loadImage();
  }, [product]);


  return (
    <Link to={`/product/${product.slug}/`} className="product-card fade-up">
      <div className="product-card__img-wrap">
        {product.images.length > 0 ? (
          <img
            src={imageUrl}
            alt={product.title[lang]}
            className="product-main-img"
            onError={(e) => { e.target.src = placeholder; }}
          />
        ) : (
          <div className="product-main-img image-fallback">
            <img src={placeholder} alt="Placeholder" className="image-fallback__inner" />
          </div>
        )}
        <div className="product-card__overlay">
          <span className="product-card__view-btn">{t('common.viewDetails') || 'View Details'}</span>
        </div>

        <div className="product-character">
          {product.attributes.width && (
            <div className="product-character-row">
              <div className="product-character-label">Ширина:</div>
              <div className="product-character-value">{product.attributes.width} см</div>
            </div>
          )}
          {product.attributes.density && (
            <div className="product-character-row">
              <div className="product-character-label">Щільність:</div>
              <div className="product-character-value">{product.attributes.density} г/м.кв</div>
            </div>
          )}
          {product.attributes.composition && formatComposition(product.attributes.composition, lang) && (
            <div className="product-character-row">
              <div className="product-character-label">Склад:</div>
              <div className="product-character-value">
                {formatComposition(product.attributes.composition, lang)}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="product-card__body">
        <div className="product-card__header">
          {cat && <span className="product-card__cat">{cat.title[lang]}</span>}
          {product.isNew && <span className="product-card__badge-new">NEW</span>}
        </div>
        <div className="product-card__title">{product.title[lang]}</div>
        <div className="product-card__attrs">
          <div className="product-card__attr-row">
            {Array.isArray(product.attributes.color) ? (
              <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
                {product.attributes.color.map(c => (
                  <span
                    key={c}
                    className="color-dot"
                    title={t(`colors.${c}`)}
                    style={{ background: COLOR_MAP[c] || '#ccc' }}
                  />
                ))}
              </span>
            ) : (
              <span
                className="color-dot"
                style={{ background: COLOR_MAP[product.attributes.color] || '#ccc' }}
              />
            )}
            {/* <span className="attr-text">
              {Array.isArray(product.attributes.color)
                ? product.attributes.color.map(c => t(`colors.${c}`)).join(', ')
                : t(`colors.${product.attributes.color}`)}
            </span> */}
          </div>
          <div className="product-card__attr-divider"></div>
          <div className="product-card__attr-row">
            <span className="attr-text">{t(`fabricTypes.${product.attributes.fabricType}`)}</span>
          </div>
          <div className="product-card__attr-divider"></div>
          <div className="product-card__attr-row">
            <span className="attr-text">{product.attributes.density}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
