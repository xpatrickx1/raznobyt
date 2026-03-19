import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import logo from '@/assets/images/logo.png';

export default function Navbar() {
  const { lang, toggleLang, t } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/catalog', label: t('nav.catalog') },
    { to: '/contacts', label: t('nav.contacts') },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="navbar__inner">
            <Link to="/" className="navbar__logo">
              <img src={logo} alt="Різнобит" className="navbar__logo-img" />
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
