import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
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
        <img
          src={product.images[0]}
          alt={product.title[lang]}
          className="product-card__img"
          loading="lazy"
        />
      </div>
      <div className="product-card__body">
        {cat && <div className="product-card__cat">{cat.title[lang]}</div>}
        <div className="product-card__title">{product.title[lang]}</div>
        <div className="product-card__attrs">
          <span className="attr-chip">
            <span
              className="color-dot"
              style={{ background: COLOR_MAP[product.attributes.color] || '#ccc' }}
            />
            {t(`colors.${product.attributes.color}`)}
          </span>
          <span className="attr-chip">{t(`fabricTypes.${product.attributes.fabricType}`)}</span>
          <span className="attr-chip">{product.attributes.density}</span>
        </div>
      </div>
    </Link>
  );
}
