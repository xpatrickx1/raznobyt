// src/assets/utils/imageLoader.js

/**
 * Універсальний завантажувач зображень
 * @param {string} path - шлях до зображення (починається з /images/ або /uploads/)
 * @param {string} basePath - базовий шлях (за замовчуванням '/')
 * @returns {Promise<string>} - URL зображення
 */

// Версія збірки для скидання кешу (cache busting)
const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? String(__APP_VERSION__) : '';

/**
 * Додає версію до URL зображення (?v=...) для оновлення кешу
 * @param {string} url - URL або шлях до зображення
 * @returns {string} - URL з версією
 */
export function withVersion(url) {
    if (!url || typeof url !== 'string' || !APP_VERSION) return url;
    if (url.startsWith('data:') || url.startsWith('blob:')) return url;
    // Якщо версія вже присутня, не дублюємо її
    if (url.includes('v=')) return url;
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}v=${APP_VERSION}`;
}

// Кеш для завантажених зображень
const imageCache = new Map();

export function getImage(path, basePath = '/') {
    if (!path) return null;

    // Якщо вже в кеші
    if (imageCache.has(path)) {
        return imageCache.get(path);
    }

    let resolvedPath = path;

    // Якщо шлях веде на наш домен, прибираємо домен для локальної обробки
    if (
        resolvedPath.startsWith('https://www.raznobyt.com/') ||
        resolvedPath.startsWith('http://raznobyt.com/') ||
        resolvedPath.startsWith('https://raznobyt.com/')
    ) {
        resolvedPath = resolvedPath.replace(/^https?:\/\/(catalog\.)?raznobyt\.com/, '');
    }

    // Якщо шлях все ще починається з http/https - це стороннє зовнішнє зображення
    if (resolvedPath.startsWith('http://') || resolvedPath.startsWith('https://')) {
        imageCache.set(path, resolvedPath);
        return resolvedPath;
    }

    // Якщо передано тільки ім'я файлу, будуємо повний шлях
    if (!resolvedPath.startsWith('/images/') && !resolvedPath.startsWith('/uploads/')) {
        resolvedPath = `${basePath}${resolvedPath}`;
    }

    // Конвертуємо розширення в .webp
    resolvedPath = resolvedPath.replace(/\.(jpe?g|png)$/i, '.webp');

    // Додаємо версію для оновлення кешу в браузерах та CDN
    resolvedPath = withVersion(resolvedPath);

    imageCache.set(path, resolvedPath);
    return resolvedPath;
}

// Спеціалізовані функції для різних типів контенту
export const getProductImage = (imagePath) => getImage(imagePath, '/images/products/');
export const getCategoryImage = (imagePath) => getImage(imagePath, '/images/categories/');
export const getIconImage = (imagePath) => getImage(imagePath, '/images/icons/');


// Компонент для ленивой загрузки зображень
export const preloadImages = (paths) => {
    paths.forEach(path => {
        const img = new Image();
        img.src = withVersion(path);
    });
};

// Маппінг кольорів
export const COLOR_MAP = {
    navy: '#1A3B6E', white: '#F0F0F0', khaki: '#7B7B4E', blue: '#2563EB',
    orange: '#EA6C1A', black: '#1A1A1A', gray: '#9CA3AF', green: '#2E7D5C',
    multicam: '#6B7A4A', yellow: '#FACC15', beige: '#C8B99A', brown: '#5D4037',
};