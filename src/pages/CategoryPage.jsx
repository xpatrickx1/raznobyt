import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Navigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import { productsByCategory } from '../data/products.js';
import categories from '../data/categories.json';
// import searchIcon from '@/assets/images/icons/search.svg';
import HeroSection from '../components/HeroSection';
import { COMPOSITION_OPTIONS } from '../data/compositions.js';


const PAGE_SIZE = 9;

const COLOR_MAP = {
  navy: '#1A3B6E', white: '#F0F0F0', khaki: '#7B7B4E', blue: '#2563EB',
  orange: '#EA6C1A', black: '#1A1A1A', gray: '#9CA3AF', green: '#2E7D5C',
  multicam: '#6B7A4A', yellow: '#FACC15', beige: '#C8B99A', brown: '#5D4037',
};



const SidebarContent = ({
  mobileFilters,
  t,
  hasFilters,
  clearAll,
  FABRIC_TYPES,
  toggleSection,
  expandedSections,
  selectedTypes,
  toggle,
  COLORS,
  selectedColors,
  COLOR_MAP,
  DENSITIES,
  selectedDensities,
  lang,
  COMPOSITIONS,
  selectedCompositions,
  WIDTHS,
  selectedWidths,
  setSelectedTypes,
  setSelectedColors,
  setSelectedDensities,
  setSelectedCompositions,
  setSelectedWidths
}) => (
  <aside className={`sidebar ${mobileFilters ? 'mobile-open' : ''}`}>
    <div className="sidebar__title">
      {t('catalog.filters')}
      {hasFilters && <button className="clear-btn" onClick={clearAll}>{t('catalog.clearFilters')}</button>}
    </div>

    {/* {FABRIC_TYPES.length > 1 && ( */}
    <div className="sidebar__section">
      <div
        className="sidebar__section-title collapsible-header"
        onClick={() => toggleSection('type')}
      >
        {t('catalog.fabricType')}
        <span className={`chevron ${expandedSections.includes('type') ? 'open' : ''}`}>›</span>
      </div>
      <div className={`sidebar__section-content ${expandedSections.includes('type') ? 'is-expanded' : ''}`}>
        <div className="sidebar__section-inner">
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
      </div>
    </div>
    {/* )} */}

    {COLORS.length > 1 && (
      <div className="sidebar__section">
        <div
          className="sidebar__section-title collapsible-header"
          onClick={() => toggleSection('color')}
        >
          {t('catalog.color')}
          <span className={`chevron ${expandedSections.includes('color') ? 'open' : ''}`}>›</span>
        </div>
        <div className={`sidebar__section-content ${expandedSections.includes('color') ? 'is-expanded' : ''}`}>
          <div className="sidebar__section-inner">
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
        </div>
      </div>
    )}

    {DENSITIES.length > 1 && (
      <div className="sidebar__section">
        <div
          className="sidebar__section-title collapsible-header"
          onClick={() => toggleSection('density')}
        >
          {lang === 'ua' ? 'Щільність (г/м²)' : 'Плотность (г/м²)'}
          <span className={`chevron ${expandedSections.includes('density') ? 'open' : ''}`}>›</span>
        </div>
        <div className={`sidebar__section-content ${expandedSections.includes('density') ? 'is-expanded' : ''}`}>
          <div className="sidebar__section-inner">
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
        </div>
      </div>
    )}

    {COMPOSITIONS.length > 1 && (
      <div className="sidebar__section">
        <div
          className="sidebar__section-title collapsible-header"
          onClick={() => toggleSection('composition')}
        >
          {lang === 'ua' ? 'Склад' : 'Состав'}
          <span className={`chevron ${expandedSections.includes('composition') ? 'open' : ''}`}>›</span>
        </div>
        <div className={`sidebar__section-content ${expandedSections.includes('composition') ? 'is-expanded' : ''}`}>
          <div className="sidebar__section-inner">
            {COMPOSITIONS.map(c => {
              const opt = COMPOSITION_OPTIONS.find(o => o.id === c);
              const labelText = opt ? (lang === 'ua' ? opt.label : opt.labelRu) : c;
              return (
                <label key={c} className={`filter-option ${selectedCompositions.includes(c) ? 'active' : ''}`}>
                  <input
                    type="checkbox"
                    checked={selectedCompositions.includes(c)}
                    onChange={() => toggle(selectedCompositions, setSelectedCompositions, c)}
                  />
                  {labelText}
                </label>
              );
            })}
          </div>
        </div>
      </div>
    )}

    {WIDTHS.length > 1 && (
      <div className="sidebar__section">
        <div
          className="sidebar__section-title collapsible-header"
          onClick={() => toggleSection('width')}
        >
          {lang === 'ua' ? 'Ширина' : 'Ширина'}
          <span className={`chevron ${expandedSections.includes('width') ? 'open' : ''}`}>›</span>
        </div>
        <div className={`sidebar__section-content ${expandedSections.includes('width') ? 'is-expanded' : ''}`}>
          <div className="sidebar__section-inner">
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
        </div>
      </div>
    )}
  </aside>
);

export default function CategoryPage() {
  const { slug } = useParams();
  const location = useLocation();
  const { lang, t } = useLang();

  const targetRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const getArrayParam = (key) => {
    const val = searchParams.get(key);
    return val ? val.split(',') : [];
  };

  const search = searchParams.get('q') || '';
  const selectedTypes = getArrayParam('types');
  const selectedColors = getArrayParam('colors');
  const selectedDensities = getArrayParam('densities');
  const selectedWidths = getArrayParam('widths');
  const selectedCompositions = getArrayParam('compositions');
  const pageStr = searchParams.get('page');
  const page = pageStr ? parseInt(pageStr, 10) : 1;

  const updateParams = (updates) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
          next.delete(key);
        } else if (Array.isArray(value)) {
          next.set(key, value.join(','));
        } else {
          next.set(key, String(value));
        }
      });
      return next;
    }, { replace: true });
  };

  const setSearch = (val) => updateParams({ q: val, page: undefined });
  const setPage = (val) => updateParams({ page: typeof val === 'function' ? val(page) : val });
  const setSelectedTypes = (arr) => updateParams({ types: arr, page: undefined });
  const setSelectedColors = (arr) => updateParams({ colors: arr, page: undefined });
  const setSelectedDensities = (arr) => updateParams({ densities: arr, page: undefined });
  const setSelectedWidths = (arr) => updateParams({ widths: arr, page: undefined });
  const setSelectedCompositions = (arr) => updateParams({ compositions: arr, page: undefined });

  const [mobileFilters, setMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState(['type', 'color', 'width']);

  const cat = categories.find(c => c.slug === slug);
  const categoryProducts = cat ? (productsByCategory[cat.id] || []) : [];

  const FABRIC_TYPES = useMemo(() => [...new Set(categoryProducts.map(p => p.attributes.fabricType))], [categoryProducts]);
  const COLORS = useMemo(() => {
    const cols = new Set();
    categoryProducts.forEach(p => {
      if (Array.isArray(p.attributes.color)) {
        p.attributes.color.forEach(c => cols.add(c));
      } else if (p.attributes.color) {
        cols.add(p.attributes.color);
      }
    });
    return [...cols];
  }, [categoryProducts]);
  const DENSITIES = useMemo(() => [...new Set(categoryProducts.map(p => p.attributes.density))].sort((a, b) => parseInt(a) - parseInt(b)), [categoryProducts]);
  const WIDTHS = useMemo(() => [...new Set(categoryProducts.map(p => p.attributes.width))], [categoryProducts]);
  const COMPOSITIONS = useMemo(() => {
    const comps = new Set();
    categoryProducts.forEach(p => {
      const comp = p.attributes?.composition;
      if (!comp) return;
      if (typeof comp === 'object') {
        Object.keys(comp).forEach(k => comps.add(k));
      } else {
        comps.add(comp);
      }
    });
    return [...comps];
  }, [categoryProducts]);

  const toggleSection = (section) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const toggle = (arr, setArr, val) => {
    const nextArr = arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
    setArr(nextArr);
  };

  const filtered = useMemo(() => {
    if (!cat) return [];
    return categoryProducts.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !search ||
        p.title.ua.toLowerCase().includes(q) ||
        p.title.ru.toLowerCase().includes(q);
      const matchType = selectedTypes.length === 0 || selectedTypes.includes(p.attributes.fabricType);
      const matchColor = selectedColors.length === 0 ||
        (Array.isArray(p.attributes.color)
          ? p.attributes.color.some(c => selectedColors.includes(c))
          : selectedColors.includes(p.attributes.color));
      const matchDensity = selectedDensities.length === 0 || selectedDensities.includes(p.attributes.density);
      const matchWidth = selectedWidths.length === 0 || selectedWidths.includes(p.attributes.width);
      const matchComposition = selectedCompositions.length === 0 || selectedCompositions.some(c => {
        const comp = p.attributes.composition;
        if (!comp) return false;
        if (typeof comp === 'object') return c in comp;
        return comp === c;
      });
      return matchSearch && matchType && matchColor && matchDensity && matchWidth && matchComposition;
    });
  }, [search, selectedTypes, selectedColors, selectedDensities, selectedWidths, selectedCompositions, categoryProducts, cat]);

  // Early returns AFTER all hooks
  const expectedPath = `/catalog/${slug}/`;
  if (location.pathname !== expectedPath && location.pathname === `/catalog/${slug}`) {
    return <Navigate to={expectedPath} replace />;
  }

  if (!cat) return <Navigate to="/catalog" replace />;

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  const clearAll = () => {
    updateParams({
      q: undefined,
      types: undefined,
      colors: undefined,
      densities: undefined,
      widths: undefined,
      compositions: undefined,
      page: undefined
    });
  };
  const hasFilters = selectedTypes.length + selectedColors.length + selectedDensities.length + selectedWidths.length + selectedCompositions.length > 0 || search;

  const scrollToBlock = () => {
    // Scrolls smoothly to the element referenced by targetRef
    targetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const prevSearch = useRef(location.search);

  useEffect(() => {
    if (prevSearch.current !== location.search) {
      scrollToBlock();
      prevSearch.current = location.search;
    }
  }, [location.search]);

  return (
    <>
      <SEO title={`${cat.title[lang]} — ${t('catalog.title')}`} description={cat.description[lang]} />

      <HeroSection
        title={cat.title[lang]}
        breadcrumbs={[
          { label: t('nav.home'), path: '/' },
          { label: t('catalog.title'), path: '/catalog' },
          { label: cat.title[lang] }
        ]}
        className="category"
      />

      <div ref={targetRef} className="container section-sm">
        <div className="catalog-layout">
          <SidebarContent
            mobileFilters={mobileFilters}
            t={t}
            hasFilters={hasFilters}
            clearAll={clearAll}
            FABRIC_TYPES={FABRIC_TYPES}
            toggleSection={toggleSection}
            expandedSections={expandedSections}
            selectedTypes={selectedTypes}
            toggle={toggle}
            COLORS={COLORS}
            selectedColors={selectedColors}
            COLOR_MAP={COLOR_MAP}
            DENSITIES={DENSITIES}
            selectedDensities={selectedDensities}
            lang={lang}
            COMPOSITIONS={COMPOSITIONS}
            selectedCompositions={selectedCompositions}
            WIDTHS={WIDTHS}
            selectedWidths={selectedWidths}
            setSelectedTypes={setSelectedTypes}
            setSelectedColors={setSelectedColors}
            setSelectedDensities={setSelectedDensities}
            setSelectedCompositions={setSelectedCompositions}
            setSelectedWidths={setSelectedWidths}
          />

          <div>
            {/* Top Bar */}
            <div className="catalog-header">
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
                {selectedCompositions.map(c => {
                  const opt = COMPOSITION_OPTIONS.find(o => o.id === c);
                  const labelText = opt ? (lang === 'ua' ? opt.label : opt.labelRu) : c;
                  return (
                    <span key={c} className="attr-chip" style={{ cursor: 'pointer' }}
                      onClick={() => toggle(selectedCompositions, setSelectedCompositions, c)}>
                      {labelText} ✕
                    </span>
                  );
                })}
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
