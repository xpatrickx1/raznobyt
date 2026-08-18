import { createBrowserRouter, RouterProvider, useLocation, useOutlet, Navigate } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { createRef, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { LangProvider } from './i18n/LangContext';
import Footer from './components/Footer';
import FloatingContacts from './components/FloatingContacts';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import Contacts from './pages/Contacts';
import AboutUs from './pages/AboutUs';
import Documents from './pages/Documents';
import Delivery from './pages/Delivery';
import Blog from './pages/Blog';
import News from './pages/News';
import NotFound from './pages/NotFound';
import './index.css';

// Перевірка відповідності шляху шаблону (наприклад, /catalog/:slug/ та /catalog/workwear/)
const matchRoute = (pattern, path) => {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return false;
  return patternParts.every((part, i) => part.startsWith(':') || part === pathParts[i]);
};

// Всі шляхи зі слешем в кінці
const ROUTES = {
  static: [
    { path: '/', name: 'Home', element: <Home />, exact: true },
    { path: '/catalog/', name: 'Catalog', element: <Catalog /> },
    { path: '/about-us/', name: 'About Us', element: <AboutUs /> },
    { path: '/contacts/', name: 'Contacts', element: <Contacts /> },
    { path: '/documents/', name: 'Documents', element: <Documents /> },
    { path: '/delivery/', name: 'Delivery', element: <Delivery /> },
    { path: '/blog/', name: 'Blog', element: <Blog /> },
    { path: '/news/', name: 'News', element: <News /> },
    { path: '/404/', name: 'NotFound', element: <NotFound /> },
  ],
  dynamic: [
    { path: '/catalog/:slug/', element: <CategoryPage />, parentPath: '/catalog/' },
    { path: '/catalog/:category/:slug/', element: <ProductPage />, parentPath: null },
  ],
};

// Нормалізація шляху - гарантуємо слеш в кінці
const normalizePath = (pathname) => {
  if (pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
};

const staticRoutesWithRefs = ROUTES.static.map(route => ({
  ...route,
  nodeRef: createRef(),
}));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function Layout() {
  const location = useLocation();
  const currentOutlet = useOutlet();

  if (location.pathname !== '/' && !location.pathname.endsWith('/')) {
    return <Navigate to={`${location.pathname}/${location.search}${location.hash}`} replace />;
  }

  const normalizedPathname = normalizePath(location.pathname);

  const findMatchingRoute = () => {
    // Шукаємо серед статичних роутів
    const exactMatch = staticRoutesWithRefs.find(
      route => route.path === normalizedPathname
    );
    if (exactMatch) return exactMatch;

    // Перевіряємо динамічні роути
    for (const dynamicRoute of ROUTES.dynamic) {
      if (matchRoute(dynamicRoute.path, normalizedPathname)) {
        if (dynamicRoute.parentPath) {
          const parentRoute = staticRoutesWithRefs.find(
            r => r.path === dynamicRoute.parentPath
          );
          if (parentRoute) return parentRoute;
        }
        return { ...dynamicRoute, nodeRef: createRef() };
      }
    }

    // Якщо нічого не знайдено - повертаємо роут 404 для транзиції
    return staticRoutesWithRefs.find(r => r.path === '/404/');
  };

  const matchingRoute = findMatchingRoute();
  const nodeRef = matchingRoute ? matchingRoute.nodeRef : staticRoutesWithRefs[0].nodeRef;

  return (
    <>
      <ScrollToTop />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <SwitchTransition>
            <CSSTransition
              key={location.pathname}
              nodeRef={nodeRef}
              timeout={300}
              classNames="page"
              unmountOnExit
            >
              {(state) => (
                <div ref={nodeRef} className="page">
                  {currentOutlet}
                </div>
              )}
            </CSSTransition>
          </SwitchTransition>
        </main>
        <Footer />
        <FloatingContacts />
      </div>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      ...ROUTES.static
        .filter(route => !['/', '/404/'].includes(route.path))
        .map(route => ({
          path: route.path.slice(1),
          element: route.element,
        })),
      ...ROUTES.dynamic.map(route => ({
        path: route.path.slice(1),
        element: route.element,
      })),
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return (
    <HelmetProvider>
      <LangProvider>
        <RouterProvider router={router} />
      </LangProvider>
    </HelmetProvider>
  );
}