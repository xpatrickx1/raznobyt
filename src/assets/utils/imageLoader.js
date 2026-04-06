// src/assets/utils/imageLoader.js

/**
 * Універсальний завантажувач зображень
 * @param {string} path - шлях до зображення (починається з /images/ або /uploads/)
 * @param {string} basePath - базовий шлях (за замовчуванням '/')
 * @returns {Promise<string>} - URL зображення
 */

// Кеш для завантажених зображень
const imageCache = new Map();

export async function getImage(path, basePath = '/') {
    if (!path) return null;

    // Якщо вже в кеші
    if (imageCache.has(path)) {
        return imageCache.get(path);
    }

    // Якщо шлях починається з http/https - зовнішнє зображення
    // if (path.startsWith('http://') || path.startsWith('https://')) {
    //     imageCache.set(path, path);
    //     return path;
    // }

    // Якщо шлях вже починається з /images/ або /uploads/
    // if (path.startsWith('/images/') || path.startsWith('/uploads/')) {
    //     // Для публічних файлів повертаємо як є
    //     imageCache.set(path, path);
    //     return path;
    // }

    // Якщо передано тільки ім'я файлу, будуємо повний шлях
    const fullPath = `${basePath}${path}`;
    imageCache.set(path, fullPath);
    return fullPath;
}

// Спеціалізовані функції для різних типів контенту
export const getProductImage = (imagePath) => getImage(imagePath, '/images/products/');
export const getCategoryImage = (imagePath) => getImage(imagePath, '/images/categories/');
export const getIconImage = (imagePath) => getImage(imagePath, '/images/icons/');

// Компонент для ленивой загрузки зображень
export const preloadImages = (paths) => {
    paths.forEach(path => {
        const img = new Image();
        img.src = path;
    });
};

// Маппінг кольорів
export const COLOR_MAP = {
    navy: '#1A3B6E', white: '#F0F0F0', khaki: '#7B7B4E', blue: '#2563EB',
    orange: '#EA6C1A', black: '#1A1A1A', gray: '#9CA3AF', green: '#2E7D5C',
    multicam: '#6B7A4A', yellow: '#FACC15', beige: '#C8B99A', brown: '#5D4037',
};