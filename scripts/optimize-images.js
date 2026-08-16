import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

const extReg = /\.(jpe?g|png)$/i;

async function getFiles(dir) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    }));
    return files.flat();
}

async function cleanup(distDir) {
    console.log(`🧹 Cleaning up original images in ${distDir}...`);
    if (!existsSync(distDir)) {
        console.log(`⚠️ Directory ${distDir} does not exist. Skipping cleanup.`);
        return;
    }
    const files = await getFiles(distDir);
    let count = 0;
    for (const file of files) {
        if (extReg.test(file)) {
            await fs.unlink(file);
            count++;
        }
    }
    console.log(`✅ Removed ${count} original images from dist.`);
}

async function optimize(srcDir) {
    console.log(`🚀 Optimizing images in ${srcDir}...`);
    if (!existsSync(srcDir)) {
        console.log(`⚠️ Directory ${srcDir} does not exist. Skipping.`);
        return;
    }
    const files = await getFiles(srcDir);
    let optimizedCount = 0;
    let skippedCount = 0;

    for (const file of files) {
        if (!extReg.test(file)) continue;

        // Skip icons directory - we don't want to optimize small icons
        if (file.toLowerCase().includes(path.sep + 'icons' + path.sep) || file.toLowerCase().includes('/icons/')) {
            continue;
        }

        const webpPath = file.replace(extReg, '.webp');

        // 1. Caching check: Check modification times
        try {
            const fileStat = await fs.stat(file);
            let webpStat = null;
            if (existsSync(webpPath)) {
                webpStat = await fs.stat(webpPath);
            }
            if (webpStat && webpStat.mtime >= fileStat.mtime) {
                skippedCount++;
                continue;
            }
        } catch (e) {
            // Stat error, run optimization anyway
        }

        // 2. Width constraint: main product/category photos (1600px) or colors/thumbnails (600px)
        let maxWidth = 1600;
        if (file.toLowerCase().includes(path.sep + 'colors' + path.sep) || file.toLowerCase().includes('/colors/')) {
            maxWidth = 600;
        }

        try {
            const originalMetadata = await sharp(file).metadata();

            let pipeline = sharp(file);
            if (originalMetadata.width > maxWidth) {
                pipeline = pipeline.resize({
                    width: maxWidth,
                    withoutEnlargement: true,
                    fit: 'inside'
                });
            }

            // Convert to webp with 80% quality (keeps alpha channel by default)
            await pipeline
                .webp({ quality: 80 })
                .toFile(webpPath);

            console.log(`⚡ Optimized: ${path.relative(process.cwd(), file)} -> ${path.relative(process.cwd(), webpPath)}`);
            optimizedCount++;
        } catch (err) {
            console.error(`❌ Failed to optimize ${file}:`, err);
        }
    }

    console.log(`📈 Summary for ${srcDir}: Optimized ${optimizedCount} files, skipped ${skippedCount} (cached).`);
}

async function main() {
    const args = process.argv.slice(2);
    if (args.includes('--cleanup')) {
        await cleanup(path.resolve('dist/images'));
    } else {
        await optimize(path.resolve('public/images'));
        await optimize(path.resolve('src/assets/images'));
    }
}

main().catch((err) => {
    console.error("❌ Error in optimize-images:", err);
    process.exit(1);
});
