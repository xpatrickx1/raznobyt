import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import categories from '../data/categories.json';
import placeholder from '../assets/images/placeholder.svg';
import { getProductImage } from '../assets/utils/imageLoader.js';
import { formatComposition, getCompositionParts } from '../data/compositions.js';
import SampleOrderModal from './SampleOrderModal';

export default function ProductCard({ product }) {
  const { lang, t } = useLang();
  const cat = categories.find(c => c.id === product.category);
  const catSlug = cat ? cat.slug : 'unknown';
  const [modalOpen, setModalOpen] = useState(false);

  const imageToLoad = product?.images?.[0]?.trim() || null;
  const imageUrl = imageToLoad ? getProductImage(imageToLoad) : null;

  const colors = product.attributes?.colors || [];
  const colorName = (c) => (typeof c === 'string' ? c : (c?.color ?? ''));

  // Показуємо максимум 6 мініатюр, решту — "+N"
  const MAX_VISIBLE = 6;
  const visibleColors = colors.slice(0, MAX_VISIBLE);
  const extraCount = colors.length - MAX_VISIBLE;

  const handleOrderClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setModalOpen(true);
  };

  return (
    <>
      <Link to={`/catalog/${catSlug}/${product.slug}/`} className="product-card fade-up">
        <div className="product-card__img-wrap">
          {product.images?.length > 0 ? (
            <img
              src={imageUrl}
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
                  {getCompositionParts(product.attributes.composition, lang).map((part, idx, arr) => (
                    <span
                      key={idx}
                      style={{
                        display: 'inline-block',
                        whiteSpace: 'nowrap',
                        marginRight: idx < arr.length - 1 ? '4px' : '0',
                      }}
                    >
                      {part}{idx < arr.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="product-card__body">
          <div className="product-card__title">{product.title[lang]}</div>

          <div className="product-card__attrs">
            {/* Кольори — як у ProductView */}
            {colors.length > 0 && (
              <div className="product-card__attr-row product-card__colors">
                <span className="color-thumbs-row color-thumbs-row--card">
                  {visibleColors.map((c, idx) =>
                    c.image ? (
                      <span
                        key={idx}
                        className="color-thumb-wrap color-thumb-wrap--card"
                        title={colorName(c)}
                      >
                        <img
                          src={getProductImage(c.image)}
                          alt={colorName(c)}
                          className="color-thumb-img"
                          loading="lazy"
                          onError={(e) => { e.target.src = placeholder; }}
                        />
                      </span>
                    ) : (
                      <span key={idx} className="color-text-wrap" title={colorName(c)}>
                        {colorName(c)}
                        {idx < visibleColors.length - 1 ? ',' : ''}
                      </span>
                    )
                  )}
                  {extraCount > 0 && (
                    <span className="color-extra">+{extraCount}</span>
                  )}
                </span>
              </div>
            )}

            {product.attributes.density && (
              <>
                {colors.length > 0 && <div className="product-card__attr-divider" />}
                <div className="product-card__attr-row">
                  <span className="attr-text">{product.attributes.density}</span>
                </div>
              </>
            )}
          </div>

          <button
            className="product-card__sample-btn"
            onClick={handleOrderClick}
            type="button"
          >
            {t('common.orderSample')}
          </button>
        </div>
      </Link>

      {modalOpen && createPortal(
        <SampleOrderModal product={product} onClose={() => setModalOpen(false)} />,
        document.body
      )}
    </>
  );
}