import staticProducts from '../data/products.js';

/**
 * Отримати товар синхронно по slug (для SSR та миттєвого рендеру)
 */
export function getProductBySlugSync(slug) {
    if (!slug) return null;
    return staticProducts.find((product) => product.slug === slug) ?? null;
}

/**
 * Завантажує всі товари
 */
export async function getProducts() {
    return staticProducts;
}

/**
 * Отримати товар по slug
 */
export async function getProductBySlug(slug) {
    return getProductBySlugSync(slug);
}

/**
 * Отримати всі товари категорії
 */
export async function getProductsByCategory(categoryId) {
    return staticProducts.filter((product) => product.category === categoryId);
}
