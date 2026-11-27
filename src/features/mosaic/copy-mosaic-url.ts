import { createMosaicUrl } from './create-mosaic-url';

export const copyMosaicUrl = async (tiles: Record<string, string>, href = window.location.href) => {
  if (!navigator.clipboard?.writeText) {
    throw new Error('Clipboard access is unavailable.');
  }
  await navigator.clipboard.writeText(createMosaicUrl(tiles, href));
};
