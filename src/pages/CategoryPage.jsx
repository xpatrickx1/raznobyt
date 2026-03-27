import { useState, useMemo } from 'react';
import { useParams, Navigate, Link, useLocation } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import { productsByCategory } from '../data/products.js';
import categories from '../data/categories.json';
// import searchIcon from '@/assets/images/icons/search.svg';

const PAGE_SIZE = 8;

const COLOR_MAP = {
  navy: '#1A3B6E', white: '#F0F0F0', khaki: '#7B7B4E', blue: '#2563EB',
  orange: '#EA6C1A', black: '#1A1A1A', gray: '#9CA3AF', green: '#2E7D5C',
  multicam: '#6B7A4A', yellow: '#FACC15', beige: '#C8B99A',
};

export default function CategoryPage() {
  const { slug } = useParams();
  const location = useLocation();
  const { lang, t } = useLang();

  if (!location.pathname.endsWith('/')) {
    return <Navigate to={`/catalog/${slug}/`} replace />;
  }

  const cat = categories.find(c => c.slug === slug);
  if (!cat) return <Navigate to="/catalog" replace />;

  const categoryProducts = productsByCategory[cat.id] || [];

  const FABRIC_TYPES = [...new Set(categoryProducts.map(p => p.attributes.fabricType))];
  const COLORS = [...new Set(categoryProducts.map(p => p.attributes.color))];
  const DENSITIES = [...new Set(categoryProducts.map(p => p.attributes.density))].sort((a, b) => parseInt(a) - parseInt(b));
  const WIDTHS = [...new Set(categoryProducts.map(p => p.attributes.width))];
  const COMPOSITIONS = [...new Set(categoryProducts.map(p => p.attributes.composition))];

  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedDensities, setSelectedDensities] = useState([]);
  const [selectedWidths, setSelectedWidths] = useState([]);
  const [selectedCompositions, setSelectedCompositions] = useState([]);
  const [page, setPage] = useState(1);
  const [mobileFilters, setMobileFilters] = useState(false);

  const toggle = (arr, setArr, val) => {
    setArr(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
    setPage(1);
  };

  const filtered = useMemo(() => {
    return categoryProducts.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !search ||
        p.title.ua.toLowerCase().includes(q) ||
        p.title.ru.toLowerCase().includes(q);
      const matchType = selectedTypes.length === 0 || selectedTypes.includes(p.attributes.fabricType);
      const matchColor = selectedColors.length === 0 || selectedColors.includes(p.attributes.color);
      const matchDensity = selectedDensities.length === 0 || selectedDensities.includes(p.attributes.density);
      const matchWidth = selectedWidths.length === 0 || selectedWidths.includes(p.attributes.width);
      const matchComposition = selectedCompositions.length === 0 || selectedCompositions.includes(p.attributes.composition);
      return matchSearch && matchType && matchColor && matchDensity && matchWidth && matchComposition;
    });
  }, [search, selectedTypes, selectedColors, selectedDensities, selectedWidths, selectedCompositions, categoryProducts]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  const clearAll = () => {
    setSearch('');
    setSelectedTypes([]);
    setSelectedColors([]);
    setSelectedDensities([]);
    setSelectedWidths([]);
    setSelectedCompositions([]);
    setPage(1);
  };
  const hasFilters = selectedTypes.length + selectedColors.length + selectedDensities.length + selectedWidths.length + selectedCompositions.length > 0 || search;

  const SidebarContent = () => (
    <aside className={`sidebar ${mobileFilters ? 'mobile-open' : ''}`}>
      <div className="sidebar__title">
        {t('catalog.filters')}
        {hasFilters && <button className="clear-btn" onClick={clearAll}>{t('catalog.clearFilters')}</button>}
      </div>

      {FABRIC_TYPES.length > 1 && (
        <div className="sidebar__section">
          <div className="sidebar__section-title">{t('catalog.fabricType')}</div>
          {FABRIC_TYPES.map(ft => (
            <label key={ft} className={`filter-option ${selectedTypes.includes(ft) ? 'active' : ''}`}>
              <input
                type="checkbox"
                checked={selectedTypes.includes(ft)}
                onChange={() => toggle(selectedTypes, setSelectedTypes, ft)}
              />
              {t(`fabricTypes.${ft}`)}
            </label>
          ))}
        </div>
      )}

      {COLORS.length > 1 && (
        <div className="sidebar__section">
          <div className="sidebar__section-title">{t('catalog.color')}</div>
          {COLORS.map(c => (
            <label key={c} className={`filter-option ${selectedColors.includes(c) ? 'active' : ''}`}>
              <input
                type="checkbox"
                checked={selectedColors.includes(c)}
                onChange={() => toggle(selectedColors, setSelectedColors, c)}
              />
              <span className="color-swatch" style={{ background: COLOR_MAP[c] || '#ccc' }} />
              {t(`colors.${c}`)}
            </label>
          ))}
        </div>
      )}

      {DENSITIES.length > 1 && (
        <div className="sidebar__section">
          <div className="sidebar__section-title">{lang === 'ua' ? 'Щільність' : 'Плотность'}</div>
          {DENSITIES.map(d => (
            <label key={d} className={`filter-option ${selectedDensities.includes(d) ? 'active' : ''}`}>
              <input
                type="checkbox"
                checked={selectedDensities.includes(d)}
                onChange={() => toggle(selectedDensities, setSelectedDensities, d)}
              />
              {d}
            </label>
          ))}
        </div>
      )}

      {COMPOSITIONS.length > 1 && (
        <div className="sidebar__section">
          <div className="sidebar__section-title">{lang === 'ua' ? 'Склад' : 'Состав'}</div>
          {COMPOSITIONS.map(c => (
            <label key={c} className={`filter-option ${selectedCompositions.includes(c) ? 'active' : ''}`}>
              <input
                type="checkbox"
                checked={selectedCompositions.includes(c)}
                onChange={() => toggle(selectedCompositions, setSelectedCompositions, c)}
              />
              {c}
            </label>
          ))}
        </div>
      )}

      {WIDTHS.length > 1 && (
        <div className="sidebar__section">
          <div className="sidebar__section-title">{lang === 'ua' ? 'Ширина' : 'Ширина'}</div>
          {WIDTHS.map(w => (
            <label key={w} className={`filter-option ${selectedWidths.includes(w) ? 'active' : ''}`}>
              <input
                type="checkbox"
                checked={selectedWidths.includes(w)}
                onChange={() => toggle(selectedWidths, setSelectedWidths, w)}
              />
              {w}
            </label>
          ))}
        </div>
      )}
    </aside>
  );

  return (
    <>
      <SEO title={`${cat.title[lang]} — ${t('catalog.title')}`} description={cat.description[lang]} />

      <div className="page-header">
        <div className="container">
          <div className="page-header__content">
            <nav className="breadcrumbs">
              <Link to="/catalog" className="breadcrumbs__link">{t('catalog.title')}</Link>
              <span className="breadcrumbs__sep">→</span>
              <span className="breadcrumbs__current">{cat.title[lang]}</span>
            </nav>
            <h1>{cat.title[lang]}</h1>
            <p>{cat.description[lang]}</p>
          </div>
        </div>
      </div>

      <div className="container section-sm">
        <div className="catalog-layout">
          <SidebarContent />

          <div>
            {/* Top Bar */}
            <div className="catalog-header">
              {/* <div className="search-wrapper">
                <button type="submit" className="search-submit-btn">
                  <img src={searchIcon} alt="Search" width="20" height="20" style={{ display: 'block' }} />
                </button>
                <input
                  type="text"
                  className="search-input"
                  placeholder={t('catalog.search')}
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
              </div> */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <button
                  className="filter-toggle-btn"
                  onClick={() => setMobileFilters(!mobileFilters)}
                >
                  ☰ {t('catalog.filters')}
                </button>
                <span className="catalog-count">
                  {t('catalog.showing')} {visible.length} {t('catalog.of')} {filtered.length} {t('catalog.products')}
                </span>
              </div>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {selectedTypes.map(ft => (
                  <span key={ft} className="attr-chip" style={{ cursor: 'pointer' }}
                    onClick={() => toggle(selectedTypes, setSelectedTypes, ft)}>
                    {t(`fabricTypes.${ft}`)} ✕
                  </span>
                ))}
                {selectedColors.map(c => (
                  <span key={c} className="attr-chip" style={{ cursor: 'pointer' }}
                    onClick={() => toggle(selectedColors, setSelectedColors, c)}>
                    <span className="color-swatch" style={{ background: COLOR_MAP[c], width: 10, height: 10 }} />
                    {t(`colors.${c}`)} ✕
                  </span>
                ))}
                {selectedDensities.map(d => (
                  <span key={d} className="attr-chip" style={{ cursor: 'pointer' }}
                    onClick={() => toggle(selectedDensities, setSelectedDensities, d)}>
                    {d} ✕
                  </span>
                ))}
                {selectedCompositions.map(c => (
                  <span key={c} className="attr-chip" style={{ cursor: 'pointer' }}
                    onClick={() => toggle(selectedCompositions, setSelectedCompositions, c)}>
                    {c} ✕
                  </span>
                ))}
                {selectedWidths.map(w => (
                  <span key={w} className="attr-chip" style={{ cursor: 'pointer' }}
                    onClick={() => toggle(selectedWidths, setSelectedWidths, w)}>
                    {w} ✕
                  </span>
                ))}
              </div>
            )}

            {/* Products */}
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">🔎</div>
                <h3>{t('catalog.noResults')}</h3>
                <button className="btn btn-accent" onClick={clearAll} style={{ marginTop: 16 }}>
                  {t('catalog.clearFilters')}
                </button>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {visible.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
                {hasMore && (
                  <div className="load-more-wrap">
                    <button className="btn btn-accent" onClick={() => setPage(p => p + 1)}>
                      {t('catalog.loadMore')} ({filtered.length - visible.length})
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
