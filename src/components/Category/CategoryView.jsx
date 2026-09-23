import { useState, useMemo, useRef, useEffect } from 'react';
import { useLang } from '../../i18n/LangContext';
import SEO from '../SEO/index';
import ProductCard from '../ProductCard';
import CategorySidebar from '../CategorySidebar';
import { textByCategory } from '../categoryText/catText.js';
import HeroSection from '../HeroSection';
import { getCompositionOption } from '../../data/compositions.js';

const COLOR_MAP = {
    navy: '#1A3B6E', white: '#F0F0F0', khaki: '#7B7B4E', blue: '#2563EB',
    orange: '#EA6C1A', black: '#1A1A1A', gray: '#9CA3AF', green: '#2E7D5C',
    multicam: '#6B7A4A', yellow: '#FACC15', beige: '#C8B99A', brown: '#5D4037',
};

const PAGE_SIZE = 9;

const PREFERRED_SUBCAT_ORDER = ['solid', 'cell', 'strip', 'dot', 'print'];

export default function CategoryView({
    cat,
    products,
    // filter state
    search,
    selectedSubcats = [], setSelectedSubcats = () => {},
    selectedTypes, setSelectedTypes,
    selectedColors, setSelectedColors,
    selectedDensities, setSelectedDensities,
    selectedWidths, setSelectedWidths,
    selectedCompositions, setSelectedCompositions,
    page, setPage,
    clearAllFilters,
    // scroll trigger: changes whenever URL search params change
    locationSearch,
}) {
    const { lang, t } = useLang();
    const targetRef = useRef(null);
    const [mobileFilters, setMobileFilters] = useState(false);
    const [expandedSections, setExpandedSections] = useState(['subcat', 'type', 'color', 'width']);
    const [mobileCols, setMobileCols] = useState(() => {
        try {
            return localStorage.getItem('fabric_catalog_cols') === '2' ? 2 : 1;
        } catch {
            return 1;
        }
    });

    const handleMobileColsChange = (cols) => {
        setMobileCols(cols);
        try {
            localStorage.setItem('fabric_catalog_cols', String(cols));
        } catch {
            // ignore
        }
    };

    // Scroll to product block when filters change or page resets/decreases
    const skipScrollRef = useRef(false);
    const prevSearch = useRef(locationSearch);
    useEffect(() => {
        if (prevSearch.current !== locationSearch) {
            const shouldSkipScroll = skipScrollRef.current;
            skipScrollRef.current = false;

            const prevParams = new URLSearchParams(prevSearch.current);
            const currentParams = new URLSearchParams(locationSearch);

            const prevPage = parseInt(prevParams.get('page') || '1', 10);
            const currentPage = parseInt(currentParams.get('page') || '1', 10);

            prevParams.delete('page');
            currentParams.delete('page');

            const filtersChanged = prevParams.toString() !== currentParams.toString();

            // Only scroll up if filters changed or page was reset/reduced
            if (!shouldSkipScroll && (filtersChanged || currentPage < prevPage)) {
                targetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            prevSearch.current = locationSearch;
        }
    }, [locationSearch]);

    const { FABRIC_TYPES, COLORS, DENSITIES, WIDTHS, COMPOSITIONS, SUBCATS } = useMemo(() => {
        const types = new Set();
        const cols = new Set();
        const dens = new Set();
        const wids = new Set();
        const comps = new Set();
        const subcats = new Set();

        products.forEach(p => {
            if (p.subcat) subcats.add(p.subcat);
            if (p.attributes?.fabricType) types.add(p.attributes.fabricType);

            if (Array.isArray(p.attributes?.color)) {
                p.attributes.color.forEach(c => cols.add(c));
            } else if (p.attributes?.color) {
                cols.add(p.attributes.color);
            }

            if (p.attributes?.density) dens.add(p.attributes.density);
            if (p.attributes?.width) wids.add(p.attributes.width);

            const comp = p.attributes?.composition;
            if (comp) {
                if (typeof comp === 'object') {
                    Object.entries(comp).forEach(([k, v]) => { if (v > 0) comps.add(k); });
                } else {
                    comps.add(comp);
                }
            }
        });

        const sortedSubcats = [...subcats].sort((a, b) => {
            const idxA = PREFERRED_SUBCAT_ORDER.indexOf(a);
            const idxB = PREFERRED_SUBCAT_ORDER.indexOf(b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.localeCompare(b);
        });

        return {
            FABRIC_TYPES: [...types],
            COLORS: [...cols],
            DENSITIES: [...dens].sort((a, b) => parseInt(a) - parseInt(b)),
            WIDTHS: [...wids],
            COMPOSITIONS: [...comps],
            SUBCATS: sortedSubcats,
        };
    }, [products]);

    const toggleSection = (section) => {
        setExpandedSections(prev =>
            prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
        );
    };

    const toggle = (arr, setArr, val) => {
        const nextArr = arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
        setArr(nextArr);
    };

    const clearAll = () => {
        if (clearAllFilters) {
            clearAllFilters();
        } else {
            setSelectedSubcats([]);
            setSelectedTypes([]);
            setSelectedColors([]);
            setSelectedDensities([]);
            setSelectedWidths([]);
            setSelectedCompositions([]);
            setPage(1);
        }
    };

    const hasFilters =
        selectedSubcats.length + selectedTypes.length + selectedColors.length +
        selectedDensities.length + selectedWidths.length + selectedCompositions.length > 0 || search;

    const filtered = useMemo(() => {
        return products.filter(p => {
            const q = search.toLowerCase();
            const matchSearch = !search ||
                p.title.ua.toLowerCase().includes(q) ||
                p.title.ru.toLowerCase().includes(q);
            const matchSubcat = selectedSubcats.length === 0 || selectedSubcats.includes(p.subcat);
            const matchType = selectedTypes.length === 0 || selectedTypes.includes(p.attributes?.fabricType);
            const matchColor = selectedColors.length === 0 ||
                (Array.isArray(p.attributes?.color)
                    ? p.attributes.color.some(c => selectedColors.includes(c))
                    : selectedColors.includes(p.attributes?.color));
            const matchDensity = selectedDensities.length === 0 || selectedDensities.includes(p.attributes?.density);
            const matchWidth = selectedWidths.length === 0 || selectedWidths.includes(p.attributes?.width);
            const matchComposition = selectedCompositions.length === 0 || selectedCompositions.some(c => {
                const comp = p.attributes?.composition;
                if (!comp) return false;
                if (typeof comp === 'object') return comp[c] > 0;
                return comp === c;
            });
            return matchSearch && matchSubcat && matchType && matchColor && matchDensity && matchWidth && matchComposition;
        });
    }, [search, selectedSubcats, selectedTypes, selectedColors, selectedDensities, selectedWidths, selectedCompositions, products]);

    const visible = filtered.slice(0, page * PAGE_SIZE);
    const hasMore = visible.length < filtered.length;

    const catTextEntry = textByCategory[cat.id];
    const TextComp = typeof catTextEntry === 'function' ? catTextEntry : (catTextEntry?.[lang] || catTextEntry?.ua || null);

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
                    <CategorySidebar
                        mobileFilters={mobileFilters}
                        t={t}
                        hasFilters={hasFilters}
                        clearAll={clearAll}
                        SUBCATS={SUBCATS}
                        selectedSubcats={selectedSubcats}
                        setSelectedSubcats={setSelectedSubcats}
                        FABRIC_TYPES={FABRIC_TYPES}
                        toggleSection={toggleSection}
                        expandedSections={expandedSections}
                        selectedTypes={selectedTypes}
                        toggle={toggle}
                        COLORS={COLORS}
                        selectedColors={selectedColors}
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
                        {/* Subcategory Pills */}
                        {SUBCATS.length > 0 && (
                            <div className="subcat-pills-bar">
                                <button
                                    type="button"
                                    className={`subcat-pill ${selectedSubcats.length === 0 ? 'active' : ''}`}
                                    onClick={() => {
                                        if (selectedSubcats.length > 0) {
                                            skipScrollRef.current = true;
                                            setSelectedSubcats([]);
                                        }
                                    }}
                                >
                                    {t('subcategories.all')}
                                    <span className="subcat-pill__count">{products.length}</span>
                                </button>
                                {SUBCATS.map(sc => {
                                    const count = products.filter(p => p.subcat === sc).length;
                                    const isSelected = selectedSubcats.includes(sc);
                                    return (
                                        <button
                                            key={sc}
                                            type="button"
                                            className={`subcat-pill ${isSelected ? 'active' : ''}`}
                                            onClick={() => {
                                                skipScrollRef.current = true;
                                                if (isSelected && selectedSubcats.length === 1) {
                                                    setSelectedSubcats([]);
                                                } else {
                                                    setSelectedSubcats([sc]);
                                                }
                                            }}
                                        >
                                            {t(`subcategories.${sc}`) || sc}
                                            <span className="subcat-pill__count">{count}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Top Bar */}
                        <div className="catalog-header">
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                <button
                                    type="button"
                                    className="filter-toggle-btn"
                                    onClick={() => setMobileFilters(!mobileFilters)}
                                >
                                    ☰ {t('catalog.filters')}
                                </button>
                                <span className="catalog-count">
                                    {t('catalog.showing')} {visible.length} {t('catalog.of')} {filtered.length} {t('catalog.products')}
                                </span>
                            </div>

                            <div className="catalog-view-toggle" role="group" aria-label={t('catalog.viewMode') || 'Вигляд товарів'}>
                                <button
                                    type="button"
                                    className={`catalog-view-toggle__btn ${mobileCols === 1 ? 'active' : ''}`}
                                    onClick={() => handleMobileColsChange(1)}
                                    title={t('catalog.viewOneCol') || 'В 1 колонку'}
                                    aria-label={t('catalog.viewOneCol') || 'В 1 колонку'}
                                >
                                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <rect x="2.5" y="3.5" width="15" height="13" rx="2" fill={mobileCols === 1 ? 'currentColor' : 'none'} fillOpacity={mobileCols === 1 ? '0.25' : '0'} />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    className={`catalog-view-toggle__btn ${mobileCols === 2 ? 'active' : ''}`}
                                    onClick={() => handleMobileColsChange(mobileCols === 2 ? 1 : 2)}
                                    title={t('catalog.viewTwoCols') || 'У 2 колонки'}
                                    aria-label={t('catalog.viewTwoCols') || 'У 2 колонки'}
                                >
                                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <rect x="2.5" y="3.5" width="6.5" height="13" rx="1.5" fill={mobileCols === 2 ? 'currentColor' : 'none'} fillOpacity={mobileCols === 2 ? '0.25' : '0'} />
                                        <rect x="11" y="3.5" width="6.5" height="13" rx="1.5" fill={mobileCols === 2 ? 'currentColor' : 'none'} fillOpacity={mobileCols === 2 ? '0.25' : '0'} />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Active filter chips */}
                        {hasFilters && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                                {selectedSubcats.map(sc => (
                                    <span key={sc} className="attr-chip attr-chip--accent" style={{ cursor: 'pointer' }}
                                        onClick={() => toggle(selectedSubcats, setSelectedSubcats, sc)}>
                                        {t(`subcategories.${sc}`) || sc} ✕
                                    </span>
                                ))}
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
                                    const opt = getCompositionOption(c);
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
                                <div className={`products-grid ${mobileCols === 2 ? 'products-grid--2col' : 'products-grid--1col'}`}>
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

                {/* SEO Text Section */}
                {TextComp && (
                    <div className="seo-text-section" style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb', color: '#6b7280', fontSize: '0.875rem' }}>
                        <TextComp />
                    </div>
                )}
            </div>
        </>
    );
}
