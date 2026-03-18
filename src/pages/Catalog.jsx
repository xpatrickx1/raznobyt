import { useState, useMemo } from 'react';
import { useLang } from '../i18n/LangContext';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import products from '../data/products.json';
import categories from '../data/categories.json';

const PAGE_SIZE = 8;

const FABRIC_TYPES = [...new Set(products.map(p => p.attributes.fabricType))];
const COLORS = [...new Set(products.map(p => p.attributes.color))];

const COLOR_MAP = {
  navy: '#1A3B6E', white: '#F0F0F0', khaki: '#7B7B4E', blue: '#2563EB',
  orange: '#EA6C1A', black: '#1A1A1A', gray: '#9CA3AF', green: '#2E7D5C',
  multicam: '#6B7A4A', yellow: '#FACC15', beige: '#C8B99A',
};

export default function Catalog({ initialCategory }) {
  const { lang, t } = useLang();
  const [search, setSearch] = useState('');
  const [selectedCats, setSelectedCats] = useState(initialCategory ? [initialCategory] : []);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [page, setPage] = useState(1);
  const [mobileFilters, setMobileFilters] = useState(false);

  const toggle = (arr, setArr, val) => {
    setArr(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
    setPage(1);
  };

  const filtered = useMemo(() => {
    return products.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !search ||
        p.title.ua.toLowerCase().includes(q) ||
        p.title.ru.toLowerCase().includes(q);
      const matchCat = selectedCats.length === 0 || selectedCats.includes(p.category);
      const matchType = selectedTypes.length === 0 || selectedTypes.includes(p.attributes.fabricType);
      const matchColor = selectedColors.length === 0 || selectedColors.includes(p.attributes.color);
      return matchSearch && matchCat && matchType && matchColor;
    });
  }, [search, selectedCats, selectedTypes, selectedColors]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  const clearAll = () => {
    setSearch('');
    setSelectedCats([]);
    setSelectedTypes([]);
    setSelectedColors([]);
    setPage(1);
  };
  const hasFilters = selectedCats.length + selectedTypes.length + selectedColors.length > 0 || search;

  const SidebarContent = () => (
    <aside className={`sidebar ${mobileFilters ? 'mobile-open' : ''}`}>
      <div className="sidebar__title">
        {t('catalog.filters')}
        {hasFilters && <button className="clear-btn" onClick={clearAll}>{t('catalog.clearFilters')}</button>}
      </div>

      {/* Search inside sidebar on mobile */}
      <div className="sidebar__section">
        <div className="sidebar__section-title">{t('catalog.category')}</div>
        {categories.map(cat => (
          <label key={cat.id} className={`filter-option ${selectedCats.includes(cat.id) ? 'active' : ''}`}>
            <input
              type="checkbox"
              checked={selectedCats.includes(cat.id)}
              onChange={() => toggle(selectedCats, setSelectedCats, cat.id)}
            />
            {cat.title[lang]}
          </label>
        ))}
      </div>

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
    </aside>
  );

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
        <div className="catalog-layout">
          <SidebarContent />

          <div>
            {/* Top Bar */}
            <div className="catalog-header">
              <div className="search-wrap" style={{ flex: 1, maxWidth: 380, margin: 0 }}>
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder={t('catalog.search')}
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
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
                {selectedCats.map(id => {
                  const cat = categories.find(c => c.id === id);
                  return (
                    <span key={id} className="attr-chip" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                      onClick={() => toggle(selectedCats, setSelectedCats, id)}>
                      {cat?.title[lang]} ✕
                    </span>
                  );
                })}
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
