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
  'cotton'
]

const fetchSheet = async (sheetName) => {
  const url = `https://opensheet.elk.sh/${SHEET_ID}/${sheetName}`;
  const res = await fetch(url);
  const data = await res.json();

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

async function main() {
  console.log("🚀 Fetching data from Google Sheets...");

  const res = await Promise.all(CATEGORYES.map(fetchSheet));
  //   const data = await res.json();
  const flatData = res.flat();

  console.log(`📦 Rows: ${flatData.length}`);

  const products = flatData.map((row) => {
    let slug = row.slug || slugify(cleanTitle(row.title_ua), row.category);

    if (slugs.has(slug)) {
      slug = `${slug}-${row.category}`;
    }

    let counter = 1;
    let originalSlug = slug;
    while (slugs.has(slug)) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }
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

      images: row.images ? row.images.split(",") : [],

      description: {
        ua: row.desc_ua,
        ru: row.desc_ru,
      },

      attributes: {
        fabricType: row.fabricType,
        density: row.density,
        width: row.width || null,
        colors: row.colors ? row.colors.split(",") : [],
        properties: row.properties ? row.properties.split(",").map(s => s.trim()).filter(Boolean) : [],
        composition: {
          cotton: Number(row.cotton) || 0,
          polyester: Number(row.polyester) || 0,
          spandex: Number(row.spandex) || 0,
          rayon: Number(row.rayon) || 0,
          viscose: Number(row.viscose) || 0,
          pbt: Number(row.pbt) || 0,
          lyon: Number(row.lyon) || 0,
        },
      },
    };
  });



  //   const products = data.map((row) => {
  //     const slug = row.slug || slugify(row.title_ua);

  //     return {
  //       id: slug,
  //       slug,
  //       title: {
  //         ua: row.title_ua,
  //         ru: row.title_ru,
  //       },
  //       category: row.category,
  //       isNew: row.isNew === "true",

  //       images: row.images ? row.images.split(",") : [],

  //       description: {
  //         ua: row.description_ua,
  //         ru: row.description_ru,
  //       },

  //       attributes: {
  //         fabricType: row.fabricType,
  //         density: row.density,
  //         width: row.width || null,
  //         colors: row.colors ? row.colors.split(",") : [],
  //         composition: {
  //           cotton: Number(row.cotton) || 0,
  //           polyester: Number(row.polyester) || 0,
  //           spandex: Number(row.spandex) || 0,
  //           rayon: Number(row.rayon) || 0,
  //           viscose: Number(row.viscose) || 0,
  //           pbt: Number(row.pbt) || 0,
  //         },
  //       },
  //     };
  //   });

  await fs.writeFile(
    "public/products.json",
    JSON.stringify(products, null, 2)
  );

  console.log("✅ products.json updated");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});