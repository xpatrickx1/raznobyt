
/**
 * Converts a product image URL into a generated variant URL.
 *
 * Examples:
 * /images/products/BG%209030/main/65576.jpg
 *   -> /images/generated/products/BG%209030/main/65576.mobile.webp
 *
 * /images/products/BG%209030/65615.jpg
 *   -> /images/generated/products/BG%209030/65615.thumb.webp
 *
 * 
 * Every product image supports both mobile and thumbnail variants.
 */

import { withVersion } from '../assets/utils/imageLoader.js';

export function getProductImageVariant(imageUrl, variant = 'mobile') {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return null;
  }

  if (variant !== 'mobile' && variant !== 'thumb') {
    return null;
  }

  // Відокремлюємо query-параметри або хеш (наприклад, ?v=...), якщо вони вже є
  const queryIndex = imageUrl.search(/[?#]/);
  const cleanUrl = queryIndex !== -1 ? imageUrl.slice(0, queryIndex) : imageUrl;

  const productPrefix = '/images/products/';
  const index = cleanUrl.indexOf(productPrefix);

  if (index === -1) {
    return null;
  }

  const pathAfterPrefix = cleanUrl.slice(
    index + productPrefix.length
  );

  // Split the original extension from the filename.
  const lastSlash = pathAfterPrefix.lastIndexOf('/');
  const filename = pathAfterPrefix.slice(lastSlash + 1);
  const extensionIndex = filename.lastIndexOf('.');

  if (extensionIndex <= 0) {
    return null;
  }

  const filenameWithoutExtension = filename.slice(
    0,
    extensionIndex
  );

  const directory = pathAfterPrefix.slice(0, lastSlash + 1);

  const suffix =
    variant === 'thumb'
      ? '.thumb.webp'
      : '.mobile.webp';

  const generatedPath =
    `/images/generated/products/${directory}` +
    `${filenameWithoutExtension}${suffix}`;

  const generatedUrl = cleanUrl.slice(0, index) + generatedPath;

  return withVersion(generatedUrl);
}
