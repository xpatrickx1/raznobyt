import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import categories from '../data/categories.json';
import placeholder from '../assets/images/placeholder.svg';
import { getProductImage, COLOR_MAP } from '../assets/utils/imageLoader.js';

export default function ProductCard({ product }) {
  const { lang, t } = useLang();
  const cat = categories.find(c => c.id === product.category);

  const [imageUrl, setImageUrl] = useState([]);
  const [productData, setProducts] = useState([]);

  useEffect(() => {
    const loadImage = async () => {
      const imageToLoad = product?.images[0] || [];
      const url = await getProductImage(imageToLoad);
      setImageUrl(url);
    };
    loadImage();
  }, [product]);

  // useEffect(() => {
  //   fetch('https://opensheet.elk.sh/13NoI2T3HhTNghuSdgfsYEC20DuHVNENtc11pEkPd0q4/products')
  //     .then(res => res.json())
  //     .then(data => {
  //       setProducts(data);
  //     });
  // }, []);

  // console.log(productData);

  return (
    <Link to={`/product/${product.slug}`} className="product-card fade-up">
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

        <div className="product-character" bis_skin_checked="1">
          <div bis_skin_checked="1">Ширина:</div>
          <div className="product-character-value" bis_skin_checked="1">150 см</div>
          <div bis_skin_checked="1">Щільність:</div>
          <div className="product-character-value" bis_skin_checked="1">270 г/м.кв</div>
          <div bis_skin_checked="1">Склад:</div>
          <div className="product-character-value" bis_skin_checked="1">Еластан 2%, Поліестер 58%, Віскоза 40%</div>
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
