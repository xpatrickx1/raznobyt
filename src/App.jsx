import { createBrowserRouter, RouterProvider, useLocation, useOutlet, Navigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
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
    { path: '/catalog/:slug/', element: <CategoryPage /> },
    { path: '/catalog/:category/:slug/', element: <ProductPage /> },
  ],
};

function ScrollToTop() {
  const { pathname } = useLocation();
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function Layout() {
  const location = useLocation();
  const currentOutlet = useOutlet();

  if (location.pathname !== '/' && !location.pathname.endsWith('/')) {
    return <Navigate to={`${location.pathname}/${location.search}${location.hash}`} replace />;
  }

  const parts = location.pathname.split('/').filter(Boolean);
  let extraClass = '';
  if (parts[0] === 'catalog') {
    if (parts.length === 2) extraClass = ' category';
    if (parts.length >= 3) extraClass = ' product';
  }

  return (
    <>
      <ScrollToTop />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <div className={`page${extraClass}`}>
            {currentOutlet}
          </div>
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
