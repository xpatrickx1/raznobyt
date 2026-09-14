export const COMPOSITION_FIELDS = [
    { key: 'cotton', sheetKey: 'cotton' },
    { key: 'polyester', sheetKey: 'polyester' },
    { key: 'spandex', sheetKey: 'spandex' },
    { key: 'rayon', sheetKey: 'rayon' },
    { key: 'viscose', sheetKey: 'viscose' },
    { key: 'pbt', sheetKey: 'pbt' },
    { key: 'lyon', sheetKey: 'lyon' },
    { key: 'polyamidePA', sheetKey: 'polyamide PA' },
    { key: 'polypropylenePP', sheetKey: 'polypropylene PP' },
    { key: 'paraAramid', sheetKey: 'para aramid' },
    { key: 'antistatic', sheetKey: 'antistatic' },
    { key: 'modacrylicLyocellStaticControl', sheetKey: 'Modacrylic/Lyocell/Static-Control™' },
    { key: 'nomexKevlarAntiStatic', sheetKey: 'Nomex®/Kevlar®/Anti-Static' },
    { key: 'nomexParaAramidP140', sheetKey: 'Nomex®/Para-Aramid/p140' },
    { key: 'pbiKevlarAntistatic', sheetKey: 'PBI®/Kevlar®/Antistatic' },
    { key: 'lenzingFRAramid', sheetKey: 'Lenzing FR®/Aramid' },
    { key: 'paraAramidSolidPolymerCoating', sheetKey: 'Para-aramid/Solid polymer coating' },
    { key: 'frRayonParaAramidPolyamideAntistatic', sheetKey: 'FR Rayon/пара-арамід/поліамід/антистатик' },
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