import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import SEO from '../components/SEO';
import categories from '../data/categories.json';
import products from '../data/products.js';

export default function Catalog() {
  const { lang, t } = useLang();

  const getCategoryProductCount = (catId) =>
    products.filter(p => p.category === catId).length;

  return (
    <>
      <SEO title={t('catalog.title')} description="Каталог тканин для спецодягу, медичного одягу, армії та інших потреб." />

      <div className="page-header">
        <div className="container">
          <div className="page-header__content">
            <div className="page-header__eyebrow">Текстиль</div>
            <h1>{t('catalog.title')}</h1>
            <p>{lang === 'ua' ? 'Весь асортимент в одному місці' : 'Весь ассортимент в одном месте'}</p>
          </div>
        </div>
      </div>

      <div className="container section-sm">
        <div className="catalog-categories-grid">
          {categories.map(cat => {
            const count = getCategoryProductCount(cat.id);
            return (
              <Link
                key={cat.id}
                to={`/catalog/${cat.slug}/`}
                className="category-card"
              >
                <div className="category-card__image-wrap">
                  <img
                    src={cat.image}
                    alt={cat.title[lang]}
                    className="category-card__image"
                    loading="lazy"
                  />
                  <div className="category-card__overlay" />
                </div>
                <div className="category-card__body">
                  {cat.icon && (
                    <img
                      src={cat.icon}
                      alt=""
                      className="category-card__icon"
                      width="32"
                      height="32"
                    />
                  )}
                  <h3 className="category-card__title">{cat.title[lang]}</h3>
                  <p className="category-card__desc">{cat.description[lang]}</p>
                  <span className="category-card__count">
                    {count} {lang === 'ua' ? (count === 1 ? 'товар' : count < 5 ? 'товари' : 'товарів') : (count === 1 ? 'товар' : count < 5 ? 'товара' : 'товаров')}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
