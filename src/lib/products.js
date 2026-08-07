let productsPromise = null;

/**
 * Завантажує всі товари один раз
 */
export async function getProducts() {
    if (!productsPromise) {
        productsPromise = fetch('/products.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to load products.json');
                }

                return response.json();
            });
    }

    return productsPromise;
}

/**
 * Отримати товар по slug
 */
export async function getProductBySlug(slug) {
    const products = await getProducts();

    return products.find((product) => product.slug === slug) ?? null;
}

/**
 * Отримати всі товари категорії
 */
export async function getProductsByCategory(categoryId) {
    const products = await getProducts();

    return products.filter((product) => product.category === categoryId);
}