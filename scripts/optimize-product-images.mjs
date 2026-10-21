
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();

const SOURCE_ROOTS = [
  path.join(ROOT, 'public/images/products'),
  path.join(ROOT, 'src/assets/images/products'),
];

const OUTPUT_ROOT = path.join(
  ROOT,
  'public/images/generated/products'
);

const SOURCE_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.tif',
  '.tiff',
]);

const MOBILE_WIDTH = 560;
const MOBILE_QUALITY = 78;

const THUMB_WIDTH = 160;
const THUMB_QUALITY = 75;

async function walk(dir) {
  let entries;

  try {
    entries = await fs.readdir(dir, {
      withFileTypes: true,
    });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }

  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Never process generated files as inputs.
        if (entry.name.toLowerCase() === 'generated') {
          return [];
        }

        return walk(fullPath);
      }

      return entry.isFile() ? [fullPath] : [];
    })
  );

  return nested.flat();
}

async function isUpToDate(source, output) {
  try {
    const [srcStat, outStat] = await Promise.all([
      fs.stat(source),
      fs.stat(output),
    ]);

    return outStat.mtimeMs >= srcStat.mtimeMs;
  } catch {
    return false;
  }
}

async function generateVariant(
  source,
  output,
  width,
  quality
) {
  if (await isUpToDate(source, output)) {
    return 'skipped';
  }

  await fs.mkdir(path.dirname(output), {
    recursive: true,
  });

  await sharp(source, { failOn: 'none' })
    .rotate()
    .resize({
      width,
      withoutEnlargement: true,
      fit: 'inside',
    })
    .webp({
      quality,
      effort: 5,
    })
    .toFile(output);

  return 'generated';
}

async function main() {
  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const sourceRoot of SOURCE_ROOTS) {
    const files = await walk(sourceRoot);

    for (const source of files) {
      const extension = path.extname(source).toLowerCase();

      if (!SOURCE_EXTENSIONS.has(extension)) {
        continue;
      }

      const relative = path.relative(sourceRoot, source);
      const relativeDir = path.dirname(relative);
      const basename = path.basename(source, extension);

      // Remove the original extension before adding the suffix.
      // Example: main/65576.jpg -> main/65576.mobile.webp
      const outputBase = path.join(
        relativeDir,
        basename
      );

      const variants = [
        {
          suffix: '.mobile.webp',
          width: MOBILE_WIDTH,
          quality: MOBILE_QUALITY,
        },
        {
          suffix: '.thumb.webp',
          width: THUMB_WIDTH,
          quality: THUMB_QUALITY,
        },
      ];

      for (const variant of variants) {
        const outputRelative =
          `${outputBase}${variant.suffix}`;

        const output = path.join(
          OUTPUT_ROOT,
          outputRelative
        );

        try {
          const result = await generateVariant(
            source,
            output,
            variant.width,
            variant.quality
          );

          if (result === 'generated') {
            generated++;

            console.log(
              `Generated: ${path.relative(ROOT, output)}`
            );
          } else {
            skipped++;
          }
        } catch (error) {
          failed++;

          console.error(
            `Failed: ${source}`,
            error
          );
        }
      }
    }
  }

  console.log(
    `Image variants complete. Generated: ${generated}; ` +
    `up-to-date: ${skipped}; failed: ${failed}.`
  );

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('Image variant generation failed:', error);
  process.exitCode = 1;
});
