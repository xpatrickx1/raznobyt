import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import Image from './Image';
import categories from '../data/categories.json';

const COLOR_MAP = {
  navy: '#1A3B6E', white: '#F5F5F5', khaki: '#7B7B4E', blue: '#2563EB',
  orange: '#EA6C1A', black: '#1A1A1A', gray: '#9CA3AF', green: '#2E7D5C',
  multicam: '#6B7A4A', yellow: '#FACC15', beige: '#C8B99A',
};

export default function ProductCard({ product }) {
  const { lang, t } = useLang();
  const cat = categories.find(c => c.id === product.category);

  return (
    <Link to={`/product/${product.id}`} className="product-card fade-up">
      <div className="product-card__img-wrap">
        <Image
          src={product.images[0]}
          alt={product.title[lang]}
          className="product-card__img"
          loading="lazy"
        />
        <div className="product-card__overlay">
          <span className="product-card__view-btn">{t('common.viewDetails') || 'View Details'}</span>
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
            <span
              className="color-dot"
              style={{ background: COLOR_MAP[product.attributes.color] || '#ccc' }}
            />
            <span className="attr-text">{t(`colors.${product.attributes.color}`)}</span>
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
