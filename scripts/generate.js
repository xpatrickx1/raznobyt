import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';
import { build } from 'vite';
import { injectCriticalCss } from './inject-critical-css.mjs';

const DOMAIN = 'https://raznobyt.com';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

async function generate() {
    console.log('Building client...');
    await build({
        build: {
            outDir: path.resolve(root, 'dist'),
            emptyOutDir: true,
        }
    });

    console.log('Building SSR bundle...');
    await build({
        build: {
            ssr: 'src/entry-server.jsx',
            outDir: path.resolve(root, 'dist-server'),
            emptyOutDir: true,
            rollupOptions: {
                output: {
                    entryFileNames: 'entry-server.js'
                }
            }
        },
        ssr: {
            noExternal: ['react-helmet-async']
        }
    });

    const template = fs.readFileSync(path.resolve(root, 'dist/index.html'), 'utf-8');

    const { render } = await import(pathToFileURL(path.resolve(root, 'dist-server/entry-server.js')).href);

    const categories = JSON.parse(fs.readFileSync(path.resolve(root, 'src/data/categories.json'), 'utf-8'));

    const products = [];
    try {
        const productsJson = fs.readFileSync(path.resolve(root, 'public/products.json'), 'utf-8');
        products.push(...JSON.parse(productsJson));
    } catch (e) {
        console.log('No public/products.json found, skipping product pages');
    }

    const pages = [
        { url: '/', component: 'Home' },
        { url: '/catalog/', component: 'Catalog' },
        { url: '/about-us/', component: 'AboutUs' },
        { url: '/contacts/', component: 'Contacts' },
        { url: '/documents/', component: 'Documents' },
        { url: '/delivery/', component: 'Delivery' },
        { url: '/blog/', component: 'Blog' },
        { url: '/news/', component: 'News' },
        { url: '/404/', component: 'NotFound' },
    ];

    for (const cat of categories) {
        pages.push({ url: `/catalog/${cat.slug}/`, component: 'CategoryPage', props: { slug: cat.slug } });
    }

    for (const prod of products) {
        const cat = categories.find(c => c.id === prod.category);
        const catSlug = cat ? cat.slug : 'unknown';
        pages.push({ url: `/catalog/${catSlug}/${prod.slug}/`, component: 'ProductPage', props: { slug: prod.slug, initialProduct: prod } });
    }

    // RU-версія кожної сторінки під /ru/... (404 лишається одна — UA)
    const ruPages = pages
        .filter(p => p.url !== '/404/')
        .map(p => ({ ...p, url: p.url === '/' ? '/ru/' : `/ru${p.url}`, lang: 'ru', baseUrl: p.url }));
    pages.forEach(p => { p.lang = 'ua'; p.baseUrl = p.url; });
    pages.push(...ruPages);

    console.log(`Pre-rendering ${pages.length} pages...`);

    for (const page of pages) {
        const { url, component, props = {} } = page;

        try {
            const { appHtml, helmet } = await render(url, component, props);

            let html = template.replace('<!--app-html-->', appHtml);

            if (helmet) {
                const htmlAttrs = helmet.htmlAttributes.toString();
                if (htmlAttrs) {
                    html = html.replace(/<html[^>]*>/, `<html ${htmlAttrs}>`);
                }
                const helmetTitle = helmet.title.toString();
                const helmetMeta = helmet.meta.toString();
                const helmetLink = helmet.link.toString();
                const hasValidTitle = helmetTitle && !helmetTitle.includes('><');
                const titleToInsert = hasValidTitle ? helmetTitle : '<title>Різнобит Textile Group</title>';

                html = html.replace(
                    '<title>Різнобит Textile Group</title>',
                    `${titleToInsert}
            ${helmetMeta}
            ${helmetLink}`
                );
            }

            let targetDir = path.join(root, 'dist');
            if (url !== '/') {
                targetDir = path.join(root, 'dist', url.endsWith('/') ? url.slice(0, -1) : url);
            }

            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            fs.writeFileSync(path.join(targetDir, 'index.html'), html);
            console.log(`✓ Rendered ${url}`);
        } catch (e) {
            console.error(`X Error rendering ${url}:`, e.message);
            if (e.stack) console.error(e.stack);
        }
    }

    // Inject LCP preload for hero image into home page only
    try {
        const imagesDir = path.resolve(root, 'dist/assets/images');
        const imageFiles = fs.readdirSync(imagesDir);
        const heroImage = imageFiles.find(f => f.startsWith('slide1-') && f.endsWith('.webp'));
        if (heroImage) for (const homeFile of ['dist/index.html', 'dist/ru/index.html']) {
            const homeHtmlPath = path.join(root, homeFile);
            let homeHtml = fs.readFileSync(homeHtmlPath, 'utf-8');
            const preloadTag = `<link rel="preload" as="image" href="/assets/images/${heroImage}" fetchpriority="high">`;
            if (!homeHtml.includes('rel="preload" as="image" href="/assets/images/slide1')) {
                homeHtml = homeHtml.replace('</head>', `  ${preloadTag}\n</head>`);
                fs.writeFileSync(homeHtmlPath, homeHtml);
                console.log(`✓ LCP preload injected: ${heroImage} → ${homeFile}`);
            }
        }
        if (!heroImage) {
            console.warn('⚠ Hero image not found in dist/assets/images, skipping LCP preload');
        }
    } catch (e) {
        console.error('X Error injecting LCP preload:', e.message);
    }

    console.log('Injecting critical CSS into all pages...');
    await injectCriticalCss();

    // Generate sitemap.xml (з hreflang-альтернативами UA/RU)
    const ruBaseUrls = new Set(ruPages.map(p => p.baseUrl));
    const urlsXml = pages
        .filter(page => page.url !== '/404/')
        .map(page => {
            const isHome = page.baseUrl === '/';
            const alternates = ruBaseUrls.has(page.baseUrl) ? `
    <xhtml:link rel="alternate" hreflang="uk" href="${DOMAIN}${page.baseUrl}"/>
    <xhtml:link rel="alternate" hreflang="ru" href="${DOMAIN}${page.baseUrl === '/' ? '/ru/' : `/ru${page.baseUrl}`}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN}${page.baseUrl}"/>` : '';
            return `
  <url>
    <loc>${DOMAIN}${page.url}</loc>${alternates}
    <changefreq>${isHome ? 'daily' : 'weekly'}</changefreq>
    <priority>${isHome ? '1.0' : '0.8'}</priority>
  </url>`;
        }).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlsXml}
</urlset>`;

    fs.writeFileSync(path.join(root, 'dist', 'sitemap.xml'), sitemap);
    console.log('✓ Generated sitemap.xml');

    // Generate robots.txt
    const robots = `User-agent: *
Allow: /
Disallow: /404/

Sitemap: ${DOMAIN}/sitemap.xml
`;
    fs.writeFileSync(path.join(root, 'dist', 'robots.txt'), robots);
    console.log('✓ Generated robots.txt');

    fs.rmSync(path.resolve(root, 'dist-server'), { recursive: true, force: true });
    console.log('SSG complete!');
}

generate().catch(console.error);
