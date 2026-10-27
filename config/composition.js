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
    { key: 'OWR', sheetKey: 'OWR' },
];

export const parseComposition = (row) => {
    return Object.fromEntries(
        COMPOSITION_FIELDS.map(({ key, sheetKey }) => {
            let val = row[sheetKey];
            if (val === undefined) {
                const foundKey = Object.keys(row).find(
                    k => k.trim().toLowerCase() === sheetKey.toLowerCase()
                );
                if (foundKey) val = row[foundKey];
            }
            let num = Number(val);
            if (isNaN(num)) {
                const s = String(val ?? '').trim().toLowerCase();
                if (s === 'true' || s === '1' || s === 'так' || s === 'yes' || s === '+') {
                    num = 1;
                } else {
                    num = 0;
                }
            }
            if (key === 'OWR' && (!num || num === 0)) {
                if (row.properties && /\b(owr|мво)\b/i.test(row.properties)) {
                    num = 1;
                }
            }
            return [key, num];
        })
    );
};