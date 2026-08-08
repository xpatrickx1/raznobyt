import { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import Image from './Image';
import logo from '@/assets/images/logo.png';
import phoneIcon from '@/assets/images/icons/phone.svg';
import categories from '../data/categories.json';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { lang, toggleLang, t } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setIsScrolled(currentScrollY > 1);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Ініціалізація при монтуванні
    setIsScrolled(window.scrollY > 1);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/catalog', label: t('nav.catalog') },
    { to: '/delivery', label: t('nav.delivery') },
    { to: '/about-us', label: t('nav.about') },
    { to: '/contacts', label: t('nav.contacts') },
  ];

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
        <div className="container">
          <div className="navbar__inner">
            <Link to="/" className="navbar__logo">
              <img src={logo} alt="Різнобит" className="navbar__logo-img" loading="lazy" />
              {/* <span className="navbar__logo-text">Голандські текстильні тредиції</span> */}
            </Link>

            <ul className="navbar__nav">
              {links.map(l => (
                <li key={l.to}>
                  <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) => isActive ? 'active' : ''}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="navbar__right">
              <a href="tel:+380445070680">(044) 507-06-80</a>
              <div className="navbar__actions">
                <div className="navbar__lang">
                  <button className={`lang-btn ${lang === 'ua' ? 'active' : ''}`} onClick={() => lang !== 'ua' && toggleLang()}>UA</button>
                  <button className={`lang-btn ${lang === 'ru' ? 'active' : ''}`} onClick={() => lang !== 'ru' && toggleLang()}>RU</button>
                </div>
                <button className="hamburger" onClick={() => setMobileOpen(true)} aria-label="Menu">
                  <span /><span /><span />
                </button>
              </div>
            </div>
          </div>

          {/* <div className="navbar__divider" /> */}


        </div>
        <div className="navbar__bottom">
          <div className="container">
            <div className="navbar__catalog-bar">
              <div className="catalog-dropdown-wrapper" ref={dropdownRef}>
                <button
                  className="catalog-dropdown-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span className="catalog-icon">☰</span>
                  {t('nav.catalog') || (lang === 'ua' ? 'Каталог' : 'Каталог')}
                </button>

                {dropdownOpen && (
                  <div className="catalog-dropdown">
                    {categories.map(c => (
                      <Link
                        key={c.id}
                        to={`/catalog/${c.slug}/`}
                        className="catalog-dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {c.icon && <Image src={c.icon} alt="" className="catalog-dropdown-item__icon" width="20" height="20" loading="lazy" />}
                        {lang === 'ua' ? c.title.ua : c.title.ru}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <SearchBar />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && <div className="mobile-menu__overlay" onClick={() => setMobileOpen(false)} />}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-menu__header">
          <Link to="/" className="navbar__logo" onClick={() => setMobileOpen(false)}>
            <img src={logo} alt="Різнобит" className="navbar__logo-img" style={{ maxWidth: 140 }} loading="lazy" />
          </Link>
          <button className="mobile-menu__close" onClick={() => setMobileOpen(false)}>✕</button>
        </div>

        {/* Mobile search */}
        {/* <form className="mobile-menu__search" onSubmit={(e) => { handleSearch(e); setMobileOpen(false); }}>
          <input
            type="text"
            placeholder={lang === 'ua' ? 'Я шукаю...' : 'Я ищу...'}
            className="mobile-menu__search-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="mobile-menu__search-btn">
            <img src={searchIcon} alt="Search" width="18" height="18" loading="lazy" />
          </button>
        </form> */}

        {/* Nav links */}
        <div className="mobile-menu__links">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}>{l.label}</Link>
          ))}
        </div>

        {/* Catalog categories */}
        {/* <div className="mobile-menu__section-title">{t('nav.catalog')}</div>
        <div className="mobile-menu__categories">
          {categories.map(c => (
            <Link
              key={c.id}
              to={`/catalog/${c.slug}/`}
              className="mobile-menu__cat-item"
              onClick={() => setMobileOpen(false)}
            >
              {c.icon && <Image src={c.icon} alt="" width="24" height="24" loading="lazy" />}
              {lang === 'ua' ? c.title.ua : c.title.ru}
            </Link>
          ))}
        </div> */}

        {/* Phone */}
        <a href="tel:+380445070680" className="mobile-menu__phone">
          <img src={phoneIcon} alt="Phone" width="18" height="18" loading="lazy" />
          (044) 507-06-80
        </a>

        {/* Lang switch */}
        <div className="mobile-menu__lang">
          <button className={`lang-btn ${lang === 'ua' ? 'active' : ''}`} onClick={() => { lang !== 'ua' && toggleLang(); setMobileOpen(false); }}>UA</button>
          <button className={`lang-btn ${lang === 'ru' ? 'active' : ''}`} onClick={() => { lang !== 'ru' && toggleLang(); setMobileOpen(false); }}>RU</button>
        </div>
      </div>
    </>
  );
}
