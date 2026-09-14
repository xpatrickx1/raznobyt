import { COMPOSITION_FIELDS } from "../config/composition.js";

function toNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
}

function getAttr(obj, prop) {
    return obj?.attributes?.[prop] ?? obj?.[prop];
}

function compositionSimilarity(compA, compB) {
    let difference = 0;

    for (const field of COMPOSITION_FIELDS) {
        difference += Math.abs(
            toNumber(compA[field.key]) - toNumber(compB[field.key])
        );
    }

    // Максимальна можлива різниця = 200
    // 0 = абсолютно однаковий склад
    // 200 = повністю різний склад
    return Math.max(0, 1 - difference / 200);
}

function densitySimilarity(a, b) {
    const densityA = toNumber(getAttr(a, 'density'));
    const densityB = toNumber(getAttr(b, 'density'));

    if (!densityA || !densityB) {
        return 0;
    }

    const difference = Math.abs(densityA - densityB);

    if (difference <= 10) return 1;
    if (difference <= 20) return 0.8;
    if (difference <= 30) return 0.6;
    if (difference <= 50) return 0.3;

    return 0;
}

function widthSimilarity(a, b) {
    const widthA = toNumber(getAttr(a, 'width'));
    const widthB = toNumber(getAttr(b, 'width'));

    if (!widthA || !widthB) {
        return 0;
    }

    const difference = Math.abs(widthA - widthB);

    if (difference <= 5) return 1;
    if (difference <= 10) return 0.8;
    if (difference <= 20) return 0.5;
    if (difference <= 30) return 0.2;

    return 0;
}

function getSimilarityScore(product, candidate) {
    let score = 0;

    // 1. Категорія — 40 балів
    const catA = product.category;
    const catB = candidate.category;
    if (catA && catB && catA === catB) {
        score += 40;
    }

    // 2. Тип тканини — 25 балів
    const typeA = getAttr(product, 'fabricType');
    const typeB = getAttr(candidate, 'fabricType');
    if (typeA && typeB && typeA === typeB) {
        score += 25;
    }

    // 3. Щільність — 15 балів
    score += densitySimilarity(product, candidate) * 15;

    // 4. Ширина — 10 балів
    score += widthSimilarity(product, candidate) * 10;

    // 5. Склад — 10 балів
    const compA = getAttr(product, 'composition') || {};
    const compB = getAttr(candidate, 'composition') || {};
    score += compositionSimilarity(compA, compB) * 10;

    return score;
}

export function getSimilarProducts(
    product,
    products,
    limit = 4
) {
    if (!product || !Array.isArray(products)) {
        return [];
    }

    return products
        // Не показуємо поточний товар
        .filter(candidate => candidate.id !== product.id)

        // Рахуємо score
        .map(candidate => ({
            product: candidate,
            score: getSimilarityScore(product, candidate),
        }))

        // Найбільш схожі першими
        .sort((a, b) => b.score - a.score)

        // Беремо потрібну кількість
        .slice(0, limit)

        // Повертаємо тільки товари
        .map(item => item.product);
}