export const COMPOSITION_FIELDS = [
    { key: 'cotton', sheetKey: 'cotton' },
    { key: 'polyester', sheetKey: 'polyester' },
    { key: 'spandex', sheetKey: 'spandex' },
    { key: 'rayon', sheetKey: 'rayon' },
    { key: 'viscose', sheetKey: 'viscose' },
    { key: 'pbt', sheetKey: 'pbt' },
    { key: 'lyon', sheetKey: 'lyon' },
    { key: 'polyamide PA', sheetKey: 'polyamide PA' },
    { key: 'polypropylene PP', sheetKey: 'polypropylene PP' },
    { key: 'para aramid', sheetKey: 'para aramid' },
    { key: 'antistatic', sheetKey: 'antistatic' },
    { key: 'Modacrylic/Lyocell/Static-Control™', sheetKey: 'Modacrylic/Lyocell/Static-Control™' },
    { key: 'Nomex®/Kevlar®/Anti-Static', sheetKey: 'Nomex®/Kevlar®/Anti-Static' },
    { key: 'Nomex®/Para-Aramid/p140', sheetKey: 'Nomex®/Para-Aramid/p140' },
    { key: 'PBI®/Kevlar®/Antistatic', sheetKey: 'PBI®/Kevlar®/Antistatic' },
    { key: 'Lenzing FR®/Aramid', sheetKey: 'Lenzing FR®/Aramid' },
    { key: 'Para-aramid/Solid polymer coating', sheetKey: 'Para-aramid/Solid polymer coating' },
    { key: 'FR Rayon/пара-арамід/поліамід/антистатик', sheetKey: 'FR Rayon/пара-арамід/поліамід/антистатик' },
    { key: 'MAC', sheetKey: 'MAC' },
];

export const parseComposition = (row) => {
    return Object.fromEntries(
        COMPOSITION_FIELDS.map(({ key, sheetKey }) => [
            key,
            Number(row[sheetKey]) || 0,
        ])
    );
};