import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LangProvider } from './i18n/LangContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import Contacts from './pages/Contacts';
import './index.css';

export default function App() {
  return (
    <HelmetProvider>
      <LangProvider>
        <BrowserRouter>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/contacts" element={<Contacts />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </LangProvider>
    </HelmetProvider>
  );
}
