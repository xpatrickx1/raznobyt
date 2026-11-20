// Пагінація категорій (SEO-ТЗ T-20261119-01, завдання 4).
// Спільна для CategoryView (рендер) і scripts/generate.js (пререндер сторінок ?page=N).
export const CATEGORY_PAGE_SIZE = 9;

export function getTotalPages(count, pageSize = CATEGORY_PAGE_SIZE) {
    return Math.max(1, Math.ceil(count / pageSize));
}

// '?page=N' лише для N ≥ 2; перша сторінка — без параметра
export function pageQuery(page) {
    return page > 1 ? `?page=${page}` : '';
}
