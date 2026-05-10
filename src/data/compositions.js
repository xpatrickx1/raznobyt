export const COMPOSITION_OPTIONS = [
    { id: 'cotton', label: 'Бавовна', labelRu: 'Хлопок' },
    { id: 'polyester', label: 'Поліестр', labelRu: 'Полиэстер' },
    { id: 'viscose', label: 'Віскоза', labelRu: 'Вискоза' },
    { id: 'rayon', label: 'Rayon', labelRu: 'Rayon' },
    { id: 'spandex', label: 'Спандекс/Стрейч', labelRu: 'Спандекс/Стретч' },
    { id: 'pbt', label: 'PBT', labelRu: 'PBT' },
    { id: 'lyon', label: 'Льон', labelRu: 'Лён' },
];

export const formatComposition = (compObj, lang) => {
    if (!compObj) return '';
    if (typeof compObj === 'string') return compObj;

    return Object.entries(compObj)
        .filter(([key, value]) => value > 0)
        .map(([key, value]) => {
            const opt = COMPOSITION_OPTIONS.find(o => o.id === key);
            let name = opt ? (lang === 'ua' ? opt.label : opt.labelRu) : key;

            // Convert to lowercase for inline display, except for acronyms like PBT
            if (name !== 'PBT') {
                name = name.toLowerCase();
            }

            return `${value}% ${name}`;
        }).join(', ');
};
