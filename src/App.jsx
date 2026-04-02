import { createBrowserRouter, RouterProvider, useLocation, useOutlet } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { createRef, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { LangProvider } from './i18n/LangContext';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import Contacts from './pages/Contacts';
import AboutUs from './pages/AboutUs';
import Documents from './pages/Documents';
import Delivery from './pages/Delivery';
import './index.css';

// Всі шляхи без слеша в кінці
const ROUTES = {
  static: [
    { path: '/', name: 'Home', element: <Home />, exact: true },
    { path: '/catalog', name: 'Catalog', element: <Catalog /> },
    { path: '/about-us', name: 'About Us', element: <AboutUs /> },
    { path: '/contacts', name: 'Contacts', element: <Contacts /> },
    { path: '/documents', name: 'Documents', element: <Documents /> },
    { path: '/delivery', name: 'Delivery', element: <Delivery /> },
  ],
  dynamic: [
    { path: '/catalog/:slug', element: <CategoryPage />, parentPath: '/catalog' },
    { path: '/product/:id', element: <ProductPage />, parentPath: null },
  ],
};

// Нормалізація шляху - видаляємо слеш в кінці для всіх шляхів крім кореня
const normalizePath = (pathname) => {
  if (pathname === '/') return '/';
  return pathname.replace(/\/$/, '');
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
  const normalizedPathname = normalizePath(location.pathname);

  const findMatchingRoute = () => {
    // Шукаємо серед статичних роутів
    const exactMatch = staticRoutesWithRefs.find(
      route => route.path === normalizedPathname
    );
    if (exactMatch) return exactMatch;

    // Перевіряємо динамічні роути
    for (const dynamicRoute of ROUTES.dynamic) {
      const basePath = dynamicRoute.path.split('/:')[0];
      if (normalizedPathname.startsWith(basePath)) {
        if (dynamicRoute.parentPath) {
          const parentRoute = staticRoutesWithRefs.find(
            r => r.path === dynamicRoute.parentPath
          );
          if (parentRoute) return parentRoute;
        }
        return { ...dynamicRoute, nodeRef: createRef() };
      }
    }

    return staticRoutesWithRefs[0];
  };

  const { nodeRef } = findMatchingRoute();

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
        .filter(route => route.path !== '/')
        .map(route => ({
          path: route.path.slice(1),
          element: route.element,
        })),
      ...ROUTES.dynamic.map(route => ({
        path: route.path.slice(1),
        element: route.element,
      })),
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