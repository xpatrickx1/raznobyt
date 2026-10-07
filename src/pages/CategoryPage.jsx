import { useState, useEffect } from 'react';
import { useParams, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import withRouter from '../lib/withRouter';
import { getProductsByCategory } from '../lib/products';
import categories from '../data/categories.json';
import CategoryView from '../components/Category/CategoryView';

function CategoryPage({ slug: externalSlug = null }) {
  const { slug: paramSlug } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);

  const slug = externalSlug ?? paramSlug;
  const cat = categories.find(c => c.slug === slug);

  // Redirect /catalog/:slug → /catalog/:slug/ (only relevant inside BrowserRouter)
  const expectedPath = `/catalog/${slug}/`;
  if (location.pathname !== expectedPath && location.pathname === `/catalog/${slug}`) {
    return <Navigate to={expectedPath} replace />;
  }

  if (!cat) return <Navigate to="/catalog" replace />;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getProductsByCategory(cat.id)
      .then(setProducts)
      .catch((err) => console.error('Error fetching products:', err));
  }, [cat.id]);

  // ── URL-driven filter state ──────────────────────────────────────────
  const getArray = (key) => {
    const all = searchParams.getAll(key);
    if (all.length > 1) {
      return all;
    }
    if (all.length === 1) {
      const val = all[0];
      if (key === 'types') {
        if (val === 'канвас, панама') return [val];
        if (val.includes('канвас, панама')) {
          return val
            .replace('канвас, панама', '__CANVAS_PANAMA__')
            .split(',')
            .map(s => s.trim() === '__CANVAS_PANAMA__' ? 'канвас, панама' : s.trim())
            .filter(Boolean);
        }
      }
      return val ? val.split(',').map(s => s.trim()).filter(Boolean) : [];
    }
    return [];
  };

  const update = (updates) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '' ||
          (Array.isArray(value) && value.length === 0)) {
          next.delete(key);
        } else if (Array.isArray(value)) {
          next.delete(key);
          value.forEach(v => next.append(key, v));
        } else {
          next.set(key, String(value));
        }
      });
      return next;
    }, { replace: true });
  };

  const search = searchParams.get('q') || '';
  const selectedSubcats = getArray('subcats');
  const selectedTypes = getArray('types');
  const selectedColors = getArray('colors');
  const selectedDensities = getArray('densities');
  const selectedWidths = getArray('widths');
  const selectedCompositions = getArray('compositions');
  const page = parseInt(searchParams.get('page') || '1', 10);

  const setSearch = (val) => update({ q: val, page: undefined });
  const setSelectedSubcats = (arr) => update({ subcats: arr, page: undefined });
  const setSelectedTypes = (arr) => update({ types: arr, page: undefined });
  const setSelectedColors = (arr) => update({ colors: arr, page: undefined });
  const setSelectedDensities = (arr) => update({ densities: arr, page: undefined });
  const setSelectedWidths = (arr) => update({ widths: arr, page: undefined });
  const setSelectedCompositions = (arr) => update({ compositions: arr, page: undefined });
  const setPage = (val) => update({ page: typeof val === 'function' ? val(page) : val });

  const clearAllFilters = () => {
    update({
      q: undefined,
      subcats: [],
      types: [],
      colors: [],
      densities: [],
      widths: [],
      compositions: [],
      page: undefined
    });
  };

  return (
    <CategoryView
      clearAllFilters={clearAllFilters}
      cat={cat}
      products={products}
      search={search}
      selectedSubcats={selectedSubcats} setSelectedSubcats={setSelectedSubcats}
      selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes}
      selectedColors={selectedColors} setSelectedColors={setSelectedColors}
      selectedDensities={selectedDensities} setSelectedDensities={setSelectedDensities}
      selectedWidths={selectedWidths} setSelectedWidths={setSelectedWidths}
      selectedCompositions={selectedCompositions} setSelectedCompositions={setSelectedCompositions}
      page={page} setPage={setPage}
      locationSearch={location.search}
    />
  );
}

export default withRouter(CategoryPage);
