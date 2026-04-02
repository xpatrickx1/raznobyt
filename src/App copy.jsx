import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider, NavLink, useLocation, useOutlet } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { createRef } from 'react'
import { HelmetProvider } from 'react-helmet-async';
import { LangProvider } from './i18n/LangContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import Contacts from './pages/Contacts';
import AboutUs from './pages/AboutUs';
import Documents from './pages/Documents';
import Delivery from './pages/Delivery';
import './index.css';

// Create a separate component that uses router hooks
function AppContent() {
  const location = useLocation();
  const currentOutlet = useOutlet();

  const routes = [
    { path: '/', name: 'Home', element: <Home />, nodeRef: createRef() },
    { path: '/about-us', name: 'About', element: <AboutUs />, nodeRef: createRef() },
    { path: '/contacts', name: 'Contact', element: <Contacts />, nodeRef: createRef() },
    { path: '/catalog', name: 'Catalog', element: <Catalog />, nodeRef: createRef() },
    { path: '/catalog/:slug', name: 'Category', element: <CategoryPage />, nodeRef: createRef() },
    { path: '/product/:id', name: 'Product', element: <ProductPage />, nodeRef: createRef() },
    { path: '/documents', name: 'Documents', element: <Documents />, nodeRef: createRef() },
    { path: '/delivery', name: 'Delivery', element: <Delivery />, nodeRef: createRef() },
  ];

  const { nodeRef } = routes.find((route) => {
    // Handle dynamic routes
    if (route.path.includes(':')) {
      return location.pathname.startsWith(route.path.split('/:')[0]);
    }
    return route.path === location.pathname;
  }) ?? {};

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

export default function App() {
  return (
    <HelmetProvider>
      <LangProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppContent />}>
              <Route index element={<Home />} />
              <Route path="catalog" element={<Catalog />} />
              <Route path="catalog/:slug" element={<CategoryPage />} />
              <Route path="product/:id" element={<ProductPage />} />
              <Route path="about-us" element={<AboutUs />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="documents" element={<Documents />} />
              <Route path="delivery" element={<Delivery />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LangProvider>
    </HelmetProvider>
  );
}