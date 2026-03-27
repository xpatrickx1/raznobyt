import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import categories from '../data/categories.json';
import logo from '@/assets/images/logo-footer.png';

export default function Footer() {
  const { lang, t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <img src={logo} alt="Різнобит" className="navbar__logo-img" />
            <div className="navbar__logo-text" style={{ color: '#fff', marginBottom: 12 }}>Голандські текстильні тредиції</div>
            <div className="footer__phones">
              <a href="tel:+380445070680">(044) 507-06-80</a>
              <a href="tel:+380445070681">(044) 507-06-81</a>
              <a href="tel:+380445070682">(044) 507-06-82</a>
              <a href="tel:+380445070684">(044) 507-06-84</a>
              <a href="tel:+380443320088">(044) 332-00-88</a>
            </div>
          </div>

          <div>
            <div className="footer__col-title">{t('footer.links')}</div>
            <ul className="footer__links">
              <li><Link to="/">{t('nav.home')}</Link></li>
              <li><Link to="/catalog">{t('nav.catalog')}</Link></li>
              <li><Link to="/contacts">{t('nav.contacts')}</Link></li>
              <li><Link to="/documents">{t('nav.documents')}</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer__col-title">{t('nav.catalog')}</div>
            <ul className="footer__links">
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link to={`/catalog/${cat.slug}/`}>{cat.title[lang]}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="footer__col-title">Контакти</div>
            <ul className="footer__links">
              <li><a href="mailto:raznooffice@ukr.net">raznooffice@ukr.net</a></li>
              <li><span>м. Київ, вул. Лугова, 9С</span></li>
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
