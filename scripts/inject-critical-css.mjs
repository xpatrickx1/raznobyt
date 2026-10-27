import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import postcssImport from 'postcss-import';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const inputPath = path.resolve(root, 'src/styles/critical.css');
const outputPath = path.resolve(root, 'dist/index.html');

/**
 * Builds and processes critical CSS from src/styles/critical.css
 */
export async function getCriticalCss() {
    const css = await fs.readFile(inputPath, 'utf8');

    const result = await postcss([
        postcssImport({ root }),
    ]).process(css, {
        from: inputPath,
    });

    let criticalCss = result.css;

    // Resolve hashed font path in dist/assets/fonts if available
    try {
        const fontsDir = path.resolve(root, 'dist/assets/fonts');
        const fontFiles = await fs.readdir(fontsDir);
        const conthraxFont = fontFiles.find(f => f.startsWith('Conthrax-SemiBold') && f.endsWith('.otf'));
        if (conthraxFont) {
            criticalCss = criticalCss.replace(
                /url\(['"]?\.\/assets\/fonts\/Conthrax-SemiBold\.otf['"]?\)/g,
                `url('/assets/fonts/${conthraxFont}')`
            );
        }
    } catch {
        // Ignore if dist/assets/fonts doesn't exist yet
    }

    // Minify with esbuild if available
    try {
        const esbuild = await import('esbuild');
        const minified = await esbuild.transform(criticalCss, {
            loader: 'css',
            minify: true,
        });
        criticalCss = minified.code;
    } catch {
        // Fallback to unminified CSS
    }

    return criticalCss.replace(/<\/style/gi, '<\\/style');
}

/**
 * Injects critical CSS into an HTML string
 */
export function injectCriticalCssIntoHtml(html, criticalCss) {
    const styleTag = `<style id="critical-css">${criticalCss}</style>`;

    if (html.includes('id="critical-css"')) {
        return html.replace(
            /<style id="critical-css">[\s\S]*?<\/style>/,
            styleTag
        );
    }

    if (html.includes('</head>')) {
        return html.replace('</head>', `${styleTag}\n</head>`);
    }

    return styleTag + html;
}

/**
 * Recursively find all HTML files in a directory
 */
async function getHtmlFiles(dir) {
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        const files = [];
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                files.push(...await getHtmlFiles(fullPath));
            } else if (entry.isFile() && entry.name.endsWith('.html')) {
                files.push(fullPath);
            }
        }
        return files;
    } catch {
        return [];
    }
}

/**
 * Main function: injects critical CSS into dist/index.html (and all dist HTML files)
 */
export async function injectCriticalCss() {
    const criticalCss = await getCriticalCss();

    // Ensure dist/index.html is updated
    try {
        const html = await fs.readFile(outputPath, 'utf8');
        const updatedHtml = injectCriticalCssIntoHtml(html, criticalCss);
        await fs.writeFile(outputPath, updatedHtml, 'utf8');
        console.log(`Critical CSS injected successfully into ${outputPath}`);
    } catch (err) {
        console.warn(`Could not update ${outputPath}: ${err.message}`);
    }

    // Also update any other HTML files in dist if they exist
    const distDir = path.resolve(root, 'dist');
    const allHtml = await getHtmlFiles(distDir);
    let count = 0;
    for (const file of allHtml) {
        if (path.resolve(file) === outputPath) continue;
        try {
            const html = await fs.readFile(file, 'utf8');
            const updatedHtml = injectCriticalCssIntoHtml(html, criticalCss);
            await fs.writeFile(file, updatedHtml, 'utf8');
            count++;
        } catch {
            // Ignore individual file errors
        }
    }
    if (count > 0) {
        console.log(`Critical CSS also injected into ${count} other HTML page(s) in dist.`);
    }
}

// Run automatically when executed directly as a script
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
    await injectCriticalCss();
}