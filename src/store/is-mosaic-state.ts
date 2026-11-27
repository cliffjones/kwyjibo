import { isPlainObject } from '../processing/is-plain-object';
import { isColorCode } from './is-color-code';
import type { MosaicState } from './types';

export const isMosaicState = (value: unknown): value is MosaicState => {
  if (!isPlainObject(value)) {
    return false;
  }

  const mosaic = value as Record<string, unknown>;
  if (
    !isColorCode(mosaic.currentColor) ||
    !isPlainObject(mosaic.tiles) ||
    !Array.isArray(mosaic.colorOptions) ||
    mosaic.colorOptions.length < 1 ||
    mosaic.colorOptions.length > 4 ||
    !mosaic.colorOptions.every(isColorCode) ||
    !mosaic.colorOptions.includes(mosaic.currentColor)
  ) {
    return false;
  }

  return Object.entries(mosaic.tiles).every(([tileKey, color]) => /^\d+,\d+$/.test(tileKey) && isColorCode(color));
};
