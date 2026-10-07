export const COMPOSITION_OPTIONS = [
    { id: 'cotton_100', label: 'бавовна', labelRu: 'хлопок' },
    { id: 'cotton_poly', label: 'бавовна/поліестр', labelRu: 'хлопок/полиэстер' },
    { id: 'poly_cotton', label: 'поліестр/бавовна', labelRu: 'полиэстер/хлопок' },
    { id: 'poly_100', label: 'поліестр', labelRu: 'полиэстер' },
    { id: 'cotton', label: 'бавовна', labelRu: 'хлопок' },
    { id: 'polyester', label: 'поліестр', labelRu: 'полиэстер' },
    { id: 'viscose', label: 'Віскоза', labelRu: 'Вискоза' },
    { id: 'rayon', label: 'Rayon', labelRu: 'Rayon' },
    { id: 'spandex', label: 'Спандекс/Стрейч', labelRu: 'Спандекс/Стретч' },
    { id: 'pbt', label: 'PBT', labelRu: 'PBT' },
    { id: 'lyon', label: 'Льон', labelRu: 'Лён' },
    { id: 'polyamide', label: 'Поліамід', labelRu: 'Полиамид' },
    { id: 'polyamide PA', label: 'Поліамід', labelRu: 'Полиамид' },
    { id: 'polypropylene', label: 'Поліпропілен', labelRu: 'Полипропилен' },
    { id: 'polypropylene PP', label: 'Поліпропілен', labelRu: 'Полипропилен' },
    { id: 'paraAramid', label: 'Пара-арамід', labelRu: 'Пара-арамид' },
    { id: 'para aramid', label: 'Пара-арамід', labelRu: 'Пара-арамид' },
    { id: 'antistatic', label: 'Static-Control™', labelRu: 'Static-Control™' },
    { id: 'Modacrylic/Lyocell/Static-Control™', label: 'Модакрил/Ліоцел/Static-Control™', labelRu: 'Модакрил/Лиоцелл/Static-Control™' },
    { id: 'Nomex®/Kevlar®/Anti-Static', label: 'Nomex®/Kevlar®/Anti-Static', labelRu: 'Nomex®/Kevlar®/Anti-Static' },
    { id: 'Nomex®/Para-Aramid/p140', label: 'Nomex®/Para-Aramid/p140', labelRu: 'Nomex®/Para-Aramid/p140' },
    { id: 'PBI®/Kevlar®/Antistatic', label: 'PBI®/Kevlar®/Antistatic', labelRu: 'PBI®/Kevlar®/Antistatic' },
    { id: 'Lenzing FR®/Aramid', label: 'Lenzing FR®/Aramid', labelRu: 'Lenzing FR®/Aramid' },
    { id: 'Para-aramid/Solid polymer coating', label: 'Para-aramid/Solid polymer coating', labelRu: 'Para-aramid/Solid polymer coating' },
    { id: 'FR Rayon/пара-арамід/поліамід/антистатик', label: 'FR Rayon/пара-арамід/поліамід/антистатик', labelRu: 'FR Rayon/пара-арамід/поліамід/антистатик' },
    { id: 'MAC', label: 'MAC', labelRu: 'MAC' },
];

export const getCompositionOption = (id) => {
    if (id === 'cotton') return COMPOSITION_OPTIONS.find(o => o.id === 'cotton_100') || COMPOSITION_OPTIONS.find(o => o.id === 'cotton');
    if (id === 'polyester') return COMPOSITION_OPTIONS.find(o => o.id === 'poly_100') || COMPOSITION_OPTIONS.find(o => o.id === 'polyester');
    return COMPOSITION_OPTIONS.find(o => o.id === id);
};

export const getCompositionParts = (compObj, lang) => {
    if (!compObj) return [];
    if (typeof compObj === 'string') return [compObj];

    return Object.entries(compObj)
        .filter(([key, value]) => Number(value) > 0)
        .map(([key, value]) => {
            const opt = COMPOSITION_OPTIONS.find(o => o.id === key);
            let name = opt ? (lang === 'ua' ? opt.label : opt.labelRu) : key;

            if (Number(value) === 1 && key !== 'antistatic') return `${name}`;
            return `${value}%\u00A0${name}`;
        });
};

export const formatComposition = (compObj, lang) => {
    return getCompositionParts(compObj, lang).join(', ');
};

export const getProductCompositionGroups = (product) => {
    const comp = product?.attributes?.composition;
    if (!comp) return [];

    let cotton = 0;
    let polyester = 0;
    const otherKeys = [];

    if (typeof comp === 'object') {
        cotton = Number(comp.cotton) || 0;
        polyester = Number(comp.polyester) || 0;
        Object.entries(comp).forEach(([k, v]) => {
            if (k !== 'cotton' && k !== 'polyester' && Number(v) > 0) {
                otherKeys.push(k);
            }
        });
    } else if (typeof comp === 'string') {
        const cMatch = comp.match(/(\d+(?:[.,]\d+)?)\s*%\s*(?:бавовн|хлопок|cotton)/i);
        const pMatch = comp.match(/(\d+(?:[.,]\d+)?)\s*%\s*(?:поліест|полиэст|polyester)/i);
        if (cMatch) {
            cotton = parseFloat(cMatch[1].replace(',', '.'));
        } else if (/100%\s*(?:бавовн|хлопок|cotton)/i.test(comp)) {
            cotton = 100;
        }

        if (pMatch) {
            polyester = parseFloat(pMatch[1].replace(',', '.'));
        } else if (/100%\s*(?:поліест|полиэст|polyester)/i.test(comp)) {
            polyester = 100;
        }

        if (cotton === 0 && polyester === 0) {
            otherKeys.push(comp);
        }
    }

    const groups = [];

    // 1. бавовна: всі з 100% бавовна
    if (cotton >= 98 && polyester === 0) {
        groups.push('cotton_100');
    }

    // 2. бавовна/поліестр: всі з бавовна > 50%
    if (cotton >= 50 && cotton < 98 && (polyester > 0 || cotton < 100)) {
        groups.push('cotton_poly');
    }

    // 3. поліестр/бавовна: всі з бавовна < 50%
    if (cotton > 0 && cotton <= 50 && polyester > 0) {
        groups.push('poly_cotton');
    }

    // 4. поліестр: всі з 100% поліестр
    if (polyester >= 98 && cotton === 0) {
        groups.push('poly_100');
    }

    // Інші волокна (якщо присутні)
    otherKeys.forEach(k => {
        if (k !== 'antistatic' && k !== 'spandex') {
            groups.push(k);
        }
    });

    return groups;
};
