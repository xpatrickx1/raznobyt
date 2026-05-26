import { COMPOSITION_OPTIONS } from '../data/compositions.js';

const COLOR_MAP = {
  navy: '#1A3B6E', white: '#F0F0F0', khaki: '#7B7B4E', blue: '#2563EB',
  orange: '#EA6C1A', black: '#1A1A1A', gray: '#9CA3AF', green: '#2E7D5C',
  multicam: '#6B7A4A', yellow: '#FACC15', beige: '#C8B99A', brown: '#5D4037',
};

export default function CategorySidebar({
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
  setSelectedWidths,
}) {
  return (
    <aside className={`sidebar ${mobileFilters ? 'mobile-open' : ''}`}>
      <div className="sidebar__title">
        {t('catalog.filters')}
        {hasFilters && <button className="clear-btn" onClick={clearAll}>{t('catalog.clearFilters')}</button>}
      </div>

      {/* Тип тканини */}
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

      {/* Колір */}
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

      {/* Щільність */}
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

      {/* Склад */}
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

      {/* Ширина */}
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
}
