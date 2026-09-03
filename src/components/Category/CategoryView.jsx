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

export default function CategoryView({
    cat,
    products,
    // filter state
    search,
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
    const [expandedSections, setExpandedSections] = useState(['type', 'color', 'width']);

    // Scroll to product block when filters / page change
    const prevSearch = useRef(locationSearch);
    useEffect(() => {
        if (prevSearch.current !== locationSearch) {
            targetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            prevSearch.current = locationSearch;
        }
    }, [locationSearch]);

    const { FABRIC_TYPES, COLORS, DENSITIES, WIDTHS, COMPOSITIONS } = useMemo(() => {
        const types = new Set();
        const cols = new Set();
        const dens = new Set();
        const wids = new Set();
        const comps = new Set();

        products.forEach(p => {
            if (p.attributes.fabricType) types.add(p.attributes.fabricType);

            if (Array.isArray(p.attributes.color)) {
                p.attributes.color.forEach(c => cols.add(c));
            } else if (p.attributes.color) {
                cols.add(p.attributes.color);
            }

            if (p.attributes.density) dens.add(p.attributes.density);
            if (p.attributes.width) wids.add(p.attributes.width);

            const comp = p.attributes?.composition;
            if (comp) {
                if (typeof comp === 'object') {
                    Object.entries(comp).forEach(([k, v]) => { if (v > 0) comps.add(k); });
                } else {
                    comps.add(comp);
                }
            }
        });

        return {
            FABRIC_TYPES: [...types],
            COLORS: [...cols],
            DENSITIES: [...dens].sort((a, b) => parseInt(a) - parseInt(b)),
            WIDTHS: [...wids],
            COMPOSITIONS: [...comps]
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
            setSelectedTypes([]);
            setSelectedColors([]);
            setSelectedDensities([]);
            setSelectedWidths([]);
            setSelectedCompositions([]);
            setPage(1);
        }
    };

    const hasFilters =
        selectedTypes.length + selectedColors.length + selectedDensities.length +
        selectedWidths.length + selectedCompositions.length > 0 || search;

    const filtered = useMemo(() => {
        return products.filter(p => {
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
                if (typeof comp === 'object') return comp[c] > 0;
                return comp === c;
            });
            return matchSearch && matchType && matchColor && matchDensity && matchWidth && matchComposition;
        });
    }, [search, selectedTypes, selectedColors, selectedDensities, selectedWidths, selectedCompositions, products]);

    const visible = filtered.slice(0, page * PAGE_SIZE);
    const hasMore = visible.length < filtered.length;

    const TextComp = textByCategory[cat.id] ?? null;

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
