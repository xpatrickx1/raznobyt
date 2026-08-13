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
          setIsScrolled(window.scrollY > 1);
          ticking = false;
        });
        ticking = true;
      }
    };

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
      {/* ===== TOP BAR ===== */}
      <div className="topbar">
        <div className="container">
          <div className="topbar__inner">
            <div className="topbar__left">
              <span className="status-dot" aria-hidden="true" />
              <span className="topbar__schedule">
                {lang === 'ua' ? 'Пн–Пт: 9:00–18:00' : 'Пн–Пт: 9:00–18:00'}
              </span>
            </div>

            <div className="topbar__right">
              <div className="navbar__lang topbar__lang">
                <button
                  className={`lang-btn ${lang === 'ua' ? 'active' : ''}`}
                  onClick={() => lang !== 'ua' && toggleLang()}
                  aria-label="Українська"
                >
                  UA
                </button>
                <button
                  className={`lang-btn ${lang === 'ru' ? 'active' : ''}`}
                  onClick={() => lang !== 'ru' && toggleLang()}
                  aria-label="Русский"
                >
                  RU
                </button>
              </div>

              <a href="tel:+380445070680" className="topbar__phone">
                <img src={phoneIcon} alt="" width="16" height="16" loading="lazy" />
                <span>(044) 507-06-80</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN NAVBAR ===== */}
      <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
        <div className="container">
          <div className="navbar__inner">
            <Link to="/" className="navbar__logo">
              <img src={logo} alt="Різнобит" className="navbar__logo-img" loading="lazy" />
            </Link>

            <ul className="navbar__nav">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) => (isActive ? 'active' : '')}
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="navbar__right">
              {/* CTA замість телефону */}
              <Link to="/contacts" className="navbar__cta">
                {lang === 'ua' ? 'Отримати прайс' : 'Получить прайс'}
              </Link>

              <div className="navbar__actions">
                <button
                  className="hamburger"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Menu"
                >
                  <span />
                  <span />
                  <span />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Catalog + Search bar */}
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
                    {categories.map((c) => (
                      <Link
                        key={c.id}
                        to={`/catalog/${c.slug}/`}
                        className="catalog-dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {c.icon && (
                          <Image
                            src={c.icon}
                            alt=""
                            className="catalog-dropdown-item__icon"
                            width="20"
                            height="20"
                            loading="lazy"
                          />
                        )}
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

      {/* ===== MOBILE MENU ===== */}
      {mobileOpen && (
        <div className="mobile-menu__overlay" onClick={() => setMobileOpen(false)} />
      )}

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-menu__header">
          <Link to="/" className="navbar__logo" onClick={() => setMobileOpen(false)}>
            <img
              src={logo}
              alt="Різнобит"
              className="navbar__logo-img"
              style={{ maxWidth: 140 }}
              loading="lazy"
            />
          </Link>
          <button className="mobile-menu__close" onClick={() => setMobileOpen(false)}>
            ✕
          </button>
        </div>

        <div className="mobile-menu__links">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA в мобільному меню */}
        <Link
          to="/contacts"
          className="mobile-menu__cta"
          onClick={() => setMobileOpen(false)}
        >
          {lang === 'ua' ? 'Отримати прайс' : 'Получить прайс'}
        </Link>

        <a href="tel:+380445070680" className="mobile-menu__phone">
          <img src={phoneIcon} alt="" width="18" height="18" loading="lazy" />
          (044) 507-06-80
        </a>

        <div className="mobile-menu__lang">
          <button
            className={`lang-btn ${lang === 'ua' ? 'active' : ''}`}
            onClick={() => {
              lang !== 'ua' && toggleLang();
              setMobileOpen(false);
            }}
          >
            UA
          </button>
          <button
            className={`lang-btn ${lang === 'ru' ? 'active' : ''}`}
            onClick={() => {
              lang !== 'ru' && toggleLang();
              setMobileOpen(false);
            }}
          >
            RU
          </button>
        </div>
      </div>
    </>
  );
}