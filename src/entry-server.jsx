import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LangProvider } from './i18n/LangContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import AboutUs from './pages/AboutUs';
import Contacts from './pages/Contacts';
import Documents from './pages/Documents';
import Delivery from './pages/Delivery';
import Blog from './pages/Blog';
import News from './pages/News';
import NotFound from './pages/NotFound';

const COMPONENT_MAP = {
    Home,
    Catalog,
    CategoryPage,
    ProductPage,
    AboutUs,
    Contacts,
    Documents,
    Delivery,
    Blog,
    News,
    NotFound
};

export async function render(url, componentName, props = {}) {
    const Component = COMPONENT_MAP[componentName];
    if (!Component) throw new Error(`Component ${componentName} not found`);

    const helmetContext = {};

    const appHtml = renderToString(
        <HelmetProvider context={helmetContext}>
            <LangProvider>
                <MemoryRouter initialEntries={[url]}>
                    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                        <Navbar />
                        <main style={{ flex: 1 }}>
                            <div className="page">
                                <Component {...props} />
                            </div>
                        </main>
                        <Footer />
                    </div>
                </MemoryRouter>
            </LangProvider>
        </HelmetProvider>
    );

    return { appHtml, helmet: helmetContext.helmet };
}
