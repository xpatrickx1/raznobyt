import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import categories from '../data/categories.json';

export default function Footer() {
  const { lang, t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__logo-text">Різнобит</div>
            <div className="footer__logo-sub">Textile Group</div>
            <p className="footer__desc">{t('footer.desc')}</p>
            <div className="footer__phones">
              <a href="tel:+380445070680">(044) 507-06-80</a>
              <a href="tel:+380673320088">(067) 332-00-88</a>
              <a href="tel:+380987103517">(098) 710-35-17</a>
            </div>
          </div>

          <div>
            <div className="footer__col-title">{t('footer.links')}</div>
            <ul className="footer__links">
              <li><Link to="/">{t('nav.home')}</Link></li>
              <li><Link to="/catalog">{t('nav.catalog')}</Link></li>
              <li><Link to="/contacts">{t('nav.contacts')}</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer__col-title">{t('nav.catalog')}</div>
            <ul className="footer__links">
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.slug}`}>{cat.title[lang]}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="footer__col-title">Контакти</div>
            <ul className="footer__links">
              <li><a href="mailto:info@raznobyt.com">info@raznobyt.com</a></li>
              <li><span>м. Київ, вул. Текстильна, 12</span></li>
              <li><span>Пн–Пт: 9:00–18:00</span></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} Різнобит Textile Group. {t('footer.rights')}.</span>
          <span>🇺🇦</span>
        </div>
      </div>
    </footer>
  );
}
