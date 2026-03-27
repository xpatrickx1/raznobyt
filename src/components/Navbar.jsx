import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import logo from '@/assets/images/logo.png';
import searchIcon from '@/assets/images/icons/search.svg';
import categories from '../data/categories.json';
import products from '../data/products.js';

export default function Navbar() {
  const { lang, toggleLang, t } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(prev => {
        if (!prev && window.scrollY > 80) return true;
        if (prev && window.scrollY < 30) return false;
        return prev;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setDropdownOpen(false);
      setShowResults(false);
    }
  };

  const filteredProducts = searchQuery.trim()
    ? products.filter(p =>
      p.title.ua.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.ru.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5)
    : [];

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/catalog', label: t('nav.catalog') },
    { to: '/about-us', label: t('nav.about') },
    { to: '/contacts', label: t('nav.contacts') },
  ];

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
        <div className="container">
          <div className="navbar__inner">
            <Link to="/" className="navbar__logo">
              <img src={logo} alt="Різнобит" className="navbar__logo-img" />
              <span className="navbar__logo-text">Голандські текстильні тредиції</span>
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

            <div className="navbar__actions">
              <button className={`lang-btn ${lang === 'ua' ? 'active' : ''}`} onClick={() => lang !== 'ua' && toggleLang()}>UA</button>
              <button className={`lang-btn ${lang === 'ru' ? 'active' : ''}`} onClick={() => lang !== 'ru' && toggleLang()}>RU</button>
              <button className="hamburger" onClick={() => setMobileOpen(true)} aria-label="Menu">
                <span /><span /><span />
              </button>
            </div>
          </div>

          <div className="navbar__divider" />

          <div className="navbar__catalog-bar">
            <div className="catalog-dropdown-wrapper" ref={dropdownRef}>
              <button
                className="btn btn-primary catalog-dropdown-btn"
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
                      {c.icon && <img src={c.icon} alt="" className="catalog-dropdown-item__icon" width="20" height="20" />}
                      {lang === 'ua' ? c.title.ua : c.title.ru}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="navbar__search-wrapper" ref={searchRef}>
              <form className="navbar__search-form" onSubmit={handleSearch}>
                <button type="submit" className="search-submit-btn">
                  <img src={searchIcon} alt="Search" width="20" height="20" style={{ display: 'block' }} />
                </button>
                <input
                  type="text"
                  placeholder={lang === 'ua' ? 'Я шукаю...' : 'Я ищу...'}
                  className="navbar__search-input"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => setShowResults(true)}
                />
              </form>

              {showResults && searchQuery.trim().length > 0 && (
                <div className="search-results">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(p => (
                      <Link
                        key={p.id}
                        to={`/product/${p.slug}`}
                        className="search-result-item"
                        onClick={() => {
                          setShowResults(false);
                          setSearchQuery('');
                        }}
                      >
                        <img src={p.images[0]} alt="" className="search-result-img" />
                        <div className="search-result-info">
                          <div className="search-result-title">{lang === 'ua' ? p.title.ua : p.title.ru}</div>
                          <div className="search-result-cat">
                            {categories.find(c => c.id === p.category)?.title[lang]}
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="search-result-empty">
                      {lang === 'ua' ? 'Нічого не знайдено' : 'Ничего не найдено'}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <button className="mobile-menu__close" onClick={() => setMobileOpen(false)}>✕</button>
        {links.map(l => (
          <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}>{l.label}</Link>
        ))}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button className={`lang-btn ${lang === 'ua' ? 'active' : ''}`} onClick={() => { lang !== 'ua' && toggleLang(); setMobileOpen(false); }}>UA</button>
          <button className={`lang-btn ${lang === 'ru' ? 'active' : ''}`} onClick={() => { lang !== 'ru' && toggleLang(); setMobileOpen(false); }}>RU</button>
        </div>
      </div>
    </>
  );
}
