import fs from "fs/promises";

const SHEET_ID = "13NoI2T3HhTNghuSdgfsYEC20DuHVNENtc11pEkPd0q4";

const CATEGORYES = [
  'workwear',
  'medical',
  'industrial',
  'personal',
  'fire',
  'army',
  'shirts',
  'jackets',
  'interlinings',
  'cotton',
  'linen',
  'jeans',
  'fleece',
];

const fetchSheet = async (sheetName) => {
  const url = `https://opensheet.elk.sh/${SHEET_ID}/${sheetName}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  });
  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`HTTP error! status: ${res.status} for sheet ${sheetName}. Response: ${errorText}`);
  }
  const data = await res.json();

  if (!Array.isArray(data)) {
    console.error(`Received invalid JSON for sheet "${sheetName}":`, data);
    throw new Error(`Data is not an array for sheet ${sheetName}`);
  }

  return data.map((row) => ({
    ...row,
    category: sheetName,
  }));
};

const slugs = new Set();

const slugify = (text = '') =>
  String(text)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const parseColors = (colorsStr) => {
  if (!colorsStr || colorsStr.trim() === "") return [];

  // 1. Спробуємо JSON (старий формат)
  // try {
  //   const parsed = JSON.parse(colorsStr);
  //   if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].image) {
  //     return parsed.map((c, idx) => {
  //       const imgPath = c.image.trim();
  //       const imageUrl = imgPath.startsWith("http")
  //         ? imgPath
  //         : `http://catalog.raznobyt.com/images/products/${imgPath}`;
  //       return {
  //         color: c.color || imgPath.replace(/\.[^.]+$/, ""),
  //         image: imageUrl,
  //         isMain: idx === 0,
  //       };
  //     });
  //   }
  // } catch (_) {
  //   // не JSON — йдемо далі
  // }

  // 2. Новий формат: рядок з комами (шляхи до файлів)
  return colorsStr.split(",").map((s, idx) => {
    const path = s.trim();
    if (!path) return null;

    const parts = path.replace(/\\/g, "/").split("/");
    const filename = parts[parts.length - 1];
    const colorName = filename.replace(/\.[^.]+$/, ""); // ім'я файлу без розширення

    const imageUrl = `http://catalog.raznobyt.com/images/products/${path}`;

    return {
      color: colorName,
      image: imageUrl,
      isMain: idx === 0,
    };
  }).filter(Boolean);
};

async function main() {
  console.log("🚀 Fetching data from Google Sheets...");

  const makeUniqueSlug = (base, category) => {
    let slug = base ? (category ? `${base}-${category}` : base) : `product-${category}`;

    if (!slugs.has(slug)) {
      slugs.add(slug);
      return slug;
    }

    let i = 2;
    while (slugs.has(`${slug}-${i}`)) i += 1;

    slug = `${slug}-${i}`;
    slugs.add(slug);
    return slug;
  };

  const products = [];
  let totalRows = 0;

  for (const sheetName of CATEGORYES) {
    let data;
    let attempts = 3;
    while (attempts > 0) {
      try {
        data = await fetchSheet(sheetName);
        break;
      } catch (err) {
        attempts--;
        console.warn(`  ⚠️ Failed fetching "${sheetName}". Error: ${err.message}. Retrying... (attempts left: ${attempts})`);
        if (attempts === 0) throw err;
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }
    // 300ms delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 300));

    totalRows += data.length;

    for (const row of data) {
      const baseSlug = `tkan-${sheetName}-${slugify(row.title)}`;
      const slug = makeUniqueSlug(baseSlug, '');
      console.log(slug);

      products.push({
        id: slug,
        category: sheetName,
        slug,
        title: {
          ua: "Тканина " + row.title,
          ru: "Ткань " + row.title,
        },
        isNew: row.isNew === "true",
        images: parseColors(row.images).map(c => c.image),
        description: {
          ua: row.desc_ua,
          ru: row.desc_ru,
        },
        attributes: {
          fabricType: row.fabricType,
          density: row.density,
          width: row.width || null,
          colors: parseColors(row.images), // [{ color, image, isMain }]
          properties: row.properties ? row.properties.split(",").map(s => s.trim()).filter(Boolean) : [],
          composition: {
            cotton: Number(row.cotton) || 0,
            polyester: Number(row.polyester) || 0,
            spandex: Number(row.spandex) || 0,
            rayon: Number(row.rayon) || 0,
            viscose: Number(row.viscose) || 0,
            pbt: Number(row.pbt) || 0,
            lyon: Number(row.lyon) || 0,
            polyamide: Number(row["polyamide PA"]) || 0,
            polypropylene: Number(row["polypropylene PP"]) || 0,
            paraAramid: Number(row["para aramid"]) || 0,
            antistatic: Number(row.antistatic) || 0,
            'Modacrylic/Lyocell/Static-Control™': Number(row["Modacrylic/Lyocell/Static-Control™"]) || 0,
            'Nomex®/Kevlar®/Anti-Static': Number(row["Nomex®/Kevlar®/Anti-Static"]) || 0,
            'Nomex®/Para-Aramid/p140': Number(row["Nomex®/Para-Aramid/p140"]) || 0,
            'PBI®/Kevlar®/Antistatic': Number(row["PBI®/Kevlar®/Antistatic"]) || 0,
            'Lenzing FR®/Aramid': Number(row["Lenzing FR®/Aramid"]) || 0,
            'Para-aramid/Solid polymer coating': Number(row["Para-aramid/Solid polymer coating"]) || 0,
            'FR Rayon/пара-арамід/поліамід/антистатик': Number(row["FR Rayon/пара-арамід/поліамід/антистатик"]) || 0,
            'viscose': Number(row.viscose) || 0,
            'polyamide PA': Number(row["polyamide PA"]) || 0,
            'polypropylene PP': Number(row["polypropylene PP"]) || 0,
            'para aramid': Number(row["para aramid"]) || 0,
            'MAC': Number(row["MAC"]) || 0,
            'spandex': Number(row.spandex) || 0,
            'pbt': Number(row.pbt) || 0,
            'rayon': Number(row.rayon) || 0
          },
        },
      });
    }
  }

  console.log(`📦 Rows: ${totalRows}`);

  await fs.writeFile(
    "public/products.json",
    JSON.stringify(products, null, 2)
  );

  // Write per-category JSON files
  const byCategory = {};
  for (const p of products) {
    if (!byCategory[p.category]) byCategory[p.category] = [];
    byCategory[p.category].push(p);
  }

  for (const [cat, items] of Object.entries(byCategory)) {
    await fs.writeFile(
      `src/data/products/${cat}.json`,
      JSON.stringify(items, null, 2)
    );
    console.log(`  📁 ${cat}.json (${items.length} products)`);
  }

  console.log("✅ products.json and per-category files updated");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});