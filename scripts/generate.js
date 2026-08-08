import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';
import { build } from 'vite';

const DOMAIN = 'https://catalog.raznobyt.com';

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
        pages.push({ url: `/product/${prod.slug}/`, component: 'ProductPage', props: { slug: prod.slug } });
    }

    console.log(`Pre-rendering ${pages.length} pages...`);

    for (const page of pages) {
        const { url, component, props = {} } = page;

        try {
            const { appHtml, helmet } = await render(url, component, props);

            let html = template.replace('<!--app-html-->', appHtml);

            if (helmet) {
                html = html.replace(
                    '<title>Різнобит Textile Group</title>',
                    `${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}`
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
            console.error(`X Error rendering ${url}:`, e);
        }
    }

    // Generate sitemap.xml
    const urlsXml = pages.map(page => `
  <url>
    <loc>${DOMAIN}${page.url}</loc>
    <changefreq>${page.url === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page.url === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

    fs.writeFileSync(path.join(root, 'dist', 'sitemap.xml'), sitemap);
    console.log('✓ Generated sitemap.xml');

    // Generate robots.txt
    // Allow: /
    const robots = `User-agent: *
Disallow: /

Sitemap: ${DOMAIN}/sitemap.xml
`;
    fs.writeFileSync(path.join(root, 'dist', 'robots.txt'), robots);
    console.log('✓ Generated robots.txt');

    fs.rmSync(path.resolve(root, 'dist-server'), { recursive: true, force: true });
    console.log('SSG complete!');
}

generate().catch(console.error);
