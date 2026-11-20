import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';
import { build } from 'vite';
import crypto from 'crypto';
import { injectCriticalCss } from './inject-critical-css.mjs';
import { CATEGORY_PAGE_SIZE, getTotalPages } from '../src/lib/pagination.js';

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

    // Сторінки пагінації категорій ?page=N (N ≥ 2): окремі файли page-N.html,
    // nginx віддає їх за запитом /catalog/<slug>/?page=N (див. конфіг для CEO). У sitemap не потрапляють.
    for (const cat of categories) {
        const count = products.filter(p => p.category === cat.id).length;
        const totalPages = getTotalPages(count, CATEGORY_PAGE_SIZE);
        for (let n = 2; n <= totalPages; n++) {
            pages.push({
                url: `/catalog/${cat.slug}/?page=${n}`,
                component: 'CategoryPage',
                props: { slug: cat.slug },
                outFile: `/catalog/${cat.slug}/page-${n}.html`,
                paginated: true,
            });
        }
    }

    for (const prod of products) {
        const cat = categories.find(c => c.id === prod.category);
        const catSlug = cat ? cat.slug : 'unknown';
        pages.push({ url: `/catalog/${catSlug}/${prod.slug}/`, component: 'ProductPage', props: { slug: prod.slug, initialProduct: prod } });
    }

    // RU-версія кожної сторінки під /ru/... (404 лишається одна — UA)
    const ruPages = pages
        .filter(p => p.url !== '/404/')
        .map(p => ({
            ...p,
            url: p.url === '/' ? '/ru/' : `/ru${p.url}`,
            outFile: p.outFile ? `/ru${p.outFile}` : undefined,
            lang: 'ru',
            baseUrl: p.url,
        }));
    pages.forEach(p => { p.lang = 'ua'; p.baseUrl = p.url; });
    pages.push(...ruPages);

    console.log(`Pre-rendering ${pages.length} pages...`);

    // Хеш змісту сторінки для <lastmod>: без хешів файлів збірки й ?v=<версія>, які змінюються щозбірки
    const contentHashes = new Map();
    const normalizeForHash = (str) => String(str || '')
        .replace(/([?&])v=\d+/g, '$1')
        .replace(/-[A-Za-z0-9_-]{8}(\.(?:js|css|webp|png|jpe?g|svg|gif|avif|woff2?|pdf|p7s|docx?|xml))/g, '$1');

    for (const page of pages) {
        const { url, component, props = {} } = page;

        try {
            const { appHtml, helmet } = await render(url, component, props);

            contentHashes.set(url, crypto.createHash('sha1')
                .update(normalizeForHash(appHtml))
                .update(normalizeForHash(helmet ? `${helmet.title}${helmet.meta}${helmet.link}` : ''))
                .digest('hex'));

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

            let targetFile;
            if (page.outFile) {
                targetFile = path.join(root, 'dist', page.outFile);
            } else {
                let targetDir = path.join(root, 'dist');
                if (url !== '/') {
                    targetDir = path.join(root, 'dist', url.endsWith('/') ? url.slice(0, -1) : url);
                }
                targetFile = path.join(targetDir, 'index.html');
            }

            fs.mkdirSync(path.dirname(targetFile), { recursive: true });
            fs.writeFileSync(targetFile, html);
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

    // <lastmod>: дата зберігається, доки зміст сторінки не змінився.
    // Попередній маніфест береться з живого сайту (/lastmod.json); якщо його немає — дата поточної збірки.
    const today = new Date().toISOString().slice(0, 10);
    const prevLastmod = await loadPrevLastmod();
    const lastmodManifest = {};
    for (const [url, hash] of contentHashes) {
        const prev = prevLastmod[url];
        lastmodManifest[url] = {
            hash,
            lastmod: prev && prev.hash === hash && /^\d{4}-\d{2}-\d{2}$/.test(prev.lastmod) ? prev.lastmod : today,
        };
    }
    fs.writeFileSync(path.join(root, 'dist', 'lastmod.json'), JSON.stringify(lastmodManifest));
    console.log('✓ Generated lastmod.json');

    // Generate sitemap.xml (з hreflang-альтернативами UA/RU)
    // Без: 404, сторінок пагінації ?page=N, карток без категорії (/catalog/unknown/, SEO-ТЗ завдання 5)
    const ruBaseUrls = new Set(ruPages.map(p => p.baseUrl));
    const urlsXml = pages
        .filter(page => page.url !== '/404/' && !page.paginated && !page.url.includes('/catalog/unknown/'))
        .map(page => {
            const isHome = page.baseUrl === '/';
            const alternates = ruBaseUrls.has(page.baseUrl) ? `
    <xhtml:link rel="alternate" hreflang="uk" href="${DOMAIN}${page.baseUrl}"/>
    <xhtml:link rel="alternate" hreflang="ru" href="${DOMAIN}${page.baseUrl === '/' ? '/ru/' : `/ru${page.baseUrl}`}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN}${page.baseUrl}"/>` : '';
            return `
  <url>
    <loc>${DOMAIN}${page.url}</loc>${alternates}
    <lastmod>${lastmodManifest[page.url]?.lastmod || today}</lastmod>
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

async function loadPrevLastmod() {
    // Локальна перевірка без мережі: SITEMAP_LASTMOD_OFFLINE=1
    if (process.env.SITEMAP_LASTMOD_OFFLINE === '1') return {};
    try {
        const res = await fetch(`${DOMAIN}/lastmod.json`, { signal: AbortSignal.timeout(10000) });
        if (!res.ok) return {};
        const data = await res.json();
        return data && typeof data === 'object' ? data : {};
    } catch (e) {
        console.warn('⚠ Previous lastmod.json not loaded, using build date:', e.message);
        return {};
    }
}

generate().catch(console.error);
