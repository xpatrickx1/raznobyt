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
  'fleece'
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

const cleanTitle = (text = "") =>
  text
    .toLowerCase()
    .replace(/тканина|ткань/g, "")
    .trim();

const slugify = (text = "", category = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "") + `-${category}`;

// 🔥 НОВА ФУНКЦІЯ ДЛЯ ПАРСИНГУ КОЛЬОРІВ
const parseColors = (colorsStr) => {
  if (!colorsStr || colorsStr.trim() === "") return [];

  try {
    const parsed = JSON.parse(colorsStr);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (parsed.colors) return parsed.colors;
    if (parsed.items) return parsed.items;
    return [];
  } catch (e) {
    // Якщо це звичайний рядок з комами
    return colorsStr.split(",").map(s => s.trim()).filter(Boolean);
  }
};

// 🔥 НОВА ФУНКЦІЯ ДЛЯ ПАРСИНГУ ЗОБРАЖЕНЬ (щоб не обрізало JSON)
const parseImages = (imagesStr) => {
  if (!imagesStr || imagesStr.trim() === "") return [];

  // Спершу пробуємо як JSON
  try {
    const parsed = JSON.parse(imagesStr);
    if (Array.isArray(parsed)) {
      return parsed.map(img => {
        let trimmed = img.trim();
        if (trimmed && !trimmed.startsWith("http")) {
          return `https://catalog.raznobyt.com/images/products/${trimmed}`;
        }
        return trimmed;
      }).filter(Boolean);
    }
  } catch (e) {
    // Якщо не JSON — розбиваємо по комах
    return imagesStr.split(",").map(img => {
      let trimmed = img.trim();
      if (trimmed && !trimmed.startsWith("http")) {
        return `https://catalog.raznobyt.com/images/products/${trimmed}`;
      }
      return trimmed;
    }).filter(Boolean);
  }

  return [];
};

async function main() {
  console.log("🚀 Fetching data from Google Sheets...");

  const res = [];
  for (const category of CATEGORYES) {
    let data;
    let attempts = 3;
    while (attempts > 0) {
      try {
        data = await fetchSheet(category);
        break;
      } catch (err) {
        attempts--;
        console.warn(`  ⚠️ Failed fetching "${category}". Error: ${err.message}. Retrying... (attempts left: ${attempts})`);
        if (attempts === 0) throw err;
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }
    res.push(data);
    // 300ms delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  const flatData = res.flat();

  console.log(`📦 Rows: ${flatData.length}`);

  const products = flatData.map((row) => {
    let slug = `tkan-${row.category}-${cleanTitle(row.title_ua).replace(/\s+/g, '-').replace(/[^\w-]+/g, '')}`;

    // if (slugs.has(slug)) {
    //   slug = `${slug}`;
    // }

    // let counter = 1;
    // let originalSlug = slug;
    // while (slugs.has(slug)) {
    //   slug = `${originalSlug}-${counter}`;
    //   counter++;
    // }
    slugs.add(slug);

    console.log(slug);

    return {
      id: slug,
      category: row.category,
      slug,
      title: {
        ua: row.title_ua,
        ru: row.title_ru,
      },
      isNew: row.isNew === "true",
      images: parseColors(row.colors)
        .filter(c => c.image)
        .map(c => {
          const img = c.image.trim();
          // return img.startsWith("http") ? img : `https://catalog.raznobyt.com/images/products/${img}`;
          return img.startsWith("http") ? img : `http://catalog.raznobyt.com/images/products/${img}`;
        }),
      description: {
        ua: row.desc_ua,
        ru: row.desc_ru,
      },
      attributes: {
        fabricType: row.fabricType,
        density: row.density,
        width: row.width || null,
        colors: parseColors(row.colors),
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
        },
      },
    };
  });

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